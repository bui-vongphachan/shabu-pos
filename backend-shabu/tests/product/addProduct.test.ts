import { gql } from "apollo-server-express";
import { server } from "../../starters/apolloServer";

describe('Add product', () => {
    it('should save new product', async () => {
        const result = await server.executeOperation({
            query: gql`
                mutation AddProductMutation(
                    $addProductName: String
                    $addProductCategory: String
                    $addProductSizes: [ProductSizeInput]
                ) {
                addProduct(
                    name: $addProductName
                    category: $addProductCategory
                    sizes: $addProductSizes
                    ) {
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
            variables: {
                addProductSizes: [
                    {
                        name: "small",
                        price: 30000
                    },
                    {
                        name: "medium",
                        price: 75000
                    }
                ],
                addProductName: "Fish",
                addProductCategory: "fish"
            }
        })

        expect(result.errors).toBeUndefined()
        expect(result.data).not.toBeUndefined()
        expect(result.data?.addProduct).not.toBeUndefined()
        expect(result.data?.addProduct.length).toBeGreaterThanOrEqual(1)
        expect(result.data?.addProduct[0].name).toEqual("Fish")
        expect(result.data?.addProduct[0].category).toEqual("fish")
        expect(result.data?.addProduct[0].sizes.length).toBeGreaterThanOrEqual(1)
        expect(result.data?.addProduct[0].sizes[0].name).toEqual("small")
        expect(result.data?.addProduct[0].sizes[0].price).toEqual(30000)
        expect(result.data?.addProduct[0].sizes[1].name).toEqual("medium")
        expect(result.data?.addProduct[0].sizes[1].price).toEqual(75000)
    });
});