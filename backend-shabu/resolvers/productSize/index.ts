import { addSize } from "./addSize.mutation"
import { deleteSize } from "./deleteSize.mutation"

export const productSizeResolver = {
    Query: {},
    Mutation: { addSize, deleteSize }
};
