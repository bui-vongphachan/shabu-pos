import { Layout, Menu } from "antd"
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import dynamic from 'next/dynamic'

const Navbar = dynamic(() => import('../../components/navbar'))

const { Footer, Content } = Layout;


const DefaultLayout = (props: any) => {
    const [navHeight, setNavHeight] = useState(0)
    const [footerHeight, footerNavHeight] = useState(0)
    const navRef: any = useRef(null)
    const footerRef: any = useRef(null)
    useEffect(() => {
        setNavHeight(navRef.current.clientHeight)
        footerNavHeight(footerRef.current.clientHeight)
    })
    return (
        <Layout>
            <div ref={navRef}>
                <Navbar />
            </div>
            <div style={{
                height: `calc(100vh - ${navHeight + footerHeight}px)`,
                overflow: "auto"
            }}>
                <Content>{props.children}</Content>
            </div>
            <div ref={footerRef}>
                {/* <Footer>Footer</Footer> */}
            </div>
        </Layout>
    )
}

export default DefaultLayout