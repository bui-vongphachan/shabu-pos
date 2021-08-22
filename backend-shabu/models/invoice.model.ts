import mongoose from "mongoose";
import { OrderDoc } from "./order.model";
import { ProductDoc } from "./product.model";

interface Doc extends mongoose.Document {
    id: string
    isPaid: boolean
    table: string
    customers: number
    orders: OrderDoc[]
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
        table: { type: mongoose.Schema.Types.ObjectId, ref: "tables", require: true, default: null },
        isPaid: { type: Boolean, default: false, require: true },
        customers: { type: Number, default: 0, require: true },
        orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "orders", require: true }],
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
