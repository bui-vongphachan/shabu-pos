import { Layout, Menu } from "antd"
import Navbar from "../../components/navbar";

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