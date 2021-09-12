import { gql } from "apollo-server";

export const orderTypeDef = gql`
  type OrderProductSize {
    id: ProductSize
    name: String
    price: Float
    created_date: Date
  }
  type Order {
    id: ID
    product: Product
    name: String
    isReceived: Boolean
    size_id: ID
    size: OrderProductSize
    quantity: Int
    totalPrice: Float
    isPaid: Boolean
    isDeleted: Boolean
    ordered_date: Date
    schema_version: Int
  }
  input addOrderToInvoiceInput {
    id: ID
    quantity: Int
    size: ID
  }
  type Query {
    getOrder(order_id: ID): Order
  }
  type Mutation {
    addOrderToInvoice(
      invoice_id: ID
      products: [addOrderToInvoiceInput]
    ): Invoice
    updateOrderQuantity(invoice_id: ID, order_id: ID, quantity: Int): Boolean
    changeOrderSize(invoice_id: ID, order_id: ID, size_id: ID): Boolean
    deleteOrder(invoice_id: ID, order_id: ID): Boolean
  }
`;
