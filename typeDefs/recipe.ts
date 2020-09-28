import { gql } from 'apollo-server-express';

module.exports = gql `
    extend type Query{
        recipes(cursor: String, limit: Int): RecipeFeed!
        recipe(id: ID!): Recipe
    }

    type RecipeFeed{
        recipeFeed: [Recipe!]
        pageInfo: PageInfo!
    }

    type PageInfo{
        nextPageCursor: String 
        hasNextPage: Boolean
    }

    extend type Mutation{
        createRecipe(input: createRecipeInput!): Recipe
        updateRecipe(id: ID!, input: updateRecipeInput!): Recipe
        deleteRecipe(id: ID!): Recipe
    }    

    input createRecipeInput{
        name: String!
        description: String!
        ingredients: String!
        category: String!
    }


    input updateRecipeInput{
        name: String
        description: String
        ingredients: String
    }

    type Recipe{
        id: ID!
        name: String!
        description: String!
        ingredients: String!
        category: Category!
        user: User!
    }
`;