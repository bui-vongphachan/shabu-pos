import { gql, UserInputError } from "apollo-server-express"
import { ProductSizeModel, ProductModel, InvoiceModel, OrderModel } from "../../models"

export const deleteSize = async (_: any, args: { size_id: string }) => {
    try {
        const order = await OrderModel.findOne({
            "size.id": args.size_id,
            isPaid: false
        })

        if (order) {

            const invoice = await InvoiceModel.findOne(
                {
                    orders: { $elemMatch: { $eq: order.id } },
                    isPaid: false
                }
            )

            if (invoice) throw new UserInputError(`This item is being used in table ${invoice?.table.name}`)
        }

        await ProductSizeModel.findOneAndUpdate(
            { _id: args.size_id },
            { $set: { isDeleted: true } }
        )

        return await ProductModel.getFullDetails()

    } catch (error) {
        throw new Error(error)
    }
}

export const deleteSizeQuery = gql`
  mutation DeleteSizeMutation($deleteSizeSizeId: ID) {
      deleteSize(size_id: $deleteSizeSizeId) {
          id
          name
          category
          sizes {
              id
              name
              price
              isDeleted
              created_date
              schema_version
          }
          created_date
          schema_version
      }
  }
`