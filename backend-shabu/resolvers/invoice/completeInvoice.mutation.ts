import { gql } from "apollo-server-express";
import { InvoiceModel, PaymentMethods, TableModel } from "../../models";
import { gqlInvoiceFields } from "../../typeDefs";

export const completeInvoice = async (_: any, args: {
    invoice_id: string,
    payment_method: PaymentMethods,
    money_received: number,
    payer_name: string,
    payer_contact: string,
    isLeft: boolean
}) => {
    const {
        invoice_id,
        payment_method,
        money_received,
        payer_name,
        payer_contact,
        isLeft
    } = args

    const invoice = await InvoiceModel.findOne({ _id: invoice_id })

    if (!invoice) throw new Error("Invoice not found")

    const change = money_received - invoice.total_price

    if (change < 0) throw new Error("Not enough money")

    await InvoiceModel.findOneAndUpdate(
        { _id: args.invoice_id },
        {
            $set: {
                payment_method,
                money_received,
                change,
                isPaid: true,
                payer_name,
                payer_contact,
                isLeft
            }
        },
        {
            new: true
        }
    )

    if (isLeft) return null

    const updateInvoice = await InvoiceModel.getFullDetail({ invoice_id: invoice.id })

    return updateInvoice;
}

export const completeInvoiceQuery = gql`
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
    `