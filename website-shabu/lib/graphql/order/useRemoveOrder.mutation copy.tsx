import { gql, QueryOptions, useMutation } from "@apollo/client";

export const useRemoveOrder = () => {
  const [removeOrderMutation, RemoveOrderMutation] = useMutation(gql`
    mutation UpdateOrderQuantityMutation(
      $deleteOrderInvoiceId: ID
      $deleteOrderOrderId: ID
    ) {
      deleteOrder(
        invoice_id: $deleteOrderInvoiceId
        order_id: $deleteOrderOrderId
      )
    }
  `);

  const removeOrder = (
    variables: {
      deleteOrderInvoiceId: string;
      deleteOrderOrderId: string;
    },
    refetchQueries: QueryOptions[],
    afterComplete?: (data: any) => void
  ) => {
    removeOrderMutation({
      variables,
      refetchQueries: refetchQueries,
      onQueryUpdated: async (observableQuery) => {
        const { data } = await observableQuery.refetch();
        afterComplete!(data);
      }
    });
  };
  return [RemoveOrderMutation, removeOrder] as const;
};
