import { gql } from "apollo-server-express";
import { ProductModel } from "../../models";
import { server } from "../../starters/apolloServer";

describe('Get products', () => {
    it('should response products', async () => {

        await ProductModel.insertMany([
            { name: "beer", category: "alcohol" },
            { name: "liquor", category: "alcohol" },
            { name: "testo", category: "snack" }
        ])

        const result = await server.executeOperation({
            query: gql`
                query Query {
                    getProducts {
                        id
                        name
                        category
                        sizes {
                            id
                            name
                            price
                            created_date
                        }
                        created_date
                    }
                }
            `,
        })

        expect(result.errors).toBeUndefined()
        expect(result.data).not.toBeUndefined()
        expect(result.data?.getProducts).not.toBeUndefined()
        expect(result.data?.getProducts.length).toEqual(3)
    });
});