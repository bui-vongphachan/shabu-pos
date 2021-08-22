import { ProductModel } from "../../models/product.model";

export const getProductCategories = async () => {
    const items = await ProductModel.aggregate([
        {
            $group: {
                _id: "$category",
                count: { $sum: 1 }
            }
        }
    ])
    return items
}