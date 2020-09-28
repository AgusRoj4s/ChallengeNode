const express = require("express");
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');
const dotEnv = require('dotenv');

const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');

const { connection } = require('./database/util');
const { verify } = require("jsonwebtoken");
const { verifyUser } = require('./helper/context');

const Dataloader = require('dataloader');
const loaders = require('./loaders');


dotEnv.config();


const app = express();
connection(); //database connection
app.use(cors());
app.use(express.json());


const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: async({ req }) => {
        await verifyUser(req)
        return {
            email: req.email,
            loggedInUserId: req.loggedInUserId,
        }
    }
});

apolloServer.applyMiddleware({ app, path: '/graphql' });

const PORT = process.env.PORT || 3005;

app.use('/', (req, res, next) => {
    res.send({ message: 'Hello' });
})

app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`);
    console.log(`Graphql Endpoint: ${ApolloServer.graphqlPath}`);

})