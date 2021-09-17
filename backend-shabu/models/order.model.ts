import mongoose from "mongoose";
import { ProductDoc } from "./product.model";
import { SizeDoc } from "./productSize.model";

export interface OrderDoc extends mongoose.Document {
  id: string;
  product: ProductDoc;
  name: string;
  isReceived: boolean;
  options: [
    {
      name: string;
      price: number;
      quantity: number;
    }
  ];
  size: {
    id: SizeDoc;
    name: string;
    price: number;
  };
  size_id: string;
  quantity: number;
  totalFoodPrice: number;
  totalPrice: number;
  description: string;
  isPaid: boolean;
  isDeleted: boolean;
  ordered_date: string;
  schema_version: number;
}
interface Model extends mongoose.Model<OrderDoc> {
  getFullDetail(params: { order_id?: string }): Promise<OrderDoc>;
}

const Schema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    default: null,
    require: true,
  },
  size_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product_sizes",
    default: null,
    require: true,
  },
  name: { type: String, default: null, require: true },
  isReceived: { type: Boolean, default: false, require: true },
  options: [
    {
      name: { type: String },
      price: { type: Number, default: 0 },
      quantity: { type: Number, default: 1 },
    },
  ],
  size: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product_sizes",
      default: null,
      require: true,
    },
    name: { type: String, default: null, require: true },
    price: { type: Number, default: 0, require: true },
  },
  quantity: { type: Number, default: 0, require: true },
  totalFoodPrice: { type: Number, default: 0, require: true },
  totalPrice: { type: Number, default: 0, require: true },
  description: { type: String, default: 0, require: true },
  isPaid: { type: Boolean, default: false, require: true },
  isDeleted: { type: Boolean, default: false, require: true },
  ordered_date: { type: Date, default: Date.now },
  schema_version: { type: Number, default: 2 },
});

Schema.statics.getFullDetail = async (params: { order_id?: string }) => {
  let condition = {};
  if (params.order_id) condition = { ...condition, _id: params.order_id };

  const order = await OrderModel.findOne(condition)
    .populate({ path: "product", populate: { path: "sizes" } })
    .populate({ path: "size.id" });

  return order;
};

export const OrderModel = mongoose.model<OrderDoc, Model>("orders", Schema);
