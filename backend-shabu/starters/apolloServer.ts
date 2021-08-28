import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServer, gql } from "apollo-server-express";
import { GraphQLFormattedError } from "graphql";
import { invoiceResolver, orderResolver, productResolver, productSizeResolver, tableResolver } from "../resolvers";
import { invoiceTypeDef, orderTypeDef, productSizeTypeDef, productTypeDef, tableTypeDef } from "../typeDefs";

const schema = makeExecutableSchema({
    typeDefs: [
        gql` scalar Date `,
        tableTypeDef,
        productTypeDef,
        productSizeTypeDef,
        invoiceTypeDef,
        orderTypeDef
    ],
    resolvers: [
        tableResolver,
        productResolver,
        productSizeResolver,
        invoiceResolver,
        orderResolver
    ]
});

const server = new ApolloServer({
    schema, formatError: (err): GraphQLFormattedError => {
        // console.trace(err)

        
        if (err?.extensions?.code === "GRAPHQL_VALIDATION_FAILED") {
            err.message = "Invalid inputs"
        }

        /* if (err.extensions?.exception.name === "MongoError") {
            if (err.extensions?.exception.code === 11000) {
                err.message = "Duplicate data"
            }
        } */


        return err
        
    },
});

export { server, schema }
