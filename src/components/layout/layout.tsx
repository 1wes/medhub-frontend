import React from "react";
import { Layout, Menu, theme } from "antd";
import type { MenuProps } from "antd";
import Logo from "../logo/logo";
import { Outlet } from "react-router-dom";
import { useAuthRedirect } from "../../hooks/useAuth";
import MhBreadcrumb from "../breadcrumb/breadcrumb";
import { sidebarItems } from "../../config/sidebar";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";

const { Header, Content, Sider } = Layout;

const menuItems: MenuProps["items"] = sidebarItems.map((item) => ({
  key: item.key,
  icon: item.icon,
  label: <Link to={item.href}>{item.label}</Link>,
}));

const MainLayout: React.FC = () => {
  useAuthRedirect();
  const location = useLocation();
  const navigate = useNavigate();

  const activeItem = sidebarItems.find(
    (item) =>
      location.pathname === item.href ||
      location.pathname.startsWith(item.href + "/")
  );

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "var(--secondary-color)",
        }}
      >
        <Logo />
      </Header>
      <div style={{ padding: "0 48px" }}>
        <MhBreadcrumb />
        <Layout
          style={{
            padding: "24px 0",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Sider
            style={{
              background: colorBgContainer,
              fontFamily: "var(--primary-font-family)",
            }}
            width={300}
          >
            <Menu
              mode="inline"
              selectedKeys={[activeItem ? activeItem.key : "1"]}
              onClick={(e) => {
                const clicked = sidebarItems.find((item) => item.key === e.key);
                if (clicked) navigate(clicked.href);
              }}
              style={{
                minHeight: "80vh",
                fontFamily: "var(--primary-font-family)",
              }}
              items={menuItems}
            />
          </Sider>
          <Content style={{ padding: "0 24px", minHeight: 280 }}>
            <Outlet />
          </Content>
        </Layout>
      </div>
    </Layout>
  );
};
export default MainLayout;
