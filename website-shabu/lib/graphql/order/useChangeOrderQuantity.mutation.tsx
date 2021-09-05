import { gql, QueryOptions, useMutation } from "@apollo/client";

export const useChangeOrderQuantity = () => {
  const [changeOrderQuantityMutation, ChangeOrderQuantityMutation] =
    useMutation(gql`
      mutation UpdateOrderQuantityMutation(
        $updateOrderQuantityInvoiceId: ID
        $updateOrderQuantityOrderId: ID
        $updateOrderQuantityQuantity: Int
      ) {
        updateOrderQuantity(
          invoice_id: $updateOrderQuantityInvoiceId
          order_id: $updateOrderQuantityOrderId
          quantity: $updateOrderQuantityQuantity
        )
      }
    `);

  const changeOrderQuantity = (
    variables: {
      updateOrderQuantityInvoiceId: string;
      updateOrderQuantityOrderId: string;
      updateOrderQuantityQuantity: number;
    },
    refetchQueries: QueryOptions[],
    afterComplete: (data: any) => void
  ) => {
    changeOrderQuantityMutation({
      variables,
      refetchQueries: refetchQueries,
      onQueryUpdated: async (observableQuery) => {
        const { data } = await observableQuery.refetch();
        afterComplete(data);
      }
    });
  };
  return [ChangeOrderQuantityMutation, changeOrderQuantity] as const;
};
