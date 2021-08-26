import { addSizeMutation } from "../../resolvers/productSize/addSize.mutation";
import { server } from "../../starters/apolloServer";

describe('Add product size', () => {
    it('should save new product size', async () => {
        const result = await server.executeOperation({
            query: addSizeMutation,
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