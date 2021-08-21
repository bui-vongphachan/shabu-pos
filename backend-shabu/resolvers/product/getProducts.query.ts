import { ProductModel } from "../../models/product.model";

export const getProducts = async () => {
    const items = await ProductModel.find().populate("sizes")
    return items;
}