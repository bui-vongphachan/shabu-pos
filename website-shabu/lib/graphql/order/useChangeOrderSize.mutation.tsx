import { gql, QueryOptions, useMutation } from "@apollo/client";

export const useChangeOrderSize = () => {
  const [changeOrderSizeMutation, ChangeOrderSizeMutation] = useMutation(
    gql`
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
      }
    `
  );

  const changeOrderSize = (
    variables: {
      changeOrderSizeInvoiceId: string;
      changeOrderSizeOrderId: string;
      changeOrderSizeSizeId: string;
    },
    refetchQueries: QueryOptions[],
    afterComplete: (data: any) => void
  ) =>
    changeOrderSizeMutation({
      variables,
      refetchQueries: refetchQueries,
      onQueryUpdated: async (observableQuery) => {
        const { data } = await observableQuery.refetch();
        afterComplete(data);
      }
    });

  return [ChangeOrderSizeMutation, changeOrderSize] as const;
};
