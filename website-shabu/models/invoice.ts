import { gql } from "@apollo/client";
import { OrderModel } from "./order";

export interface InvoiceModel {
    id: string
    table: {
        id: string,
        name: string
    }
    customers: number
    arrived_time: string
    orders: OrderModel[]
    time_spent: number
    total_price: number
    final_price: number
    payment_method: string
    money_received: number
    change: number
    isPaid: boolean
    payer_name: string
    payer_contact: string
    isLeft: boolean
    created_date: string
    schema_version: number
}


export const gqlInvoiceFields = gql`
    {
        id
        table {
            id
            name
            created_date
        }
        customers
        arrived_time
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
            isDeleted
            ordered_date
        }
        time_spent
        total_price
        final_price
        payment_method
        money_received
        change
        isPaid
        payer_name
        payer_contact
        isLeft
        created_date
        schema_version
    }
    `

export const addInvoiceToTableQueryString = gql`
    mutation AddInvoiceMutation(
        $addInvoiceTable: ID,
        $addInvoiceCustomers: Int, 
        $addInvoiceProducts: [addInvoiceProductInput]
    ) {
        addInvoice(
            table: $addInvoiceTable, 
            customers: $addInvoiceCustomers, 
            products: $addInvoiceProducts
        )
        ${gqlInvoiceFields}
    }
    `

export const getInvoiceQueryString = gql`
    query Query(
        $getInvoiceTableId: String, 
        $getInvoiceIsPaid: Boolean
    ) {
        getInvoice(
            table_id: $getInvoiceTableId, 
            isPaid: $getInvoiceIsPaid
        ) 
        ${gqlInvoiceFields}
    }
`

