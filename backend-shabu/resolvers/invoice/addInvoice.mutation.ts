import { InvoiceModel, ProductModel } from "../../models";

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
            if(!product) throw new Error("Product not found")

            const size = product.sizes.find(fullDetailProductSize => fullDetailProductSize.id === inputProduct?.size)
            if (!size) throw new Error("Size not found")

            return {
                product_id: product.id,
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

        const newInvoice = await new InvoiceModel({
            table: args.table,
            customers: args.customers,
            orders: products,
            total_price: products.reduce((prev, curr) => prev + curr.totalPrice, 0)
        }).save()

        const item = await InvoiceModel.findOne({ _id: newInvoice.id }).populate("table")

        return item;
    } catch (error) {
        return error
    }
}