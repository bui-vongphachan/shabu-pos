import { gql } from "apollo-server-express";
import { isValidObjectId } from "mongoose";
import { ProductModel, ProductSizeModel, TableModel } from "../../models";
import { server } from "../apolloServer";

describe('Add invoice', () => {
    it('should save new invoice', async () => {

        const table = await new TableModel({ name: "A200" }).save()

        const productSizes = await ProductSizeModel.insertMany([
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
                    $addInvoiceProducts: [InvoiceProductInput]
                ) {
                    addInvoice(
                        table: $addInvoiceTable, 
                        customers: $addInvoiceCustomers, 
                        products: $addInvoiceProducts
                    ) {
                        id
                        isPaid
                        table {
                            id
                            name
                            created_date
                        }
                        customers
                        products {
                            id
                            name
                            isReceived
                            size {
                                id
                                name
                                price
                                created_date
                            }
                            quantity
                            totalPrice
                            ordered_date
                        }
                        time_spent
                        total_price
                        final_price
                        money_received
                        money_return
                        printed_time
                        arrived_time
                        created_date
                    }
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

        const data = result.data?.addInvoice
        expect(result.errors).toBeUndefined()
        expect(result.data).not.toBeUndefined()
        expect(isValidObjectId(data.id)).toBeTruthy();
        expect(data.isPaid).toEqual(false)
        expect(data.table.id).toEqual(table.id)
        expect(data.customers).toEqual(4)
        expect(data.products.length).toEqual(3)
        expect(data.time_spent).toEqual(0)

        const totalPrice = data.products.reduce((prev: number, curr: any) => {
            
            const size = productSizes.find(size => size.id === curr.size.id)

            const total_price = size!.price * curr.quantity

            expect(curr.totalPrice).toEqual(total_price)

            return prev + (curr.totalPrice * curr.quantity)
        }, 0)

        expect(data.total_price).toEqual(totalPrice)
        expect(data.final_price).toEqual(0)
        expect(data.money_received).toEqual(0)
        expect(data.money_return).toEqual(0)
        expect(data.printed_time).toEqual(null)
    });
});