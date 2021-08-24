import { gql } from "apollo-server-express";
import { InvoiceDoc, InvoiceModel, ProductModel, ProductSizeModel, TableModel } from "../../models";
import { gqlInvoiceFields } from "../../typeDefs";
import { server } from "../apolloServer";

describe('update order quantity', () => {
    it('should update quantity', async () => {
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
                    ) 
                    ${gqlInvoiceFields}
                    
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

        const updateOrderQuantityResult = await server.executeOperation({
            query: gql`
                mutation UpdateOrderQuantityMutation(
                    $updateOrderQuantityInvoiceId: ID
                    $updateOrderQuantityOrderId: ID
                    $updateOrderQuantityQuantity: Int
                ) {
                    updateOrderQuantity(
                        invoice_id: $updateOrderQuantityInvoiceId
                        order_id: $updateOrderQuantityOrderId
                        quantity: $updateOrderQuantityQuantity
                    )
                    ${gqlInvoiceFields}
                }
                `,
            variables: {
                updateOrderQuantityInvoiceId: newInvoice.id,
                updateOrderQuantityOrderId: newInvoice.orders[0].id,
                updateOrderQuantityQuantity: 8
            }
        })

        const updatedInvoice: InvoiceDoc = updateOrderQuantityResult.data!.updateOrderQuantity
        const totalQuantity = updatedInvoice.orders.reduce((prev, curr) => (prev + curr.quantity), 0)

        expect(totalQuantity).toEqual(9)
        expect(updatedInvoice.total_price).toEqual(newProductSize.price * totalQuantity)

    })
})