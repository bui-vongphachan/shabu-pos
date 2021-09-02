import { gql } from "apollo-server-express";
import { InvoiceDoc, ProductDoc, ProductModel, ProductSizeModel, ReadyTableDoc, SizeDoc, TableDoc, TableModel } from "../../models";
import { GetReadyTablesQueryString } from "../../resolvers/table/getReadyTable.query";
import { server } from "../../starters/apolloServer";
import { commerce, lorem, name } from "faker"
import { addOrderToInvoiceMutation } from "../../resolvers/order/addOrderToInvoice.mutation";
import { addInvoiceQuery } from "../../resolvers/invoice/addInvoice.mutation";

describe('Get ready tables', () => {

    const setupData = async (): Promise<{
        table: TableDoc,
        productSizes: SizeDoc[],
        products: ProductDoc[],
        invoice: InvoiceDoc
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

        const { data } = await server.executeOperation({
            query: addInvoiceQuery,
            variables: {
                addInvoiceTable: table.id,
                addInvoiceCustomers: 2,
                addInvoiceProducts: [
                    {
                        id: products[0].id,
                        quantity: 2,
                        size: productSizes[0].id,
                    },
                    {
                        id: products[0].id,
                        quantity: 2,
                        size: productSizes[0].id,
                    }
                ]
            }
        })
        
        const invoice = data?.addInvoice

        return { table, productSizes, products, invoice }
    }

    it('should response table with detail ', async () => {
        await TableModel.insertMany([
            { name: `${name.firstName()} ${lorem.word()}` },
            { name: `${name.firstName()} ${lorem.word()}` },
            { name: `${name.firstName()} ${lorem.word()}` }
        ])

        const { data, errors } = await server.executeOperation({
            query: GetReadyTablesQueryString
        })

        const readyTables: ReadyTableDoc[] = data?.getReadyTables

        const result = readyTables.some(table => table.orders > 0)

        expect(errors).toBeUndefined()
    //    expect(result).toEqual(true)
    });
});