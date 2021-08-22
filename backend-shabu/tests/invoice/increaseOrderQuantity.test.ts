import { gql } from "apollo-server-express";
import { InvoiceModel, ProductModel, ProductSizeModel, TableModel } from "../../models";
import { server } from "../apolloServer";

describe('Add invoice', () => {
    it('should save new invoice', async () => {
        const table = await new TableModel({ name: "A201" }).save()

        const newProductSize = await new ProductSizeModel({ name: "small", price: 1000 }).save()
        const newProduct = await new ProductModel({ name: "Bacon", sizes: [newProductSize.id] }).save()

        const addInvoiceResult = await server.executeOperation({
            query: gql`
                mutation AddInvoiceMutation(
                    $addInvoiceTable: ID,
                    $addInvoiceCustomers: Int, 
                    $addInvoiceProducts: [InvoiceProductInput]
                ) {
                    addInvoice(
                        table: $addInvoiceTable, 
                        customers: $addInvoiceCustomers, 
                        products: $addInvoiceProducts
                    ) {
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
                                id
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
                }
                `,
            variables: {
                addInvoiceTable: table.id,
                addInvoiceCustomers: 4,
                addInvoiceProducts: [1, 2].map(() => {
                    return {
                        id: newProduct.id,
                        quantity: 1,
                        size: newProductSize.id
                    }
                })
            }
        })

        const newInvoice = addInvoiceResult.data!.addInvoice

        const increaseOrderQuantityResult = await server.executeOperation({
            query: gql`
                mutation increaseOrderQuantityMutation(
                    $increaseOrderQuantityMutationInvoiceId: ID,
                    $increaseOrderQuantityMutationOrderId: ID, 
                    $increaseOrderQuantityMutationQuantity: Int
                ) {
                    increaseOrderQuantity(
                        invoice_id: $increaseOrderQuantityMutationInvoiceId, 
                        order_id: $increaseOrderQuantityMutationOrderId, 
                        quantity: $increaseOrderQuantityMutationQuantity
                    ) {
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
                                id
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
                }
                `,
            variables: {
                increaseOrderQuantityMutationInvoiceId: newInvoice.id,
                increaseOrderQuantityMutationOrderId: newInvoice.orders[0].id,
                increaseOrderQuantityMutationQuantity: 1,
            }
        })

       console.log(increaseOrderQuantityResult.data)
    })
})