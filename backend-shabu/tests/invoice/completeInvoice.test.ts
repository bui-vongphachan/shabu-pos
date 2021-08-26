import { isValidObjectId } from "mongoose";
import { InvoiceDoc, OrderDoc, ProductDoc, ProductModel, ProductSizeModel, SizeDoc, TableDoc, TableModel } from "../../models";
import { addInvoiceQuery } from "../../resolvers/invoice/addInvoice.mutation";
import { completeInvoiceQuery } from "../../resolvers/invoice/completeInvoice.mutation";
import { server } from "../../starters/apolloServer";
import { commerce, lorem, name, phone } from "faker"

describe('Complete an invoice', () => {

    const setupData = async (): Promise<{
        table: TableDoc,
        productSizes: SizeDoc[],
        products: ProductDoc[],
    }> => {
        const table = await new TableModel({ name: lorem.word() }).save()

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

    it('should update invoice payment', async () => {

        const { table, products } = await setupData()

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

        const newInvoice: InvoiceDoc = result.data?.addInvoice

        const customerName = name.findName()
        const customerPhone = phone.phoneNumber()

        const completeInvoiceResult = await server.executeOperation({
            query: completeInvoiceQuery,
            variables: {
                completeInvoiceInvoiceId: newInvoice.id,
                completeInvoicePaymentMethod: "CASH",
                completeInvoiceMoneyReceived: 120000,
                completeInvoicePayerName: customerName,
                completeInvoicePayerContact: customerPhone,
                completeInvoiceIsLeft: false
            }
        })

        expect(completeInvoiceResult.errors).toBeUndefined()

        const completedInvoice: InvoiceDoc = completeInvoiceResult!.data!.completeInvoice

        expect(completedInvoice.payment_method).toEqual("CASH")
        expect(completedInvoice.money_received).toEqual(120000)
        expect(completedInvoice.payer_name).toEqual(customerName)
        expect(completedInvoice.payer_contact).toEqual(customerPhone)
        expect(completedInvoice.isLeft).toEqual(false)
        expect(completedInvoice.change).toEqual(120000 - newInvoice.total_price)
    });

    it('should not response invoice if customers are left', async () => {
        const { table, productSizes, products } = await setupData()

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

        const newInvoice: InvoiceDoc = result.data?.addInvoice

        const completeInvoiceResult = await server.executeOperation({
            query: completeInvoiceQuery,
            variables: {
                completeInvoiceInvoiceId: newInvoice.id,
                completeInvoicePaymentMethod: "CASH",
                completeInvoiceMoneyReceived: 120000,
                completeInvoicePayerName: "John",
                completeInvoicePayerContact: "3999399",
                completeInvoiceIsLeft: true
            }
        })

        expect(completeInvoiceResult.errors).toBeUndefined()

        const completedInvoice: InvoiceDoc = completeInvoiceResult!.data!.completeInvoice

        expect(completedInvoice).toBeNull()
    });
});