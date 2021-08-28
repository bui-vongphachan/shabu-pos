import { Menu } from "antd"
import { SettingOutlined, HomeOutlined } from '@ant-design/icons'
import { Fragment, useState } from "react"
import { GiHotMeal, GiTable } from "react-icons/gi"
import { Layout } from "antd"
import Link from "next/link"

const Navbar = () => {
    const [state, setState] = useState({ current: "mail" })
    return (
        <Layout.Header style={{ backgroundColor: "white" }}>
            <Menu mode="horizontal" defaultSelectedKeys={['home']}>
                <Menu.Item key="home">
                    <Link href="/">Home</Link>
                </Menu.Item>
                <Menu.Item key="menu">
                    <Link href="/menu">Menu</Link>
                </Menu.Item>
                <Menu.Item key="table">
                    <Link href="/table">Table</Link>
                </Menu.Item>
                <Menu.Item key="report">
                    <Link href="/report">Report</Link>
                </Menu.Item>
            </Menu>
        </Layout.Header>
    )
}

export default Navbar