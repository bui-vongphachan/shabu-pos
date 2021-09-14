import { Layout } from "antd";
import { createContext, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("../../components/navbar"));

const { Content } = Layout;

export const LayoutContext = createContext<{
  navHeight: number;
}>({
  navHeight: 0
});

const DefaultLayout = (props: any) => {
  const [navHeight, setNavHeight] = useState(0);
  const navRef: any = useRef(null);
  useEffect(() => {
    setNavHeight(navRef.current.clientHeight);
  });
  const context = { navHeight };
  return (
    <Layout>
      <LayoutContext.Provider value={context}>
        <div ref={navRef}>
          <Navbar />
        </div>
        <div
          style={{
            height: `calc(100vh - ${navHeight}px)`,
            overflow: "auto"
          }}
        >
          <Content>{props.children}</Content>
        </div>
      </LayoutContext.Provider>
    </Layout>
  );
};

export default DefaultLayout;
