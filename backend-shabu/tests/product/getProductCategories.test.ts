import { gql } from "apollo-server-express";
import { ProductModel } from "../../models";
import { server } from "../apolloServer";

describe('Get product categories', () => {
    it('should response product categories', async () => {

        await ProductModel.insertMany([
            { name: "beer", category: "alcohol" },
            { name: "liquor", category: "alcohol" },
            { name: "testo", category: "snack" }
        ])

        const result = await server.executeOperation({
            query: gql`
                query Query {
                    getProductCategories {
                        _id
                        count
                    }
                }
            `,
        })

        expect(result.errors).toBeUndefined()
        expect(result.data).not.toBeUndefined()
        expect(result.data?.getProductCategories).not.toBeUndefined()
        expect(result.data?.getProductCategories.length).toEqual(2)
    });
});