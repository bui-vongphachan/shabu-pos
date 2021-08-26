import { isValidObjectId, Types } from "mongoose";
import { InvoiceDoc, InvoiceModel, OrderDoc, OrderModel, ProductDoc, ProductModel, ProductSizeModel, SizeDoc, TableDoc, TableModel } from "../../models";
import { addInvoiceQuery } from "../../resolvers/invoice/addInvoice.mutation";
import { server } from "../../starters/apolloServer";
import { ObjectId } from "mongoose"
import { commerce, lorem, name } from "faker"

describe('Add invoice', () => {

    const setupData = async (): Promise<{
        table: TableDoc,
        productSizes: SizeDoc[],
        products: ProductDoc[],
    }> => {
        const table = await new TableModel({ name: `${name.firstName()} ${lorem.word()}` }).save()
        const productSizes: SizeDoc[] = await ProductSizeModel.insertMany([
            { name: "small", price: commerce.price() },
            { name: "large", price: commerce.price() },
        ])
        const products = await ProductModel.insertMany([
            { name: commerce.productName(), category: "alcohol", sizes: [productSizes[0].id] },
            { name: commerce.productName(), category: "alcohol", sizes: [productSizes[0].id] },
            { name: commerce.productName(), category: "snack", sizes: [productSizes[1].id] }
        ])

        return { table, productSizes, products }
    }

    it('should reject if table does not exist', async () => {
        const result = await server.executeOperation({
            query: addInvoiceQuery,
            variables: {
                addInvoiceTable: Types.ObjectId().toString(),
                addInvoiceCustomers: 4,
                addInvoiceProducts: [
                    {
                        id: Types.ObjectId().toString(),
                        quantity: 1,
                        size: Types.ObjectId().toString(),
                    }
                ]
            }
        })

        expect(result.errors).not.toBeUndefined()
        result.errors?.forEach(error => {
            expect(error.message).toEqual("Table not found")
        })
    });

    it('should reject if product does not exist', async () => {
        const { table, productSizes } = await setupData()

        const result = await server.executeOperation({
            query: addInvoiceQuery,
            variables: {
                addInvoiceTable: table.id,
                addInvoiceCustomers: 4,
                addInvoiceProducts: [
                    {
                        id: Types.ObjectId().toString(),
                        quantity: 1,
                        size: productSizes[0].id,
                    }
                ]
            }
        })

        expect(result.errors).not.toBeUndefined()
        result.errors?.forEach(error => {
            expect(error.message).toEqual("Product not found")
        })
    });

    it('should reject if product size does not exist', async () => {

        const { table, products, } = await setupData()

        const result = await server.executeOperation({
            query: addInvoiceQuery,
            variables: {
                addInvoiceTable: table.id,
                addInvoiceCustomers: 4,
                addInvoiceProducts: [
                    {
                        id: products[0].id,
                        quantity: 1,
                        size: Types.ObjectId().toString(),
                    }
                ]
            }
        })

        expect(result.errors).not.toBeUndefined()
        result.errors?.forEach(error => {
            expect(error.message).toEqual("Size not found")
        })
    });

    it('should save orders', async () => {
        const { table, products, productSizes } = await setupData()

        const result = await server.executeOperation({
            query: addInvoiceQuery,
            variables: {
                addInvoiceTable: table.id,
                addInvoiceCustomers: 4,
                addInvoiceProducts: [
                    {
                        id: products[0].id,
                        quantity: 1,
                        size: productSizes[0].id,
                    }
                ]
            }
        })

        const invoice: InvoiceDoc = result.data?.addInvoice

        const savedInvoice = await InvoiceModel.findOne({ _id: invoice.id })

        expect(savedInvoice).not.toBeUndefined()

        savedInvoice?.orders.forEach(async order => {
            const savedOrder = await OrderModel.findOne({ _id: order })
            expect(savedOrder).not.toEqual(null || undefined)
        })
    });

    it('should have total price sum by total orders', async () => {
        const { table, products, productSizes } = await setupData()

        const result = await server.executeOperation({
            query: addInvoiceQuery,
            variables: {
                addInvoiceTable: table.id,
                addInvoiceCustomers: 4,
                addInvoiceProducts: [
                    {
                        id: products[0].id,
                        quantity: 1,
                        size: productSizes[0].id,
                    }
                ]
            }
        })

        const invoice: InvoiceDoc = result.data?.addInvoice

        const totalPrice = invoice.orders.reduce((sum, order) => {
            return sum + (order.quantity * order.size.price)
        }, 0)

        expect(invoice.total_price).toEqual(totalPrice)
    });

    it('should save new invoice with default values', async () => {

        const { table, products, productSizes } = await setupData()

        const result = await server.executeOperation({
            query: addInvoiceQuery,
            variables: {
                addInvoiceTable: table.id,
                addInvoiceCustomers: 4,
                addInvoiceProducts: products.map(product => {
                    return {
                        id: product.id,
                        quantity: 1,
                        size: product.sizes[0]._id.toString()
                    }
                })
            }
        })

        const invoice: InvoiceDoc = result.data?.addInvoice

        expect(invoice.isPaid).toEqual(false)
        expect(invoice.table.id).toEqual(table.id)
        expect(invoice.customers).toEqual(4)
        expect(invoice.orders.length).toEqual(3)
        expect(invoice.time_spent).toEqual(0)

        const totalPrice = invoice.orders.reduce((prev: number, curr: OrderDoc) => {

            const size = productSizes.find(size => size.id === curr.size.id.id)

            const total_price = size!.price * curr.quantity

            expect(curr.totalPrice).toEqual(total_price)

            return prev + (curr.totalPrice * curr.quantity)
        }, 0)

        expect(invoice.total_price).toEqual(totalPrice)
        expect(invoice.final_price).toEqual(0)
        expect(invoice.money_received).toEqual(0)
    });
});