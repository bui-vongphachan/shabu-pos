import { ProductModel } from "./product";
import { ProductSizeModel } from "./productSize";

export interface OrderModel {
  id: string;
  product: ProductModel;
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
    id: ProductSizeModel;
    name: string;
    price: number;
  };
  quantity: number;
  totalPrice: number;
  description: string;
  isPaid: boolean;
  isDeleted: boolean;
  ordered_date: string;
  schema_version: number;
}
