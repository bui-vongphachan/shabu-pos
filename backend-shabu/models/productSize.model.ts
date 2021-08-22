import mongoose from "mongoose";
 
export interface SizeDoc extends mongoose.Document {
    id: string
    name: string,
    price: number
}

const Schema = new mongoose.Schema({
    name: { type: String, default: null, require: true, },
    price: { type: Number, default: 0, require: true },
    created_date: { type: Date, default: Date.now }
}) 

export const ProductSizeModel = mongoose.model<SizeDoc>("product_sizes", Schema);
