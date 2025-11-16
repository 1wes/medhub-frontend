import React from "react";
import { Table, Button, Row, Col, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import "./table.css";
import Title from "antd/es/typography/Title";
import { useNavigate } from "react-router-dom";

export interface AppTableProps<T> {
  title?: string;
  subTitle?: string;
  columns: ColumnsType<T>;
  data?: T[];
  pageSize?: number;
  total?: number;
  loading?: boolean;
  onView?: (record: T) => void;
  addNewPath?: string;
  createLabel?: string;
  onFetchData?: (page: number, pageSize: number, search?: string) => void;
}

function MhTable<T extends { key: React.Key }>({
  title,
  subTitle,
  columns,
  data,
  pageSize = 10,
  onView,
  addNewPath,
  createLabel,
  total,
  loading,
  onFetchData,
}: AppTableProps<T>) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState("");

  const navigate = useNavigate();
  const enhancedColumns: ColumnsType<T> = onView
    ? [
        ...columns,
        {
          title: "Actions",
          key: "action",
          render: (_, record) => (
            <Button
              style={{ fontFamily: "var(--primary-font-family)" }}
              type="primary"
              onClick={() => onView(record)}
            >
              View
            </Button>
          ),
        },
      ]
    : columns;

  return (
    <>
      {title && (
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 16 }}
        >
          <Col>
            <Title level={4} style={{ margin: 0 }}>
              {title}
            </Title>
            {subTitle && (
              <Title
                level={5}
                style={{ marginBottom: 16, fontSize: "12px", color: "grey" }}
              >
                {subTitle}
              </Title>
            )}
          </Col>
          {addNewPath && (
            <Col>
              <Button
                type="primary"
                style={{
                  fontFamily: "var(--primary-font-family)",
                  fontWeight: "500",
                }}
                onClick={() => navigate(addNewPath)}
              >
                {`Add ${createLabel}`}
              </Button>
            </Col>
          )}
        </Row>
      )}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Input.Search
            placeholder="Search by Name or ID"
            allowClear
            style={{ width: 250, marginRight: 8 }}
            onSearch={(value) => {
              setCurrentPage(1);
              setSearchTerm(value);
              if (onFetchData) onFetchData(1, pageSize, value);
            }}
          />
        </Col>
      </Row>

      <Table
        className="custom-table"
        columns={enhancedColumns}
        dataSource={data}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
        }}
        rowKey="key"
        bordered
        onChange={(pagination) => {
          setCurrentPage(pagination.current || 1);
          if (onFetchData) {
            onFetchData(
              pagination.current || 1,
              pagination.pageSize || 10,
              searchTerm
            );
          }
        }}
      />
    </>
  );
}

export default MhTable;
