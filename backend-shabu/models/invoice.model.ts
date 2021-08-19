import mongoose from "mongoose";

interface Doc extends mongoose.Document {
    id: String
    isPaid: Boolean
    table: String
    customers: Number
    products: String[]
    time_spent: Number
    total_price: Number
    final_price: Number
    money_received: Number
    money_return: Number
    printed_time: String
    arrived_time: String
    created_date: String
}

const Schema = new mongoose.Schema(
    {
        table: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "table",
            require: true,
            default: null
        },
        isPaid: { type: Boolean, default: false, require: true },
        customers: { type: Number, default: 0, require: true },
        orders: [{
            product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
            isReceived: { type: Boolean, default: false, require: true },
            quantity: { type: Number, require: true },
            size: { type: String, default: null, require: true },
            price: { type: Number, require: true },
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
