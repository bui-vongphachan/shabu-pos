import gql from "graphql-tag";

export const MAIN_QUERY = gql`
  query Query($getInvoiceTableId: String, $getInvoiceIsPaid: Boolean) {
    getProducts {
      id
      name
      sizes {
        id
        name
        price
      }
    }
    getInvoice(table_id: $getInvoiceTableId, isPaid: $getInvoiceIsPaid) {
      id
      table {
        name
      }
      customers
      arrived_time
      orders {
        id
        name
        quantity
        totalPrice
        size {
          name
          price
        }
      }
      time_spent
      total_price
    }
  }
`;
