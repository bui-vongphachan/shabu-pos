import { useQuery } from "@apollo/client"
import { createContext, useContext, useState } from "react"
import { useEffect } from "react"
import DefaultLayout from "../../layouts/default"
import { client } from "../../lib/apolloSetup"
import { getProductsQueryString } from "../../lib/graphql/product/getProducts.gql"
import { ProductModel } from "../../models"
import AddProductMenuComponent from "./addProduct.menu"
import ProductEditorMenuComponent from "./productEditor.menu"
import ProductListMenuComponent from "./productList.menu"

export const MenuPageContext = createContext<{
    products: ProductModel[],
    setProducts: (products: ProductModel[]) => void
}>({
    products: [],
    setProducts: function () { },
});

const Menu = (props: {
    products: ProductModel[]
}) => {
    const [products, setProducts] = useState<ProductModel[]>([]);

    const context = { products, setProducts };

    useEffect(() => {
        setProducts(props.products)
    }, [])

    return (
        <MenuPageContext.Provider value={context}>
            <div className=" mt-3 mx-auto grid grid-cols-3 container bg-purple-200">
                <AddProductMenuComponent />
                <ProductListMenuComponent />
                <ProductEditorMenuComponent />
            </div>
        </MenuPageContext.Provider>
    )
}

export const getStaticProps = async () => {
    const { data } = await client.query({
        query: getProductsQueryString
    })
    return {
        props: {
            products: data.getProducts
        }
    }
}

Menu.getLayout = DefaultLayout

export default Menu
