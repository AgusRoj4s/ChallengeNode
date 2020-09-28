import { gql } from 'apollo-server-express';

module.exports = gql `
    extend type Query{
        categories(skip: Int, limit: Int): [Category!]
        category(id: ID!): Category
        categoryName(input: nameCategoryInput!): Category
    }

    input nameCategoryInput{
        name: String!
    }

    extend type Mutation{
        createCategory(input: createCategoryInput!): Category
        updateCategory(id: ID!, input: updateCategoryInput!): Category
        deleteCategory(id: ID!): Category
    }

    input createCategoryInput{
        name: String!
    }

    input updateCategoryInput{
        name: String!
    }

    type Category{
        id: ID!
        name: String!
        recipes: [Recipe]
        user: User!
    } 
    
`;