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
    ordered_date: Date
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
    increaseOrderQuantity(
      invoice_id: ID,
      order_id: ID,
      quantity: Int
    ): Invoice,
  }
`;
