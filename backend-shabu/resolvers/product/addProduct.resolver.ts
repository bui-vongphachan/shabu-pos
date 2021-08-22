import { ProductModel } from "../../models/product.model";
import { ProductSizeModel } from "../../models/productSize.model";

export const addProduct = async (_: any, args: {
    name: string,
    category: string,
    sizes: [{ name: string, price: number }]
}) => {

    const { name, category, sizes } = args

    const productSizes = (await ProductSizeModel.insertMany(sizes)).map((item) => item.id)

    await new ProductModel({ name, category, sizes: productSizes }).save()

    const items = await ProductModel.find().populate("sizes")

    return items
}