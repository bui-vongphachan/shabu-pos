import { gql } from "apollo-server-express";
import { server } from "../apolloServer";

describe('Add product size', () => {
    it('should save new product size', async () => {
        const result = await server.executeOperation({
            query: gql`
                mutation AddSizeMutation($addSizeProductId: ID, $addSizeSizes: [addSizeInput]) {
                    addSize(product_id: $addSizeProductId, sizes: $addSizeSizes) {
                        id
                        name
                    }
                }
            `,
            variables: {
                "addSizeProductId": null,
                "addSizeSizes": [
                    {
                        name: "small",
                        price: 30000
                    },
                    {
                        name: "medium",
                        price: 75000
                    },
                    {
                        name: "large",
                        price: 100000
                    }
                ]
            }
        })


        const response = result.data?.addSize

        expect(result.errors).toBeUndefined()
        expect(result.data).not.toBeUndefined()
        expect(response).not.toBeUndefined()
    });
});