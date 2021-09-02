import mongoose from "mongoose";

export interface SizeDoc extends mongoose.Document {
    id: string
    name: string,
    price: number
    isDeleted: boolean
    schema_version: number
}

const Schema = new mongoose.Schema({
    name: { type: String, default: null, require: true, },
    price: { type: Number, default: 0, require: true },
    isDeleted: { type: Boolean, default: false, require: true },
    created_date: { type: Date, default: Date.now },
    schema_version: { type: Number, default: 2 },
})

export const ProductSizeModel = mongoose.model<SizeDoc>("product_sizes", Schema);
