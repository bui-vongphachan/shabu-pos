import { gql } from "apollo-server";

export const invoiceTypeDef = gql`
  type Invoice {
    id: String
    isPaid: Boolean
    table: Table
    customers: Int
    orders: [Order]
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
  input addInvoiceProductInput {
    id: ID,
    quantity: Int,
    size: ID,
  }
  type Mutation {
    addInvoice(
      table: ID,
      customers: Int,
      products: [addInvoiceProductInput],
    ): Invoice,
    addProductToInvoice(
      invoice_id: ID,
      products: [addInvoiceProductInput],
    ): Invoice,
  }
`;


export const gqlInvoiceFields = gql`
    {
        id
        isPaid
        table {
            id
            name
            created_date
        }
        customers
        orders {
            id
            name
            isReceived
            size {
                id {
                    id
                    name
                    price
                }
                name
                price
                created_date
            }
            quantity
            totalPrice
            ordered_date
        }
        time_spent
        total_price
        final_price
        money_received
        money_return
        printed_time
        arrived_time
        created_date

    }
    `