import { InvoiceDoc, InvoiceModel, OrderDoc, OrderModel, ProductDoc, ProductModel, ProductSizeModel, SizeDoc, TableDoc, TableModel } from "../../models"
import { completeInvoiceQuery } from "../../resolvers/invoice/completeInvoice.mutation"
import { deleteSizeQuery } from "../../resolvers/productSize/deleteSize.mutation"
import { server } from "../../starters/apolloServer"

describe('Delete product size', () => {

    const setupData = (async function (): Promise<{
        table: TableDoc,
        productSize: SizeDoc,
        orders: OrderDoc[],
        invoice: InvoiceDoc
    }> {
        const table = await new TableModel({ name: "CB20" }).save()
        const productSize = await new ProductSizeModel({ name: "small", price: 1000 }).save()
        const product = await new ProductModel({ name: "Bacon", sizes: [productSize.id] }).save()
        const ordes = await OrderModel.insertMany([1, 2].map(() => {
            return {
                product: product.id,
                name: product.name,
                size: {
                    id: productSize.id,
                    name: productSize.name,
                    price: productSize.price
                },
                quantity: 1,
                totalPrice: 1 * productSize.price,
            }
        }))
        const invoice = await new InvoiceModel({
            table: {
                id: table.id,
                name: table.name
            },
            customers: 1,
            orders: ordes.map(order => order.id),
            total_price: 2000,
        }).save()

        return {
            table: table,
            productSize: productSize,
            orders: ordes,
            invoice: invoice
        }
    })()

    it("should prevent deleting if orders having that size hasn`t been paid yet ", async () => {
        const { productSize } = await setupData
        const deleteOrderResult = await server.executeOperation({
            query: deleteSizeQuery,
            variables: { deleteSizeSizeId: productSize.id }
        })

        expect(deleteOrderResult.errors?.length).toEqual(1)
    })

    it('should delete product size', async () => {
        const { productSize, invoice } = await setupData
        await server.executeOperation({
            query: completeInvoiceQuery,
            variables: {
                completeInvoiceInvoiceId: invoice.id,
                completeInvoicePaymentMethod: "CASH",
                completeInvoiceMoneyReceived: 120000,
                completeInvoicePayerName: "John",
                completeInvoicePayerContact: "3999399",
                completeInvoiceIsLeft: false
            }
        })

        const deleteOrderResult = await server.executeOperation({
            query: deleteSizeQuery,
            variables: { deleteSizeSizeId: productSize.id }
        })

        expect(deleteOrderResult.errors).toBeUndefined()

        const products: ProductDoc[] = deleteOrderResult.data?.deleteSize

        products.forEach(product => {
            product.sizes.forEach(size => {
                expect(size.isDeleted).toEqual(false)
            })
        })

    })
})