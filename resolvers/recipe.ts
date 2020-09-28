const { UserInputError } = require('apollo-server-express');
const { combineResolvers } = require('graphql-resolvers');
//const uuid = require('uuid');
import mongoose = require('mongoose');

const { isAuthenticated, isRecipeOwner } = require('./middleware');
const Recipe = require('../database/models/recipe');
const recipe = require('../typeDefs/recipe');
const Category = require('../database/models/category');
const User = require('../database/models/user');
const { stringToBase64, base64ToString } = require('../helper');



module.exports = {
    Query: {
        recipes: combineResolvers(isAuthenticated, async(_, { cursor, limit = 10 }, { loggedInUserId }) => {
            try {
                const query = { user: loggedInUserId };
                if (cursor) {
                    query['_id'] = {
                        '$lt': base64ToString(cursor)
                    }
                }
                let recipes = await Recipe.find(query).sort({ _id: -1 }).limit(limit + 1);
                const hasNextPage = recipes.length > limit;
                recipes = hasNextPage ? recipes.slice(0, -1) : recipes;
                return {
                    recipeFeed: recipes,
                    pageInfo: {
                        nextPageCursor: hasNextPage ? stringToBase64(recipes[recipes.length - 1].id) : null,
                        hasNextPage
                    }
                };
            } catch (error) {
                console.log(error);
                throw error;
            }
        }),
        recipe: combineResolvers(isAuthenticated, isRecipeOwner, async(_, { id }) => {
            try {
                const recipe = await Recipe.findById(id);
                return recipe;
            } catch (error) {
                console.log(error);
                throw error;
            }
        }),
    },
    Mutation: {
        createRecipe: combineResolvers(isAuthenticated, async(_, { input }, { email }) => {
            try {
                const user = await User.findOne({ email });
                const category = await Category.findOne({ name: input.category });
                if (!category) {
                    throw new Error('Category doesnt exist, please insert again');
                } else {
                    const recipe = new Recipe({...input, user: user.id, category: category.id });
                    const result = await recipe.save();
                    user.recipes.push(result.id);
                    category.recipes.push(result.id);
                    await user.save();
                    await category.save();
                    return result;
                }
            } catch (error) {
                console.log(error);
                throw error;
            }

        }),
        updateRecipe: combineResolvers(isAuthenticated, isRecipeOwner, async(_, { id, input }) => {
            try {
                const recipe = await Recipe.findByIdAndUpdate(id, {...input }, { new: true });
                return recipe;
            } catch (error) {
                console.log(error);
                throw error;
            }
        }),
        deleteRecipe: combineResolvers(isAuthenticated, isRecipeOwner, async(_, { id }, { loggedInUserId }) => {
            try {
                const recipe = await Recipe.findByIdAndDelete(id);
                await User.updateOne({ _id: loggedInUserId }, { $pull: { recipes: recipe.id } });
                return recipe;
            } catch (error) {
                console.log(error);
                throw error;
            }
        })
    },
    Recipe: {
        user: async(parent, _, ) => {
            try {
                const user = await User.findById(parent.user);
                return user;
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        category: async(parent, _, ) => {
            try {
                const category = await Category.findById(parent.category);
                return category
            } catch (error) {
                console.log(error);
                throw error;
            }
        }
    }
};