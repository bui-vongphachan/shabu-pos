import { useMutation } from '@apollo/client'
import { createContext, useEffect, useState } from 'react'
import DefaultLayout from '../layouts/default'
import { client } from '../lib/apolloSetup'
import { HomePageQueryString } from '../lib/graphql/home/homeQueryString.gql'
import { ProductInCartModel, ProductModel, ReadyTableModel } from '../models'
import { addInvoiceToTableQueryString, InvoiceModel } from '../models/invoice'
import ControlPanelHome from './home/controlPanel/controlPanel.home'
import OrderListHomeComponent from './home/orderList/orderList.home'
import TableListHomeComponent from './home/tableList/tableList.home'

export const HomePageContext = createContext<{
  invoice: InvoiceModel | null
  productsInCart: ProductInCartModel[],
  selectedProduct: ProductModel | null,
  products: ProductModel[],
  readyTables: ReadyTableModel[],
  selectedTable: ReadyTableModel | null,
  isActionCLicked: boolean,
  setSelectedTable: (readyTables: ReadyTableModel | null) => void,
  setActionClicked: (status: boolean) => void,
  selectProduct: (product: ProductModel | null) => void,
  saveItemToCart: (quantity: number, sizeIndex: number) => void
  setProductsInCart: (item: ProductInCartModel[]) => void,
  removeItemFromCart: (productInCartIndex: number) => void,
  addInvoiceToTable: () => Promise<void>
}>({
  invoice: null,
  productsInCart: [],
  selectedProduct: null,
  products: [],
  readyTables: [],
  selectedTable: null,
  isActionCLicked: false,
  setSelectedTable: function () { },
  setActionClicked: function () { },
  selectProduct: function () { },
  saveItemToCart: function () { },
  setProductsInCart: function () { },
  removeItemFromCart: function () { },
  addInvoiceToTable: async function () { },
});

const Home: any = (props: {
  readyTables: ReadyTableModel[],
  products: ProductModel[],
}) => {
  const [invoice, setInvoice] = useState<InvoiceModel | null>(null)
  const [productsInCart, setProductsInCart] = useState<ProductInCartModel[]>([])
  const [selectedProduct, selectProduct] = useState<ProductModel | null>(null)
  const [products, setProducts] = useState<ProductModel[]>([])
  const [selectedTable, setSelectedTable] = useState<ReadyTableModel | null>(null)
  const [readyTables, setReadyTables] = useState<ReadyTableModel[]>([]);
  const [isActionCLicked, setActionClicked] = useState(false)
  const [layoutStyle, setLayoutStyle] = useState({
    table: "",
    invoice: "",
    action: ""
  })
  const [addInvoiceToTableMutation, addInvoiceToTableResponse] = useMutation(addInvoiceToTableQueryString)
  const saveItemToCart = (quantity: number, sizeIndex: number) => {
    const productIndex = productsInCart.findIndex(item => item.id === selectedProduct?.id)
    if (productIndex > -1 && productsInCart[productIndex].sizeIndex === sizeIndex) {
      productsInCart[productIndex].quantity += quantity
    } else {
      productsInCart.push({
        ...selectedProduct!,
        quantity,
        sizeIndex
      })
    }

    setProductsInCart([...productsInCart])
    selectProduct(null)
  }
  const removeItemFromCart = (productInCartIndex: number) => {
    productsInCart.splice(productInCartIndex, 1);
    setProductsInCart([...productsInCart])
  }
  const addInvoiceToTable = async () => {
    try {
      const { data } = await addInvoiceToTableMutation({
        variables: {
          addInvoiceTable: selectedTable?.table.id,
          addInvoiceCustomers: 0,
          addInvoiceProducts: productsInCart.map(item => {
            return {
              id: item.id,
              quantity: item.quantity,
              size: item.sizes[item.sizeIndex].id,
            }
          })
        }
      })

      setInvoice(data.addInvoice)
    } catch (error) {
      console.log(error)
    }
  }
  const context = {
    invoice,
    productsInCart,
    selectedProduct,
    products,
    readyTables,
    selectedTable,
    isActionCLicked,
    setSelectedTable,
    setActionClicked,
    selectProduct,
    saveItemToCart,
    setProductsInCart,
    removeItemFromCart,
    addInvoiceToTable
  };

  useEffect(() => {
    setReadyTables(props.readyTables)
    setProducts(props.products)
  }, [])
  useEffect(() => {
    if (!!selectedTable && isActionCLicked) {

    } else if (!!selectedTable && !isActionCLicked) {
      setLayoutStyle({
        table: "lg:col-span-6",
        invoice: "lg:col-span-6",
        action: ""
      })
    } else {
      setLayoutStyle({
        table: "lg:col-span-12",
        invoice: "",
        action: ""
      })
    }
  }, [selectedTable])

  return (
    <HomePageContext.Provider value={context}>
      <div className={`container mt-3 mx-auto grid gap-3 xl:grid-cols-12`}>
        <div className={layoutStyle.table}>
          <TableListHomeComponent />
        </div>
        {
          !!selectedTable ? <div className={layoutStyle.invoice}>
            <ControlPanelHome />
            <OrderListHomeComponent />
          </div> : null
        }

        <div className=" lg:col-span-4 md:col-span-12 bg-green-400">
          as
        </div>
      </div>
    </HomePageContext.Provider>
  )
}

export const getServerSideProps = async () => {
  const { data } = await client.query({
    query: HomePageQueryString
  })
  return {
    props: {
      readyTables: data.getReadyTables,
      products: data.getProducts
    }
  }
}


Home.getLayout = DefaultLayout

export default Home
