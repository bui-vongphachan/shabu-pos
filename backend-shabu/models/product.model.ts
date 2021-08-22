import mongoose from "mongoose";
import { SizeDoc } from "./productSize.model";
export interface ProductDoc extends mongoose.Document {
    id: string
    name: string
    category: string
    sizes: SizeDoc[]
    created_date: string
}

const Schema = new mongoose.Schema(
    {
        name: { type: String, default: null, require: true },
        category: { type: String, default: null, require: true },
        sizes: [{ type: mongoose.Schema.Types.ObjectId, ref: "product_sizes" }],
        created_date: { type: Date, default: Date.now }
    }
);

export const ProductModel = mongoose.model<ProductDoc>("products", Schema);
