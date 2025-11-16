import React from "react";
import { Table, Button, Row, Col, Input, DatePicker, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import "./table.css";
import Title from "antd/es/typography/Title";
import { useNavigate } from "react-router-dom";
import { type Moment } from "moment";

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
  filterDateRange?: boolean;
  onFetchData?: (
    page: number,
    pageSize: number,
    search?: string,
    range?: [string, string]
  ) => void;
}

const { RangePicker } = DatePicker;

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
  filterDateRange,
}: AppTableProps<T>) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [dateRange, _setDateRange] = React.useState<[Moment, Moment] | null>(
    null
  );

  const showDataRange = filterDateRange ?? false;

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

  const formattedRange: [string, string] | undefined =
    dateRange?.[0] && dateRange?.[1]
      ? [dateRange[0].format("YYYY-MM-DD"), dateRange[1].format("YYYY-MM-DD")]
      : undefined;

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
        <Space style={{ display: "flex" }}>
          <Input.Search
            placeholder="Search by Name or ID"
            allowClear
            style={{ width: 250, marginRight: 8 }}
            onSearch={(value) => {
              setCurrentPage(1);
              setSearchTerm(value);
              if (onFetchData) onFetchData(1, pageSize, value, formattedRange);
            }}
          />
          {showDataRange && (
            <RangePicker
              onChange={(dates) => {
                setCurrentPage(1);
                const formattedRange: [string, string] | undefined =
                  dates?.[0] && dates?.[1]
                    ? [
                        dates[0].format("YYYY-MM-DD"),
                        dates[1].format("YYYY-MM-DD"),
                      ]
                    : undefined;

                if (onFetchData)
                  onFetchData(1, pageSize, searchTerm, formattedRange);
              }}
            />
          )}
        </Space>
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
              searchTerm,
              formattedRange
            );
          }
        }}
      />
    </>
  );
}

export default MhTable;
