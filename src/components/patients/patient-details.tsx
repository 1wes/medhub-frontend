import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Tabs,
  Table,
  Spin,
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
  Select,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
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

interface Patient {
  id: string;
  name: string;
  gender: string;
  date_of_birth: string;
  phone?: string;
  email?: string;
  id_number?: string;
  contact?: string;
  address?: string;
  visits?: Visit[];
}

interface Visit {
  id: string;
  date: string;
  reason: string;
  doctor: string;
}

const PatientDetailsPage: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [toast, setToast] = useState<Toast>({
    type: "success",
    open: false,
    message: "",
    description: "",
  });
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const [editForm] = Form.useForm();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/patients/${uuid}`);
        setPatient(response.data);
      } catch (error: any) {
        const msg = error.response?.data?.message;
        setToast((prev) => ({ ...prev, open: false }));
        setTimeout(() => {
          setToast({
            type: "error",
            message: "Failed",
            description: msg,
            open: true,
          });
        }, 10);
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [uuid]);

  const visitsColumns = [
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Diagnosis", dataIndex: "diagnosis", key: "diagnosis" },
    {
      title: "Medication",
      dataIndex: "prescribed_medications",
      key: "prescribed_medications",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Button
          type="primary"
          onClick={() => navigate(`/visits/${record.uuid}`)}
        >
          View visit
        </Button>
      ),
    },
  ];

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  const handleAddVisit = async (values: any) => {
    try {
      const visitData = {
        date: values.date.format("YYYY-MM-DD"),
        diagnosis: values.diagnosis,
        prescribed_medications: values.prescribed_medications,
        notes: values.notes,
      };

      axiosInstance
        .post(`/api/patients/${uuid}/visits`, visitData)
        .then((res) => {
          setToast((prev) => ({ ...prev, open: false }));
          setTimeout(() => {
            setToast({
              type: "success",
              message: "Patient visit",
              description: res?.data?.message,
              open: true,
            });
          }, 10);
          form.resetFields();
          setIsModalVisible(false);

          setPatient((prev) =>
            prev
              ? { ...prev, visits: [...(prev.visits || []), res.data] }
              : prev
          );
          navigate(0);
        })
        .catch((err) => {
          const msg = err.response?.data?.message;
          setToast((prev) => ({ ...prev, open: false }));
          setTimeout(() => {
            setToast({
              type: "error",
              message: "Failed",
              description: msg,
              open: true,
            });
          }, 10);
        });
    } catch (error: any) {
      setToast((prev) => ({ ...prev, open: false }));
      setTimeout(() => {
        setToast({
          type: "success",
          message: "Patient visit",
          description: error?.response?.data?.message,
          open: true,
        });
      }, 10);
    }
  };

  if (loading)
    return (
      <Spin
        tip="Loading patient details..."
        style={{ display: "block", margin: "50px auto" }}
      />
    );

  if (!patient) return <p>No patient data found.</p>;

  const handleDelete = () => {
    setIsDeleteModalVisible(true);
  };

  return (
    <Card style={{ width: "100%", padding: 20 }}>
      {/* Patient Info */}
      <Row gutter={24} align="middle">
        <Col>
          <Avatar size={100} icon={<UserOutlined />} />
        </Col>
        <Col flex="auto">
          <Space direction="vertical" size="small">
            <Title level={3}>{patient.name}</Title>
            <Space>
              <Text strong>Gender: </Text>
              <Text>{patient.gender}</Text>
            </Space>
            <Space>
              <Text strong>Date of Birth: </Text>
              <Text>{patient.date_of_birth}</Text>
            </Space>
            {patient.phone && (
              <Text>
                <PhoneOutlined /> {patient.phone}
              </Text>
            )}
            {patient.email && (
              <Text>
                <MailOutlined /> {patient.email}
              </Text>
            )}
            {patient.address && (
              <Text>
                <HomeOutlined /> {patient.address}
              </Text>
            )}
          </Space>
          <Row justify="end" gutter={8}>
            <Col>
              <Button
                type="default"
                onClick={() => {
                  editForm.setFieldsValue({
                    name: patient.name,
                    gender: patient.gender,
                    date_of_birth: patient.date_of_birth
                      ? moment(patient.date_of_birth)
                      : null,
                    contact: patient.contact,
                    email: patient.email,
                    idNumber: patient.id_number,
                  });
                  setIsEditModalVisible(true);
                }}
              >
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

      {/* Visits Tab */}
      <Tabs defaultActiveKey="1" style={{ marginTop: 30 }}>
        <TabPane tab="Visits" key="1">
          {/* Header with Add Visit Button */}
          <Row justify="end" style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              className="custom-button"
              style={{ padding: "0 20px" }}
              icon={<PlusOutlined />}
              onClick={showModal}
            >
              Add Visit
            </Button>
          </Row>

          {/* Visits Table */}
          <Table
            columns={visitsColumns}
            dataSource={patient.visits || []}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            bordered
          />
        </TabPane>
      </Tabs>

      {/* Add Visit Modal */}
      <Modal
        title="Add Visit"
        open={isModalVisible}
        onCancel={handleCancel}
        style={{ fontFamily: "var(--parimary-font-family)" }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddVisit}>
          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Please select visit date" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              disabledDate={(current) => {
                return current && current > moment().endOf("day");
              }}
            />
          </Form.Item>

          <Form.Item
            label="Diagnosis"
            name="diagnosis"
            rules={[{ required: true, message: "Please enter diagnosis" }]}
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

          <Form.Item label="Notes" name="notes" rules={[{ required: false }]}>
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item>
            <Space style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Add Visit
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      {/* Edit patient */}
      <Modal
        title="Edit Patient"
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
                ...values,
                date_of_birth: values.date_of_birth
                  ? values.date_of_birth.format("YYYY-MM-DD")
                  : null,
              };

              const res = await axiosInstance.put(
                `/api/patients/${uuid}`,
                payload
              );
              setPatient(res.data);
              setToast({
                type: "success",
                open: true,
                message: "Patient updated",
                description: "Patient details updated successfully",
              });
              setIsEditModalVisible(false);
              navigate(0);
            } catch (err: any) {
              const msg = err.response?.data?.message;
              setToast({
                type: "error",
                open: true,
                message: "Failed",
                description: msg,
              });
            }
          }}
        >
          <Form.Item
            label="Full Name"
            name="name"
            rules={[
              { required: true, message: "Full Name is required" },
              { max: 255, message: "Full Name cannot exceed 255 characters" },
            ]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            label="ID Number"
            name="idNumber"
            rules={[
              { required: true, message: "ID Number is required" },
              { max: 50, message: "ID Number cannot exceed 50 characters" },
            ]}
          >
            <Input placeholder="Enter ID number" />
          </Form.Item>

          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: "Gender is required" }]}
          >
            <Select placeholder="Select gender">
              <Select.Option value="Male">Male</Select.Option>
              <Select.Option value="Female">Female</Select.Option>
              <Select.Option value="Other">Other</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Date of Birth"
            name="date_of_birth"
            rules={[
              { required: true, message: "Date of Birth is required" },
              {
                validator: (_, value) =>
                  value && value.isAfter(moment())
                    ? Promise.reject(
                        new Error("Date of Birth cannot be in the future")
                      )
                    : Promise.resolve(),
              },
            ]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Contact"
            name="contact"
            rules={[
              { max: 100, message: "Contact cannot exceed 100 characters" },
              {
                pattern: /^[0-9+()-\s]*$/,
                message: "Contact must be a valid phone number",
              },
            ]}
          >
            <Input placeholder="Enter phone or contact number" />
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

      {/* Delete modal */}
      <Modal
        title="Delete Patient"
        open={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Yes"
        okType="danger"
        cancelText="No"
        onOk={async () => {
          try {
            await axiosInstance.delete(`/api/patients/${uuid}`);
            setToast((prev) => ({ ...prev, open: false }));
            setTimeout(() => {
              setToast({
                type: "success",
                open: true,
                message: "Delete patient",
                description: "The patient has been deleted",
              });
            }, 10);
            navigate("/patients");
          } catch (err: any) {
            const msg = err.response?.data?.message;
            setToast((prev) => ({ ...prev, open: false }));

            setTimeout(() => {
              setToast({
                type: "error",
                open: true,
                message: "Failed",
                description: msg || "Could not delete patient",
              });
            }, 10);
          }
        }}
      >
        <p>Are you sure you want to delete this patient?</p>
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

export default PatientDetailsPage;
