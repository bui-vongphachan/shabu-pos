import { ProductModel } from "../models/product.model";

export const productResolver = {
    Query: {
        products: async () => {
            const items = await ProductModel.find();
            return items;
        },
        productCategories: async () => {
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
    },
    Mutation: {
        addProduct: async (_: any, args: {
            name: string,
            category: string,
            sizes: [{ name: string, price: number }]
        }) => {
            await new ProductModel(args).save()
            const items = await ProductModel.find()
            return items
        }
    }
};
