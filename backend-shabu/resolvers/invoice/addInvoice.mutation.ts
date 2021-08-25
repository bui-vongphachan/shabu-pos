import { gql } from "apollo-server-express";
import { InvoiceModel, ProductModel, OrderModel, TableModel } from "../../models";
import { gqlInvoiceFields } from "../../typeDefs";

export const addInvoice = async (_: any, args: {
    table: string,
    customers: number,
    products: [
        {
            id: string,
            quantity: number,
            size: string,
        }
    ]
}) => {
    try {
        const fullDetailProducts = await ProductModel.find({
            _id: {
                $in: args.products.map(item => item.id)
            }
        }).populate("sizes")

        const products = args.products.map(inputProduct => {

            const product = fullDetailProducts.find(fullDetailProduct => fullDetailProduct.id === inputProduct.id)
            if (!product) throw new Error("Product not found")

            const size = product.sizes.find(fullDetailProductSize => fullDetailProductSize.id === inputProduct?.size)
            if (!size) throw new Error("Size not found")

            return {
                product: product.id,
                name: product.name,
                size: {
                    id: size!.id,
                    name: size!.name,
                    price: size!.price
                },
                quantity: inputProduct!.quantity,
                totalPrice: inputProduct!.quantity * size!.price
            }
        })

        const table = await TableModel.findOne({ _id: args.table })

        const orders = await OrderModel.insertMany(products)

        const newInvoice = await new InvoiceModel({
            table: { id: table?.id, name: table?.name },
            customers: args.customers,
            orders: orders.map(order => order.id),
            total_price: products.reduce((prev, curr) => prev + curr.totalPrice, 0)
        }).save()

        return await InvoiceModel.getFullDetail(newInvoice.id)

    } catch (error) {
        return error
    }
}

export const addInvoiceQuery = gql`
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
    `