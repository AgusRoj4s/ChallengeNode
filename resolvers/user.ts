const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { combineResolvers } = require('graphql-resolvers');
import mongoose = require('mongoose');

const Recipe = require('../database/models/recipe');
const User = require('../database/models/user');
const { isAuthenticated } = require('./middleware');

module.exports = {
    Query: {
        user: combineResolvers(isAuthenticated, async(_, __, { email }) => {
            try {
                const user = await User.findOne({ email });
                if (!user) {
                    throw new Error('User not found');
                }
                return user;
            } catch (error) {
                console.log(error);
                throw error;
            }
        })
    },
    Mutation: {
        signup: async(_, { input }) => {
            try {
                const user = await User.findOne({ email: input.email });
                if (user) {
                    throw new Error('Email alredy in use');
                }
                const hashedPassword = await bcrypt.hash(input.password, 12);
                const newUser = new User({...input, password: hashedPassword });
                const result = await newUser.save();
                return result;
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        login: async(_, { input }) => {
            try {
                const user = await User.findOne({ email: input.email });
                if (!User) {
                    throw new Error('User not found');
                }
                const isPasswordValid = await bcrypt.compare(input.password, user.password);
                if (!isPasswordValid) {
                    throw new Error('Incorrect Password');
                }
                const secret = process.env.JWT_SECRET_KEY || 'mysecretkey';
                const token = jwt.sign({ email: user.email }, secret, { expiresIn: '1d' });
                return { token };
            } catch (error) {
                console.log(error);
                throw error;
            }
        }
    },
    User: {
        recipes: async({ id }) => {
            try {
                const recipes = await Recipe.find({ user: id });
                return recipes;
            } catch (error) {
                console.log(error);
                throw error;
            }
        }
    }
};