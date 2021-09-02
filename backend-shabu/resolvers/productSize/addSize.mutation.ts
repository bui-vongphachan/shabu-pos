import { gql } from "apollo-server-express"
import { ProductSizeModel, ProductModel } from "../../models"

export const addSize = async (_: any, args: {
    product_id: string,
    sizes: [
        {
            name: string,
            price: number
        }
    ]
}) => {
    try {
        const sizes = (await ProductSizeModel.insertMany(args.sizes)).map((item) => item.id)

        await ProductModel.findOneAndUpdate(
            { _id: args.product_id },
            { $push: { sizes: { $each: sizes } } }
        )

        const product = await ProductModel.findOne({ _id: args.product_id }).populate("sizes")
 
        return product
    } catch (error) {
        return error
    }

}

export const addSizeMutation = gql`
    mutation AddSizeMutation($addSizeProductId: ID, $addSizeSizes: [addSizeInput]) {
        addSize(product_id: $addSizeProductId, sizes: $addSizeSizes) {
            id
            name
        }
    }
`