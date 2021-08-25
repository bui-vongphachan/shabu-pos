import mongoose from "mongoose"
import { ProductDoc } from "./product.model";
import { SizeDoc } from "./productSize.model";

export interface OrderDoc extends mongoose.Document {
    id: string
    product: ProductDoc
    name: string
    isReceived: boolean
    size: {
        id: SizeDoc,
        name: string,
        price: number
    }
    quantity: number
    totalPrice: number
    isDeleted: boolean
    ordered_date: string
    schema_version: number
}

const Schema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "products", default: null, require: true },
    name: { type: String, default: null, require: true },
    isReceived: { type: Boolean, default: false, require: true },
    size: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "product_sizes", default: null, require: true },
        name: { type: String, default: null, require: true },
        price: { type: Number, default: 0, require: true },
    },
    quantity: { type: Number, default: 0, require: true },
    totalPrice: { type: Number, default: 0, require: true },
    isDeleted: { type: Boolean, default: false, require: true },
    ordered_date: { type: Date, default: Date.now },
    schema_version: { type: Number, default: 2 },
})

export const OrderModel = mongoose.model<OrderDoc>("orders", Schema);