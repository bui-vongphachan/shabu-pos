import { gql } from "apollo-server-express";
import { InvoiceDoc, InvoiceModel, ProductModel, ProductSizeModel, TableModel } from "../../models";
import { gqlInvoiceFields } from "../../typeDefs";
import { server } from "../apolloServer";

describe('Increase order quantity', () => {
    it('should increase quantity', async () => {
        const table = await new TableModel({ name: "A208" }).save()

        const newProductSize = await new ProductSizeModel({ name: "small", price: 1000 }).save()
        const newProduct = await new ProductModel({ name: "Bacon", sizes: [newProductSize.id] }).save()

        const addInvoiceResult = await server.executeOperation({
            query: gql`
                mutation AddInvoiceMutation(
                    $addInvoiceTable: ID,
                    $addInvoiceCustomers: Int, 
                    $addInvoiceProducts: [addInvoiceProductInput]
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
                                name
                                price
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

        const newInvoice: InvoiceDoc = addInvoiceResult.data!.addInvoice

        expect(newInvoice.total_price).toEqual(newProductSize.price * 2)

        const increaseOrderQuantityResult = await server.executeOperation({
            query: gql`
                mutation IncreaseOrderQuantityMutation(
                    $increaseOrderQuantityInvoiceId: ID
                    $increaseOrderQuantityOrderId: ID
                    $increaseOrderQuantityQuantity: Int
                ) {
                    increaseOrderQuantity(
                        invoice_id: $increaseOrderQuantityInvoiceId
                        order_id: $increaseOrderQuantityOrderId
                        quantity: $increaseOrderQuantityQuantity
                    )
                    ${gqlInvoiceFields}
                }
                `,
            variables: {
                increaseOrderQuantityInvoiceId: newInvoice.id,
                increaseOrderQuantityOrderId: newInvoice.orders[0].id,
                increaseOrderQuantityQuantity: 8
            }
        })

        const updatedInvoice: InvoiceDoc = increaseOrderQuantityResult.data!.increaseOrderQuantity
        const totalQuantity = updatedInvoice.orders.reduce((prev, curr) => (prev + curr.quantity), 0)
        
        expect(totalQuantity).toEqual(9)
        expect(updatedInvoice.total_price).toEqual(newProductSize.price * totalQuantity)

    })
})