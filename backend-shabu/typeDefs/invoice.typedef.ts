import { gql } from "apollo-server";

export const invoiceTypeDef = gql`
  type Invoice {
    id: String
    table: Table
    customers: Int
    customer_name: String
    arrived_time: Date
    orders: [Order]
    time_spent: Int
    total_price: Float
    final_price: Float
    payment_method: String
    money_received: Float
    change: Float
    isPaid: Boolean
    payer_name: String
    payer_contact: String
    isLeft: Boolean
    created_date: Date
    schema_version: Int
  }
  type Query {
    getInvoices: [Invoice]
  }
  input addInvoiceProductInput {
    id: ID
    quantity: Int
    size: ID
  }
  input NewInvoiceProductInput {
    product_id: ID
    size_id: ID
    quantity: Int
  }
  type Mutation {
    addInvoice(
      table: ID
      customers: Int
      products: [addInvoiceProductInput]
    ): Invoice
    addProductToInvoice(
      invoice_id: ID
      products: [addInvoiceProductInput]
    ): Invoice
    completeInvoice(
      invoice_id: ID
      payment_method: String
      money_received: Float
      payer_name: String
      payer_contact: String
      isLeft: Boolean
    ): Invoice
    newInvoice(customer_name: String, foods: [NewInvoiceProductInput]): Boolean
  }
`;
