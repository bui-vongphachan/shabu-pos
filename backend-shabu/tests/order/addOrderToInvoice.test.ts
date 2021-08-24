import { gql } from "apollo-server-express";
import { isValidObjectId } from "mongoose";
import { InvoiceModel, ProductModel, ProductSizeModel } from "../../models";
import { gqlInvoiceFields } from "../../typeDefs";
import { server } from "../apolloServer";

describe('Add new order to invoice', () => {
    it('should save new order to invoice', async () => {

        const newInvoice = await new InvoiceModel({ total_price: 0 }).save()

        expect(isValidObjectId(newInvoice.id)).toBeTruthy();
        expect(newInvoice.isPaid).toEqual(false)
        expect(newInvoice.orders.length).toEqual(0)
        expect(newInvoice.total_price).toEqual(0)
        expect(newInvoice.final_price).toEqual(0)
        expect(newInvoice.money_received).toEqual(0)

        const newProductSize = await new ProductSizeModel({ name: "small", price: 1000 }).save()
        const newProduct = await new ProductModel({ name: "Bacon", sizes: [newProductSize.id] }).save()

        const result = await server.executeOperation({
            query: gql`
                mutation AddOrderToInvoiceMutation(
                    $addOrderToInvoiceInvoiceId: ID
                    $addOrderToInvoiceProducts: [addOrderToInvoiceInput]
                ) {
                    addOrderToInvoice(
                        invoice_id: $addOrderToInvoiceInvoiceId
                        products: $addOrderToInvoiceProducts
                    )
                    ${gqlInvoiceFields}
                }
                `,
            variables: {
                addOrderToInvoiceInvoiceId: newInvoice.id,
                addOrderToInvoiceProducts: [
                    {
                        id: newProduct.id,
                        quantity: 1,
                        size: newProductSize.id
                    }
                ]
            }
        })

        expect(result.errors).toBeUndefined()
        expect(result.data).not.toBeUndefined()
        expect(result.data?.addOrderToInvoice).not.toBeUndefined()

    });
});