import { Menu } from "antd";
import { Layout } from "antd";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import { useState } from "react";

const Navbar = (props: any) => {
  const [active, setActive] = useState("home");
  const router = useRouter();

  useEffect(() => {
    const checkPath = (currentPath: string, activePath: string) =>
      currentPath.startsWith(activePath, 0);
    if (checkPath(router.pathname, "/menu")) setActive("menu");
    else if (checkPath(router.pathname, "/table")) setActive("table");
    else if (checkPath(router.pathname, "/report")) setActive("report");
    else if (checkPath(router.pathname, "/")) setActive("home");
  }, [router.pathname]);

  return (
    <Layout.Header style={{ backgroundColor: "white" }}>
      <Menu mode="horizontal" selectedKeys={[active]}>
        <Menu.Item key="home">
          <Link href="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="menu">
          <Link href="/menu">Menu</Link>
        </Menu.Item>
      </Menu>
    </Layout.Header>
  );
};

export default Navbar;
