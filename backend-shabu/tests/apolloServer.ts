import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServer } from "apollo-server-express";
import { GraphQLFormattedError } from "graphql";
import { invoiceResolver, productResolver, tableResolver } from "../resolvers";
import { commonTypeDef, invoiceTypeDef, productSizeTypeDef, productTypeDef, tableTypeDef } from "../typeDefs";

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

