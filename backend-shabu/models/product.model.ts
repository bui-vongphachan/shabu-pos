import mongoose from "mongoose";
import { ProductOptionDoc } from "./productOption.model";
import { SizeDoc } from "./productSize.model";
export interface ProductDoc extends mongoose.Document {
  id: string;
  name: string;
  category: string;
  options: ProductOptionDoc[];
  sizes: SizeDoc[];
  isDeleted: boolean;
  created_date: string;
  schema_version: number;
}

interface Model extends mongoose.Model<ProductDoc> {
  getFullDetails(): Promise<ProductDoc>;
}

const Schema = new mongoose.Schema({
  name: { type: String, default: null, require: true },
  category: { type: String, default: null, require: true },
  options: [{ type: mongoose.Schema.Types.ObjectId, ref: "product_options" }],
  sizes: [{ type: mongoose.Schema.Types.ObjectId, ref: "product_sizes" }],
  isDeleted: { type: Boolean, default: false, require: true },
  created_date: { type: Date, default: Date.now },
  schema_version: { type: Number, default: 2 },
});

Schema.statics.getFullDetails = async () => {
  const products = await ProductModel.find().populate({
    path: "sizes",
    match: { isDeleted: false },
  });

  return products;
};

export const ProductModel = mongoose.model<ProductDoc, Model>(
  "products",
  Schema
);
