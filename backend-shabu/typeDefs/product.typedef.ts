import { gql } from "apollo-server";

export const productTypeDef = gql`
  type Product {
    id: ID
    name: String
    category: String
    options: [ProductOption]
    sizes: [ProductSize]
    isDeleted: Boolean
    created_date: Date
    schema_version: Int
  }
  type ProductCategory {
    _id: String
    count: Int
  }
  type Query {
    getProduct(product_id: ID): Product
    getProducts: [Product]
    getProductCategories: [ProductCategory]
  }
  input ProductSizeInput {
    name: String
    price: Float
  }
  input UpdateProductSizeInput {
    size_id: ID
    name: String
    price: Float
  }
  input AddProductSizesInput {
    name: String
    price: Float
  }
  type Mutation {
    addProduct(
      name: String
      sizes: [ProductSizeInput]
      options: [addProductOptionInput]
    ): Boolean
    updateProduct(
      product_id: ID
      name: String
      sizes: [UpdateProductSizeInput]
    ): Boolean
    addProductSizes(product_id: ID, sizes: [AddProductSizesInput]): Boolean
    deleteProductSizes(sizes: [String]): Boolean,
    deleteProduct(product_id: ID): Boolean
  }
`;
