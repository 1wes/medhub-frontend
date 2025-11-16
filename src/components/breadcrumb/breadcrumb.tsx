import { Breadcrumb } from "antd";
import React from "react";
import { useLocation } from "react-router-dom";

const MhBreadcrumb: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const paths = pathname.split("/").filter(Boolean);

  // Capitalize first letter
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);
  const breadcrumbItems = [
    {
      title: "Home",
      href: "/",
    },
    ...paths.map((path, index) => ({
      title: capitalize(path),
      href: "/" + paths.slice(0, index + 1).join("/"),
    })),
  ];
  return (
    <Breadcrumb
      style={{
        margin: "16px 0",
        fontFamily: "var(--primary-font-family)",
        fontSize: "12px",
        fontWeight: "bold",
      }}
      items={breadcrumbItems}
      separator=">"
    />
  );
};
export default MhBreadcrumb;
