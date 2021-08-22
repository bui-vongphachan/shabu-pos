import { gql } from "apollo-server-express";
import { isValidObjectId } from "mongoose";
import { InvoiceModel, ProductModel, ProductSizeModel } from "../../models";
import { server } from "../apolloServer";

describe('Add new orders to invoice', () => {
    it('should save new orders to invoice', async () => {

        const newInvoice = await new InvoiceModel({}).save()

        expect(isValidObjectId(newInvoice.id)).toBeTruthy();
        expect(newInvoice.isPaid).toEqual(false)
        expect(newInvoice.orders.length).toEqual(0)
        expect(newInvoice.total_price).toEqual(0)
        expect(newInvoice.final_price).toEqual(0)
        expect(newInvoice.money_received).toEqual(0)
        expect(newInvoice.money_return).toEqual(0)

        const newProductSize = await new ProductSizeModel({ name: "small", price: 9999 }).save()
        const newProduct = await new ProductModel({ name: "Bacon", sizes: [newProductSize.id] }).save()

        const result = await server.executeOperation({
            query: gql`
                mutation AddProductToInvoiceMutation(
                    $addProductToInvoiceInvoiceId: ID,
                    $addProductToInvoiceProducts: [InvoiceProductInput]
                ) {
                    addProductToInvoice(
                        invoice_id: $addProductToInvoiceInvoiceId,
                        products: $addProductToInvoiceProducts
                    ) {
                        id
                        isPaid
                        table {
                            id
                            name
                            created_date
                        }
                        customers
                        orders {
                            id
                            name
                            isReceived
                            size {
                                id
                                name
                                price
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
                    }
                }
                `,
            variables: {
                addProductToInvoiceInvoiceId: newInvoice.id,
                addProductToInvoiceProducts: [
                    {
                        id: newProduct.id,
                        quantity: 1,
                        size: newProductSize.id
                    }
                ]
            }
        })

        const data = result.data?.addProductToInvoice
        expect(data.isPaid).toEqual(false)
        expect(data.orders.length).toEqual(1)

        const totalPrice = newProductSize.price * 1

        expect(data.total_price).toEqual(totalPrice)
        expect(data.final_price).toEqual(0)
        expect(data.money_received).toEqual(0)
        expect(data.money_return).toEqual(0)
    });
});