
import { InvoiceDoc, OrderModel, ProductDoc, ProductModel, ProductSizeModel, SizeDoc, TableDoc, TableModel } from "../../models";
import { commerce, lorem } from "faker"
import { addInvoiceQuery } from "../../resolvers/invoice/addInvoice.mutation";
import { server } from "../../starters/apolloServer";
import { changeOrderSizeMutation } from "../../resolvers/order/changeProductSize.mutation";

describe('change order size', () => {

    const setupData = async (): Promise<{
        table: TableDoc,
        productSizes: SizeDoc[],
        product: ProductDoc,
        invoice: InvoiceDoc
    }> => {
        const table = await new TableModel({ name: lorem.word() }).save()
        const productSize = await new ProductSizeModel({ name: "large", price: commerce.price() }).save()
        const productSizeTwo = await new ProductSizeModel({ name: "large", price: commerce.price() }).save()
        const product = await new ProductModel({
            name: commerce.productName(),
            category: "alcohol",
            sizes: [productSize.id, productSizeTwo.id]
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
            query: changeOrderSizeMutation,
            variables: {
                changeOrderSizeInvoiceId: invoice.id,
                changeOrderSizeOrderId: invoice.orders[0].id,
                changeOrderSizeSizeId: productSizeTwo.id
            }
        })

        invoice = result.data!.changeOrderSize

        return {
            table,
            product,
            productSizes: [productSize, productSizeTwo],
            invoice
        }
    }

    it('should update order size', async () => {
        const { invoice, productSizes } = await setupData()
        expect(invoice).not.toBeNull()
        expect(invoice.orders[0].size.id.id).toEqual(productSizes[1].id)
        expect(invoice.orders[0].size.id.name).toEqual(productSizes[1].name)
        expect(invoice.orders[0].size.id.price).toEqual(productSizes[1].price)
        expect(invoice.orders[0].totalPrice)
            .toEqual(invoice.orders[0].quantity * productSizes[1].price)
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