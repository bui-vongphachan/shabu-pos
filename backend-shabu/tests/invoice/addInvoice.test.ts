import { gql } from "apollo-server-express";
import { isValidObjectId } from "mongoose";
import { OrderDoc, ProductModel, ProductSizeModel, SizeDoc, TableModel } from "../../models";
import { addInvoiceQuery } from "../../resolvers/invoice/addInvoice.mutation";
import { server } from "../../starters/apolloServer";

describe('Add invoice', () => {
    it('should save new invoice', async () => {

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

        const data = result.data?.addInvoice
        expect(result.errors).toBeUndefined()
        expect(result.data).not.toBeUndefined()
        expect(isValidObjectId(data.id)).toBeTruthy();
        expect(data.isPaid).toEqual(false)
        expect(data.table.id).toEqual(table.id)
        expect(data.customers).toEqual(4)
        expect(data.orders.length).toEqual(3)
        expect(data.time_spent).toEqual(0)

        const totalPrice = data.orders.reduce((prev: number, curr: OrderDoc) => {

            const size = productSizes.find(size => size.id === curr.size.id.id)

            const total_price = size!.price * curr.quantity

            expect(curr.totalPrice).toEqual(total_price)

            return prev + (curr.totalPrice * curr.quantity)
        }, 0)

        expect(data.total_price).toEqual(totalPrice)
        expect(data.final_price).toEqual(0)
        expect(data.money_received).toEqual(0)
    });
});