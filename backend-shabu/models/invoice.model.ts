import mongoose from "mongoose";
import { ProductDoc } from "./product.model";

interface InvoiceOrderDoc extends ProductDoc {
    product_id: string
    isReceived: boolean
    size: {
        id: string,
        name: string,
        price: number
    }
    quantity: number
    totalPrice: number
    ordered_date: string
}
interface Doc extends mongoose.Document {
    id: string
    isPaid: boolean
    table: string
    customers: number
    orders: InvoiceOrderDoc[]
    time_spent: number
    total_price: number
    final_price: number
    money_received: number
    money_return: number
    printed_time: string
    arrived_time: string
    created_date: string
}

const Schema = new mongoose.Schema(
    {
        table: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "tables",
            require: true,
            default: null
        },
        isPaid: { type: Boolean, default: false, require: true },
        customers: { type: Number, default: 0, require: true },
        orders: [{
            product_id: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
            name: { type: String, default: null, require: true },
            isReceived: { type: Boolean, default: false, require: true },
            size: {
                id: { type: mongoose.Schema.Types.ObjectId, ref: "product_sizes" },
                name: { type: String, default: null, require: true },
                price: { type: Number, require: true },
            },
            quantity: { type: Number, require: true },
            totalPrice: { type: Number, require: true },
            ordered_date: { type: Date, default: Date.now },
        }],
        time_spent: { type: Number, default: 0, require: true },
        total_price: { type: Number, default: 0, require: true },
        final_price: { type: Number, default: 0, require: true },
        money_received: { type: Number, default: 0, require: true },
        money_return: { type: Number, default: 0, require: true },
        created_date: { type: Date, default: Date.now },
        arrived_time: { type: Date, default: Date.now },
        printed_time: { type: Date, default: null },
    }
);

export const InvoiceModel = mongoose.model<Doc>("invoices", Schema);
