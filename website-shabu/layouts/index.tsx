import { Fragment } from "react"
import Navbar from "../components/navbar"
import { Layout, Menu } from "antd"

const { Footer, Content } = Layout;


const DefaultLayout = (props: any) => {
    return (
        <Layout>
            <Navbar />
            <Content>{props.children}</Content>
            <Footer>Footer</Footer>
        </Layout>
    )
}

export default DefaultLayout