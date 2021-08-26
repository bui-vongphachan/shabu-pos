import { gql } from "apollo-server-express";
import { isValidObjectId } from "mongoose";
import { InvoiceDoc, InvoiceModel, OrderModel, ProductDoc, ProductModel, ProductSizeModel, SizeDoc, TableDoc, TableModel } from "../../models";
import { server } from "../../starters/apolloServer";
import { commerce, lorem } from "faker"
import { addInvoiceQuery } from "../../resolvers/invoice/addInvoice.mutation";
import { addOrderToInvoiceMutation } from "../../resolvers/order/addOrderToInvoice.mutation";

describe('Add new order to invoice', () => {

    const setupData = async (): Promise<{
        table: TableDoc,
        productSizes: SizeDoc[],
        product: ProductDoc,
        invoice: InvoiceDoc
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

        const newProductSize = await new ProductSizeModel({ name: "small", price: 1000 }).save()
        const newProduct = await new ProductModel({ name: "Bacon", sizes: [newProductSize.id] }).save()

        result = await server.executeOperation({
            query: addOrderToInvoiceMutation,
            variables: {
                addOrderToInvoiceInvoiceId: invoice.id,
                addOrderToInvoiceProducts: [
                    {
                        id: newProduct.id,
                        quantity: 1,
                        size: newProductSize.id
                    }
                ]
            }
        })

        invoice = result.data?.addOrderToInvoice

        return {
            table,
            product,
            productSizes: [productSize, newProductSize],
            invoice
        }
    }

    it('should save new order to invoice', async () => {
        let { invoice } = await setupData()

        expect(invoice.orders.length).toEqual(2)
    });

    it("should recalculate totalPrice", async () => {
        const { invoice } = await setupData()

        const orders = await OrderModel.find({
            _id: { $in: invoice.orders.map(order => order.id) }
        })

        const totalPrice = orders.reduce((sum, order) => {
            return sum + (order.quantity * order.size.price)
        }, 0)

        expect(invoice.total_price).toEqual(totalPrice)
    })
})
