import { gql } from "apollo-server-express";
import { InvoiceDoc, OrderModel, ProductDoc, ProductModel, ProductSizeModel, SizeDoc, TableDoc, TableModel } from "../../models";
import { gqlInvoiceFields } from "../../typeDefs";
import { commerce, lorem } from "faker"
import { addInvoiceQuery } from "../../resolvers/invoice/addInvoice.mutation";
import { server } from "../../starters/apolloServer";
import { updateOrderQuantityMutation } from "../../resolvers/order/updateOrderQuantity.mutation";
import { invoiceResolver } from "../../resolvers";

describe('update order quantity', () => {

    const setupData = async (): Promise<{
        table: TableDoc,
        productSizes: SizeDoc,
        product: ProductDoc,
        invoice: InvoiceDoc,
        newQuantity: number
    }> => {
        const table = await new TableModel({ name: lorem.word() }).save()
        const productSize = await new ProductSizeModel({ name: "large", price: commerce.price() }).save()
        const product = await new ProductModel({
            name: commerce.productName(),
            category: "alcohol",
            sizes: [productSize.id]
        }).save()

        let result = await server.executeOperation({
            query: addInvoiceQuery,
            variables: {
                addInvoiceTable: table.id,
                addInvoiceCustomers: 4,
                addInvoiceProducts: [
                    {
                        id: product.id,
                        quantity: 1,
                        size: productSize.id,
                    }
                ]
            }
        })

        let invoice: InvoiceDoc = result.data?.addInvoice

        result = await server.executeOperation({
            query: updateOrderQuantityMutation,
            variables: {
                updateOrderQuantityInvoiceId: invoice.id,
                updateOrderQuantityOrderId: invoice.orders[0].id,
                updateOrderQuantityQuantity: 10
            }
        })

        invoice = result.data!.updateOrderQuantity

        return {
            table,
            product,
            productSizes: productSize,
            invoice,
            newQuantity: 10
        }
    }

    it('should update quantity', async () => {
        const { newQuantity, invoice } = await setupData()

        const order = await OrderModel.findOne({ _id: invoice.orders[0].id })

        expect(order?.quantity).toEqual(newQuantity)
    })

    it('should recalculate totalPrice', async () => {
        const { invoice } = await setupData()

        const orders = await OrderModel.find({
            _id: { $in: invoice.orders.map(order => order.id) }
        })

        const totalPrice = orders.reduce((sum, order) => {
            return sum + (order.quantity * order.size.price)
        }, 0)

        expect(invoice.total_price).toEqual(totalPrice)
    });
})