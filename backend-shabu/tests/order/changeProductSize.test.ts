import { gql } from "apollo-server-express";
import { InvoiceDoc, ProductModel, ProductSizeModel, TableModel } from "../../models";
import { gqlInvoiceFields } from "../../typeDefs";
import { server } from "../apolloServer";

describe('change order size', () => {
    it('should update order size', async () => {
        const table = await new TableModel({ name: "A128" }).save()

        const newProductSize = await new ProductSizeModel({ name: "small", price: 1000 }).save()
        const newProductSizeTwo = await new ProductSizeModel({ name: "medium", price: 30000 }).save()
        const newProduct = await new ProductModel({ name: "Bacon", sizes: [newProductSize.id, newProductSizeTwo.id] }).save()

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
                addInvoiceProducts: [{
                    id: newProduct.id,
                    quantity: 1,
                    size: newProductSize.id
                }]
            }
        })

        const newInvoice: InvoiceDoc = addInvoiceResult.data!.addInvoice

        const updateOrderQuantityResult = await server.executeOperation({
            query: gql`
                mutation CompleteInvoiceMutation(
                    $changeOrderSizeInvoiceId: String
                    $changeOrderSizeOrderId: String
                    $changeOrderSizeSizeId: String
                ) {
                    changeOrderSize(
                        invoice_id: $changeOrderSizeInvoiceId
                        order_id: $changeOrderSizeOrderId
                        size_id: $changeOrderSizeSizeId
                    ) 
                    ${gqlInvoiceFields}
                }
                `,
            variables: {
                changeOrderSizeInvoiceId: newInvoice.id,
                changeOrderSizeOrderId: newInvoice.orders[0].id,
                changeOrderSizeSizeId: newProductSizeTwo.id
            }
        })

        const updatedInvoice: InvoiceDoc = updateOrderQuantityResult.data!.changeOrderSize

        expect(updatedInvoice).not.toBeNull()
        expect(updatedInvoice.orders[0].size.id.id).toEqual(newProductSizeTwo.id)
        expect(updatedInvoice.orders[0].size.id.name).toEqual(newProductSizeTwo.name)
        expect(updatedInvoice.orders[0].size.id.price).toEqual(newProductSizeTwo.price)
        expect(updatedInvoice.orders[0].totalPrice)
            .toEqual(updatedInvoice.orders[0].quantity * newProductSizeTwo.price)
    })
})