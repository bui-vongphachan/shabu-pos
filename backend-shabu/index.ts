import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import express from "express"
import { ApolloServer } from "apollo-server-express";
import { commonTypeDef, invoiceTypeDef, productSizeTypeDef, productTypeDef, tableTypeDef } from './typeDefs';
import { invoiceResolver, productResolver, tableResolver } from './resolvers';
import { connectToMongoDB } from './starters/mongo';

(async function () {
    const app = express();

    const httpServer = createServer(app);

    const schema = makeExecutableSchema({
        typeDefs: [
            commonTypeDef,
            tableTypeDef,
            productTypeDef,
            productSizeTypeDef,
            invoiceTypeDef
        ],
        resolvers: [
            tableResolver,
            productResolver,
            invoiceResolver
        ]
    });

    const server = new ApolloServer({ schema, });
    await server.start();
    server.applyMiddleware({ app });

    SubscriptionServer.create(
        { schema, execute, subscribe },
        { server: httpServer, path: server.graphqlPath }
    );

    const PORT = 4000;
    httpServer.listen(PORT, async () => {
        console.log(`Server is now running on http://localhost:${PORT}/graphql`)
        await connectToMongoDB()
    }
    );
})();


