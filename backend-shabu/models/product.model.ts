import mongoose from "mongoose";
import { SizeDoc } from "./productSize.model";
export interface ProductDoc extends mongoose.Document {
    id: string
    name: string
    category: string
    sizes: SizeDoc[]
    created_date: string,
    schema_version: number
}

interface Model extends mongoose.Model<ProductDoc> {
    getFullDetails(): Promise<ProductDoc>
}

const Schema = new mongoose.Schema(
    {
        name: { type: String, default: null, require: true },
        category: { type: String, default: null, require: true },
        sizes: [{ type: mongoose.Schema.Types.ObjectId, ref: "product_sizes" }],
        created_date: { type: Date, default: Date.now },
        schema_version: { type: Number, default: 2 },
    }
);

Schema.statics.getFullDetails = async () => {
    const products = await ProductModel.find()
        .populate({ path: "sizes" })

    return products
}

export const ProductModel = mongoose.model<ProductDoc, Model>("products", Schema);
