import { gql } from "@apollo/client";
import { OrderModel } from "./order";

export interface InvoiceModel {
  id: string;
  table: {
    id: string;
    name: string;
  };
  customers: number;
  customer_name: string;
  arrived_time: string;
  orders: OrderModel[];
  time_spent: number;
  total_price: number;
  final_price: number;
  payment_method: string;
  money_received: number;
  change: number;
  isPaid: boolean;
  payer_name: string;
  payer_contact: string;
  isLeft: boolean;
  created_date: string;
  schema_version: number;
}
