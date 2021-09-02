import { ProductModel } from "../../models/product.model";

export const getProducts = async () => {
    const items = await ProductModel.find().populate("sizes").sort({ created_date: -1 })
    return items;
}