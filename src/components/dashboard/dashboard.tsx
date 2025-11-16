import MhFormContainer from "../forms/form-container/form-container";
import { Row, Col, Card, Table, Statistic, Spin } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axiosInstance from "../../utils/axios";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

interface RecentVisit {
  patientId: string;
  name: string;
  date: string;
  reason: string;
}

interface VisitsPerWeek {
  week: string;
  visits: number;
}

interface DashboardData {
  totalPatients: number;
  totalVisits: number;
  recentVisits: RecentVisit[];
  visitsPerWeek: VisitsPerWeek[];
}

const MhDashboards: React.FC = () => {
  const [data, setData] = useState<DashboardData>({
    totalPatients: 0,
    totalVisits: 0,
    recentVisits: [],
    visitsPerWeek: [],
  });
  const [loading, setLoading] = useState(true);

  const columns = [
    { title: "Patient Name", dataIndex: "name", key: "name" },
    {
      title: "Date",
      dataIndex: "visit_date",
      key: "date",
      render: (text: string) => dayjs(text).format("DD MMM YYYY"),
    },
    { title: "Diagnosis", dataIndex: "diagnosis", key: "diagnosis" },
  ];

  useEffect(() => {
    axiosInstance.get("/api/dashboards/").then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, []);

  if (loading)
    return (
      <Spin
        tip="Loading dashboard..."
        style={{ width: "100%", marginTop: 50 }}
      />
    );

  return (
    <MhFormContainer
      title="Dashboards"
      subTitle="Find all the meaningful metrics in one place"
    >
      <div>
        {/* Summary Cards */}
        <Row gutter={16}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Patients"
                value={data.totalPatients}
                valueStyle={{ color: "var(--primary-color)" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Visits"
                value={data.totalVisits}
                valueStyle={{ color: "var(--secondary-color)" }}
              />
            </Card>
          </Col>
          {/* Add more cards if needed */}
        </Row>

        <Row gutter={16} style={{ marginTop: 24 }}>
          {/* Recent Visits Table */}
          <Col xs={24} md={12}>
            <Card title="Recent Visits">
              <Table
                style={{ fontFamily: "var(--primary-font-family)" }}
                dataSource={data.recentVisits}
                columns={columns}
                rowKey="patientId"
                pagination={false}
                scroll={{ y: 300 }}
                bordered
              />
            </Card>
          </Col>

          {/* Visits Per Week Chart */}
          <Col xs={24} md={12}>
            <Card title="Visits Per Week">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={data.visitsPerWeek}
                  margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="visits" fill="var(--primary-color)" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      </div>
    </MhFormContainer>
  );
};

export default MhDashboards;
