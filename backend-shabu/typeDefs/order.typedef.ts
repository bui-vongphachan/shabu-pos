import { gql } from "apollo-server";

export const orderTypeDef = gql`
  type OrderProductSize {
    id: ProductSize,
    name: String,
    price: Float,
    created_date: Date
  },
  type Order {
    id: ID,
    product: Product,
    name: String
    isReceived: Boolean,
    size: OrderProductSize,
    quantity: Int,
    totalPrice: Float,
    ordered_date: Date,
    schema_version: Int
  },
  input addOrderToInvoiceInput {
    id: ID,
    quantity: Int,
    size: ID,
  },
  type Mutation {
    addOrderToInvoice(
      invoice_id: ID,
      products: [addOrderToInvoiceInput],
    ): Invoice,
    updateOrderQuantity(
      invoice_id: ID,
      order_id: ID,
      quantity: Int
    ): Invoice,
    changeOrderSize(
      invoice_id: String
      order_id: String
      size_id: String
    ): Invoice
  }
`;
