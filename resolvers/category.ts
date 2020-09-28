const { UserInputError } = require('apollo-server-express');
const { combineResolvers } = require('graphql-resolvers');
//const uuid = require('uuid');
import mongoose = require('mongoose');

const { isAuthenticated } = require('./middleware');

const Recipe = require('../database/models/recipe');
const User = require('../database/models/user');
const Category = require('../database/models/category');
const category = require('../typeDefs/category');

const { stringToBase64, base64ToString } = require('../helper');

module.exports = {
    Query: {
        categories: combineResolvers(isAuthenticated, async(_, { skip = 0, limit = 10 }) => {
            try {
                const categories = await Category.find().sort({ _id: -1 }).skip(skip).limit(limit);
                return categories;
            } catch (error) {
                console.log(error);
                throw error;
            }
        }),
        category: combineResolvers(isAuthenticated, async(_, { id }) => {
            try {
                const category = await Category.findById(id);
                return category;
            } catch (error) {
                console.log(error);
                throw error;
            }
        }),
        categoryName: combineResolvers(isAuthenticated, async(_, { input }) => {
            try {
                const category = await Category.findOne({ name: input.name });
                return category;
            } catch (error) {
                console.log(error);
                throw error;
            }
        })
    },
    Mutation: {
        createCategory: combineResolvers(isAuthenticated, async(_, { input }) => {
            try {
                const category = new Category({...input });
                const result = await category.save();
                return result;
            } catch (error) {
                console.log(error);
                throw error;
            }
        }),
        updateCategory: combineResolvers(isAuthenticated, async(_, { id, input }) => {
            try {
                const category_f = await Category.findById(id);
                if (!category_f) {
                    throw new Error('Category not found');
                } else {
                    const category = await Category.findByIdAndUpdate(id, {...input }, { new: true });
                    return category;
                }
            } catch (error) {
                console.log(error);
                throw error;
            }
        }),
        deleteCategory: combineResolvers(isAuthenticated, async(_, { id }) => {
            try {
                const category_f = await Category.findById(id);
                if (!category_f) {
                    throw new Error('Category not found');
                } else {
                    const category = await Category.findByIdAndDelete(id);
                    return category;
                }
            } catch (error) {
                console.log(error);
                throw error;
            }
        })
    },
    Category: {
        recipes: async({ id }) => {
            try {
                const recipes = await Recipe.find({ category: id });
                return recipes;
            } catch (error) {
                console.log(error);
                throw error;
            }
        }
    }
}