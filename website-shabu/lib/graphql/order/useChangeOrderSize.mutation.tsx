import {
  DocumentNode,
  gql,
  MutationOptions,
  QueryOptions,
  useMutation
} from "@apollo/client";

export const useChangeOrderSize = (fields: DocumentNode) => {
  const [changeOrderSizeMutation, ChangeOrderSizeMutation] = useMutation(gql`
    mutation ChangeOrderSizeMutation(
      $changeOrderSizeInvoiceId: ID
      $changeOrderSizeOrderId: ID
      $changeOrderSizeSizeId: ID
    ) {
      changeOrderSize(
        invoice_id: $changeOrderSizeInvoiceId
        order_id: $changeOrderSizeOrderId
        size_id: $changeOrderSizeSizeId
      ) 
      ${fields}
    }
  `);

  const changeOrderSize = (
    variables: {
      changeOrderSizeInvoiceId: string;
      changeOrderSizeOrderId: string;
      changeOrderSizeSizeId: string;
    },
    refetchQueries: QueryOptions[]
  ) =>
    changeOrderSizeMutation({
      variables,
      refetchQueries: refetchQueries
    });

  return [ChangeOrderSizeMutation, changeOrderSize] as const;
};
