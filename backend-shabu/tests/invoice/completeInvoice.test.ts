import { gql } from "apollo-server-express";
import { isValidObjectId } from "mongoose";
import { InvoiceDoc, OrderDoc, ProductModel, ProductSizeModel, SizeDoc, TableModel } from "../../models";
import { gqlInvoiceFields } from "../../typeDefs";
import { server } from "../apolloServer";

describe('Complete an invoice', () => {
    it('should update invoice payment', async () => {

        const table = await new TableModel({ name: "A200" }).save()

        const productSizes: SizeDoc[] = await ProductSizeModel.insertMany([
            { name: "small", price: 12000 },
            { name: "large", price: 15000 },
        ])

        const products = await ProductModel.insertMany([
            { name: "beer", category: "alcohol", sizes: [productSizes[0].id] },
            { name: "liquor", category: "alcohol", sizes: [productSizes[0].id] },
            { name: "testo", category: "snack", sizes: [productSizes[1].id] }
        ])

        const result = await server.executeOperation({
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

        expect(result.errors).toBeUndefined()
        expect(result.data).not.toBeUndefined()
        expect(isValidObjectId(newInvoice.id)).toBeTruthy();
        expect(newInvoice.isPaid).toEqual(false)
        expect(newInvoice.table.id).toEqual(table.id)
        expect(newInvoice.customers).toEqual(4)
        expect(newInvoice.orders.length).toEqual(3)
        expect(newInvoice.time_spent).toEqual(0)

        const totalPrice = newInvoice.orders.reduce((prev: number, curr: OrderDoc) => {

            const size = productSizes.find(size => size.id === curr.size.id.id)

            const total_price = size!.price * curr.quantity

            expect(curr.totalPrice).toEqual(total_price)

            return prev + (curr.totalPrice * curr.quantity)
        }, 0)

        expect(newInvoice.total_price).toEqual(totalPrice)
        expect(newInvoice.final_price).toEqual(0)
        expect(newInvoice.money_received).toEqual(0)

        const completeInvoiceResult = await server.executeOperation({
            query: gql`
                mutation CompleteInvoiceMutation(
                    $completeInvoiceInvoiceId: ID
                    $completeInvoicePaymentMethod: String
                    $completeInvoiceMoneyReceived: Float
                    $completeInvoicePayerName: String
                    $completeInvoicePayerContact: String
                    $completeInvoiceIsLeft: Boolean
                ) {
                    completeInvoice(
                        invoice_id: $completeInvoiceInvoiceId
                        payment_method: $completeInvoicePaymentMethod
                        money_received: $completeInvoiceMoneyReceived
                        payer_name: $completeInvoicePayerName
                        payer_contact: $completeInvoicePayerContact
                        isLeft: $completeInvoiceIsLeft
                    )
                    ${gqlInvoiceFields}
                }
                `,
            variables: {
                completeInvoiceInvoiceId: newInvoice.id,
                completeInvoicePaymentMethod: "CASH",
                completeInvoiceMoneyReceived: 120000,
                completeInvoicePayerName: "John",
                completeInvoicePayerContact: "3999399",
                completeInvoiceIsLeft: false
            }
        })

        expect(completeInvoiceResult.errors).toBeUndefined()

        const completedInvoice: InvoiceDoc = completeInvoiceResult!.data!.completeInvoice

        expect(completedInvoice.payment_method).toEqual("CASH")
        expect(completedInvoice.money_received).toEqual(120000)
        expect(completedInvoice.payer_name).toEqual("John")
        expect(completedInvoice.payer_contact).toEqual("3999399")
        expect(completedInvoice.isLeft).toEqual(false)
        expect(completedInvoice.change).toEqual(120000 - newInvoice.total_price)
    });

    it('should not response invoice if customers are left', async () => {

        const table = await new TableModel({ name: "A20033" }).save()

        const productSizes: SizeDoc[] = await ProductSizeModel.insertMany([
            { name: "small", price: 12000 },
            { name: "large", price: 15000 },
        ])

        const products = await ProductModel.insertMany([
            { name: "beer", category: "alcohol", sizes: [productSizes[0].id] },
            { name: "liquor", category: "alcohol", sizes: [productSizes[0].id] },
            { name: "testo", category: "snack", sizes: [productSizes[1].id] }
        ])

        const result = await server.executeOperation({
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

        expect(result.errors).toBeUndefined()
        expect(result.data).not.toBeUndefined()
        expect(isValidObjectId(newInvoice.id)).toBeTruthy();
        expect(newInvoice.isPaid).toEqual(false)
        expect(newInvoice.table.id).toEqual(table.id)
        expect(newInvoice.customers).toEqual(4)
        expect(newInvoice.orders.length).toEqual(3)
        expect(newInvoice.time_spent).toEqual(0)

        const totalPrice = newInvoice.orders.reduce((prev: number, curr: OrderDoc) => {

            const size = productSizes.find(size => size.id === curr.size.id.id)

            const total_price = size!.price * curr.quantity

            expect(curr.totalPrice).toEqual(total_price)

            return prev + (curr.totalPrice * curr.quantity)
        }, 0)

        expect(newInvoice.total_price).toEqual(totalPrice)
        expect(newInvoice.final_price).toEqual(0)
        expect(newInvoice.money_received).toEqual(0)

        const completeInvoiceResult = await server.executeOperation({
            query: gql`
                mutation CompleteInvoiceMutation(
                    $completeInvoiceInvoiceId: ID
                    $completeInvoicePaymentMethod: String
                    $completeInvoiceMoneyReceived: Float
                    $completeInvoicePayerName: String
                    $completeInvoicePayerContact: String
                    $completeInvoiceIsLeft: Boolean
                ) {
                    completeInvoice(
                        invoice_id: $completeInvoiceInvoiceId
                        payment_method: $completeInvoicePaymentMethod
                        money_received: $completeInvoiceMoneyReceived
                        payer_name: $completeInvoicePayerName
                        payer_contact: $completeInvoicePayerContact
                        isLeft: $completeInvoiceIsLeft
                    )
                    ${gqlInvoiceFields}
                }
                `,
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