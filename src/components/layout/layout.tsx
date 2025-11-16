import React, { useEffect, useState } from "react";
import { Layout, Menu, theme, Dropdown, Avatar, Space } from "antd";
import type { MenuProps } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";

import Logo from "../logo/logo";
import MhBreadcrumb from "../breadcrumb/breadcrumb";
import { sidebarItems } from "../../config/sidebar";
import { useAuthRedirect } from "../../hooks/useAuth";
import { logout } from "../../utils/auth";
import axiosInstance from "../../utils/axios";

const { Header, Content, Sider } = Layout;

interface User {
  name: string;
  email: string;
}

const MainLayout: React.FC = () => {
  useAuthRedirect();
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    axiosInstance.get("/api/user/me").then((res) => setUser(res.data));
  }, []);

  const menuItems: MenuProps["items"] = sidebarItems.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: <Link to={item.href}>{item.label}</Link>,
  }));

  const activeItem = sidebarItems.find(
    (item) =>
      location.pathname === item.href ||
      location.pathname.startsWith(item.href + "/")
  );

  const profileMenu: MenuProps["items"] = [
    {
      key: "logout",
      label: "Log Out",
      onClick: () => logout(),
    },
  ];

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header */}
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "var(--secondary-color)",
          padding: "0 32px",
        }}
      >
        <Logo />

        <Dropdown menu={{ items: profileMenu }} trigger={["click"]}>
          <Space style={{ cursor: "pointer", color: "var(--primary-color)" }}>
            <Avatar
              style={{ color: "var(--primary-color)" }}
              icon={<UserOutlined />}
            />
            <span
              style={{
                fontSize: "14px",
                fontFamily: "var(--primary-font-family)",
                fontWeight: "600",
                color: "var(--primary-color)",
              }}
            >
              {user ? `${user.name}` : "User"}
            </span>
          </Space>
        </Dropdown>
      </Header>

      {/* Main layout */}
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
