import mongoose from "mongoose";
import { OrderDoc, OrderModel } from "./order.model";
import { ProductDoc } from "./product.model";

export interface InvoiceDoc extends mongoose.Document {
    id: string
    isPaid: boolean
    table: {
        id: string,
        name: string
    }
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

interface Model extends mongoose.Model<InvoiceDoc> {
    updateTotalPrice(invoice_id: string): Promise<InvoiceDoc>
    getFullDetail(invoice_id: string): Promise<InvoiceDoc>
}

const Schema = new mongoose.Schema(
    {
        table: {
            id: { type: mongoose.Schema.Types.ObjectId, ref: "tables", require: true, default: null },
            name: { type: String, default: null, require: true },
        },
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

Schema.statics.updateTotalPrice = async function (invoice_id: string) {

    const invoice = await InvoiceModel.findOne({ _id: invoice_id })
        .populate({
            path: "orders",
            populate: {
                path: "size.id"
            }
        })

    if (!invoice) throw new Error("Invoice not found")

    const total_price = invoice.orders.reduce((prev, curr) => {
        return prev + (curr.size.id.price * curr.quantity)
    }, 0)

    return await InvoiceModel.findOneAndUpdate(
        { _id: invoice_id },
        { $set: { total_price } },
        { new: true })
        .populate("orders")
}

Schema.statics.getFullDetail = async (invoice_id: string) => {
    return await InvoiceModel.findOne({ _id: invoice_id })
        .populate({ path: "table" })
        .populate({
            path: "orders",
            populate: {
                path: "size.id",
            }
        })
}

export const InvoiceModel = mongoose.model<InvoiceDoc, Model>("invoices", Schema);
