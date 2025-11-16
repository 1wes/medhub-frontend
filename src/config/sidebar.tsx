import {
  DashboardOutlined,
  UserOutlined,
  AuditOutlined,
} from "@ant-design/icons";

export interface SidebarItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

export const sidebarItems: SidebarItem[] = [
  {
    key: "1",
    label: "Dashboard",
    icon: <DashboardOutlined />,
    href: "/",
  },
  {
    key: "2",
    label: "Patients",
    icon: <UserOutlined />,
    href: "/patients",
  },
  {
    key: "3",
    label: "Visits",
    icon: <AuditOutlined />,
    href: "/visits",
  },
];
