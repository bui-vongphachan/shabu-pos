import { gql } from "apollo-server-express"
import { InvoiceDoc, InvoiceModel, OrderDoc, OrderModel, ProductModel, ProductSizeModel, SizeDoc, TableDoc, TableModel } from "../../models"
import { server } from "../../starters/apolloServer";
import { gqlInvoiceFields } from "../../typeDefs";

describe('delete order', () => {
    const updatedInvoice = (async function (): Promise<{
        table: TableDoc,
        productSize: SizeDoc,
        orders: OrderDoc[]
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

        const deleteOrderResult = await server.executeOperation({
            query: gql`
                mutation DeleteOrderMutation(
                    $deleteOrderInvoiceId: String
                    $deleteOrderOrderId: String
                ) {
                    deleteOrder(
                        invoice_id: $deleteOrderInvoiceId
                        order_id: $deleteOrderOrderId
                    ) 
                    ${gqlInvoiceFields}
                }
                `,
            variables: {
                deleteOrderInvoiceId: invoice.id,
                deleteOrderOrderId: ordes[0].id
            }
        })

        const deletedOrder: InvoiceDoc = deleteOrderResult.data!.deleteOrder

        return {
            table: table,
            productSize: productSize,
            orders: ordes,
            invoice: deletedOrder
        }
    })()

    it('should delete order', async () => {

        const { invoice, orders } = await updatedInvoice

        invoice.orders.forEach(order => {
            if (order.id === orders[0].id) {
                expect(order.isDeleted).toBeTruthy()
            }
        })

        expect(invoice).not.toBeNull()
        expect(invoice.total_price).toEqual(1000)
    })

    it('should update invoice total price', async () => {

        const { invoice } = await updatedInvoice

        expect(invoice).not.toBeNull()
        expect(invoice.total_price).toEqual(1000)
    })

})