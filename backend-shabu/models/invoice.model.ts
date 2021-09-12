import mongoose from "mongoose";
import { OrderDoc, OrderModel } from "./order.model";
import { ProductDoc } from "./product.model";

export enum PaymentMethods {
  CASH = "CASH",
  BCEL = "BCEL",
}
export interface InvoiceDoc extends mongoose.Document {
  id: string;
  table: {
    id: string;
    name: string;
  };
  customers: number;
  customer_name: string;
  arrived_time: string;
  orders: OrderDoc[];
  time_spent: number;
  total_price: number;
  final_price: number;
  payment_method: PaymentMethods;
  money_received: number;
  change: number;
  isPaid: boolean;
  payer_name: string;
  payer_contact: string;
  isLeft: boolean;
  created_date: string;
  schema_version: number;
}

interface Model extends mongoose.Model<InvoiceDoc> {
  updateTotalPrice(invoice_id: string): Promise<InvoiceDoc>;
  getFullDetail(params: {
    invoice_id?: string;
    isPaid?: boolean;
    table_id?: string;
  }): Promise<InvoiceDoc>;
}

const Schema = new mongoose.Schema({
  table: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tables",
      require: true,
      default: null,
    },
    name: { type: String, default: null, require: true },
  },
  customers: { type: Number, default: 0, require: true },
  customer_name: { type: String, default: null, require: true },
  arrived_time: { type: Date, default: Date.now },
  orders: [
    { type: mongoose.Schema.Types.ObjectId, ref: "orders", require: true },
  ],
  time_spent: { type: Number, default: 0, require: true },
  total_price: { type: Number, default: 0, require: true },
  final_price: { type: Number, default: 0, require: true },
  payment_method: {
    type: String,
    enum: ["CASH", "ONEPAY"],
    default: "CASH",
    require: true,
  },
  money_received: { type: Number, default: 0, require: true },
  change: { type: Number, default: 0, require: true },
  isPaid: { type: Boolean, default: false, require: true },
  payer_name: { type: String, default: null, require: true },
  payer_contact: { type: String, default: null, require: true },
  isLeft: { type: Boolean, default: false, require: true },
  created_date: { type: Date, default: Date.now },
  schema_version: { type: Number, default: 2 },
});

Schema.index({ isLeft: 1, type: 1 });

Schema.statics.updateTotalPrice = async function (invoice_id: string) {
  const invoice = await InvoiceModel.findOne({ _id: invoice_id }).populate({
    path: "orders",
    populate: {
      path: "size.id",
    },
  });

  if (!invoice) throw new Error("Invoice not found");

  const total_price = invoice.orders.reduce((prev, curr) => {
    if (curr.isDeleted) return prev + 0;
    const option = curr.options.reduce((sumOption, option) => {
      return sumOption + option.price * option.quantity;
    }, 0);
    const size = curr.size.id.price * curr.quantity;
    return prev + option + size;
  }, 0);

  await InvoiceModel.findOneAndUpdate(
    { _id: invoice_id },
    { $set: { total_price } },
    { new: true }
  );

  return InvoiceModel.getFullDetail({ invoice_id });
};

Schema.statics.getFullDetail = async (params: {
  invoice_id?: string;
  isPaid?: boolean;
  table_id?: string;
}) => {
  let condition = {};
  if (params.invoice_id) condition = { ...condition, _id: params.invoice_id };
  else if (params.isPaid) condition = { ...condition, isPaid: params.isPaid };
  else if (params.table_id)
    condition = { ...condition, "table.id": params.table_id };
  const invoice = await InvoiceModel.findOne(condition)
    .populate({
      path: "orders",
      populate: {
        path: "product",
        populate: {
          path: "sizes",
        },
      },
    })
    .populate({ path: "table.id" })
    .populate({
      path: "orders",
      populate: {
        path: "size.id",
      },
    });

  return invoice;
};

export const InvoiceModel = mongoose.model<InvoiceDoc, Model>(
  "invoices",
  Schema
);
