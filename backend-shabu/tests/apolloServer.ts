import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServer, gql } from "apollo-server-express";
import { GraphQLFormattedError } from "graphql";
import { invoiceResolver, productResolver, tableResolver, productSizeResolver, orderResolver } from "../resolvers";
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
        if (err?.extensions?.code === "GRAPHQL_VALIDATION_FAILED") {
            err.message = "Invalid inputs"
        }

        if (err?.extensions?.exception.name === "MongoError") {
            if (err.extensions?.exception.code === 11000) {
                err.message = "Duplicate data"
            }
        }

        return { message: err.message }
    },
});

export { server }

