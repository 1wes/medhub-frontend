import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Avatar,
  Typography,
  Space,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Spin,
  Tabs,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import axiosInstance from "../../utils/axios";
import ToastNotification from "../toast/toast";
import type { NotificationType } from "../toast/toast";
import moment from "moment";

interface Toast {
  type: NotificationType;
  open: boolean;
  message: string;
  description: string;
}

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface Visit {
  id: string;
  uuid: string;
  visit_date: string;
  diagnosis: string;
  prescribed_medications: string;
  notes?: string;
  patient_id: string;
  patient_name: string;
  patient_id_number?: string;
}

const MhVisitDetails: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const [visit, setVisit] = useState<Visit | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [toast, setToast] = useState<Toast>({
    type: "success",
    open: false,
    message: "",
    description: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVisit = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/api/visits/${uuid}`);
        setVisit(res.data);
      } catch (err: any) {
        setToast({
          type: "error",
          open: true,
          message: "Failed to load visit",
          description: err.response?.data?.message || "Please try again",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchVisit();
  }, [uuid]);

  if (loading)
    return (
      <Spin
        tip="Loading visit details..."
        style={{ display: "block", margin: "50px auto" }}
      />
    );

  if (!visit) return <p>No visit data found.</p>;

  const handleEdit = () => {
    editForm.setFieldsValue({
      visit_date: moment(visit.visit_date),
      diagnosis: visit.diagnosis,
      prescribed_medications: visit.prescribed_medications,
      notes: visit.notes,
    });
    setIsEditModalVisible(true);
  };

  const handleDelete = () => {
    setIsDeleteModalVisible(true);
  };

  return (
    <Card style={{ width: "100%", padding: 20 }}>
      <Row gutter={24} align="middle">
        <Col>
          <Avatar size={100} icon={<UserOutlined />} />
        </Col>
        <Col flex="auto">
          <Space direction="vertical" size="small">
            <Title level={3}>{visit.patient_name}</Title>
            <Space>
              <Text strong>Visit Date: </Text>
              <Text>{moment(visit.visit_date).format("YYYY-MM-DD")}</Text>
            </Space>
          </Space>
          <Row justify="end" gutter={8}>
            <Col>
              <Button type="default" onClick={handleEdit}>
                Edit
              </Button>
            </Col>
            <Col>
              <Button danger onClick={handleDelete}>
                Delete
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Tabs for Visit Details */}
      <Tabs defaultActiveKey="1" style={{ marginTop: 24 }}>
        <TabPane
          tab="Visit Details"
          key="1"
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <Space size="middle">
            <Text strong>Diagnosis: </Text>
            <Text style={{ display: "block" }}>{visit.diagnosis}</Text>
          </Space>
          <Space>
            <Text strong>Prescribed Medications:</Text>
            <Text style={{ display: "block" }}>
              {visit.prescribed_medications}
            </Text>
          </Space>
          <Space>
            {visit.notes && (
              <>
                <Text strong>Notes:</Text>
                <Text style={{ display: "block" }}>{visit.notes}</Text>
              </>
            )}
          </Space>
        </TabPane>
      </Tabs>

      {/* Edit Visit Modal */}
      <Modal
        title="Edit Visit"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={async (values) => {
            try {
              const payload = {
                visit_date: values.visit_date.format("YYYY-MM-DD"),
                diagnosis: values.diagnosis,
                prescribed_medications: values.prescribed_medications,
                notes: values.notes,
              };
              const res = await axiosInstance.put(
                `/api/visits/${uuid}`,
                payload
              );
              setVisit(res.data);
              setToast({
                type: "success",
                open: true,
                message: "Visit updated",
                description: "Visit details updated successfully",
              });
              setIsEditModalVisible(false);
              navigate(0);
            } catch (err: any) {
              setToast({
                type: "error",
                open: true,
                message: "Failed",
                description:
                  err.response?.data?.message || "Could not update visit",
              });
            }
          }}
        >
          <Form.Item
            label="Visit Date"
            name="visit_date"
            rules={[
              { required: true, message: "Visit date is required" },
              {
                validator: (_, value) =>
                  value && value.isAfter(moment())
                    ? Promise.reject(
                        new Error("Visit date cannot be in the future")
                      )
                    : Promise.resolve(),
              },
            ]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Diagnosis"
            name="diagnosis"
            rules={[{ required: true, message: "Diagnosis is required" }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item
            label="Prescribed Medications"
            name="prescribed_medications"
            rules={[
              {
                required: true,
                message: "Please enter prescribed medications",
              },
            ]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item label="Notes" name="notes">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item>
            <Space style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={() => setIsEditModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Visit Modal */}
      <Modal
        title="Delete Visit"
        open={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Yes"
        okType="danger"
        cancelText="No"
        onOk={async () => {
          try {
            await axiosInstance.delete(`/api/visits/${uuid}`);
            setToast((prev) => ({ ...prev, open: false }));
            setTimeout(() => {
              setToast({
                type: "success",
                open: true,
                message: "Delete visit",
                description: "The visit has been deleted",
              });
            }, 10);
            navigate(`/patients/${visit?.patient_id}`);
          } catch (err: any) {
            const msg = err.response?.data?.message;
            setToast((prev) => ({ ...prev, open: false }));

            setTimeout(() => {
              setToast({
                type: "error",
                open: true,
                message: "Failed",
                description: msg || "Could not delete visit",
              });
            }, 10);
          }
        }}
      >
        <p>Are you sure you want to delete this visit?</p>
      </Modal>

      <ToastNotification
        type={toast.type}
        open={toast.open}
        message={toast.message}
        description={toast.description}
      />
    </Card>
  );
};

export default MhVisitDetails;
