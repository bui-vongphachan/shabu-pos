import { gql } from "apollo-server";

export const orderTypeDef = gql`
  type Order {
    id: ID,
    product: Product,
    name: String
    isReceived: Boolean,
    size: ProductSize,
    quantity: Int,
    totalPrice: Float,
    ordered_date: Date
  },
  type Mutation {
    increaseOrderQuantity(
      invoice_id: ID,
      order_id: ID,
      quantity: Int
    ): Invoice,
  }
`;
