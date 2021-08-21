import { gql } from "apollo-server";

export const invoiceTypeDef = gql`
  type InvoiceProduct {
    id: ID,
    name: String
    isReceived: Boolean,
    size: ProductSize,
    quantity: Int,
    totalPrice: Float,
    ordered_date: Date
  }
  type Invoice {
    id: String
    isPaid: Boolean
    table: Table
    customers: Int
    products: [InvoiceProduct]
    time_spent: Int
    total_price: Float
    final_price: Float
    money_received: Float
    money_return: Float
    printed_time: Date
    arrived_time: Date
    created_date: Date
  }
  type Query {
    getInvoice(table_id: String, isPaid: Boolean): Invoice
  },
  input InvoiceProductInput {
    id: ID,
    quantity: Int,
    size: ID,
  }
  type Mutation {
    addInvoice(
      table: ID,
      customers: Int,
      products: [InvoiceProductInput],
    ): Invoice,
    addProductToInvoice(
      products: [InvoiceProductInput],
    ): Invoice
  }
`;
