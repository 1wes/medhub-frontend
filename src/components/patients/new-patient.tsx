import React, { useState } from "react";
import { Row, Col, Form, Input, Button, DatePicker, Select } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import ToastNotification from "../toast/toast";
import type { NotificationType } from "../toast/toast";
import moment from "moment";
import MhFormContainer from "../forms/form-container/form-container";
import axiosInstance from "../../utils/axios";

const { Option } = Select;

type FormData = {
  name: string;
  idNumber: string;
  date_of_birth: moment.Moment | null;
  gender: string;
  contact: string;
};

interface Toast {
  type: NotificationType;
  open: boolean;
  message: string;
  description: string;
}

const MhAddPatientForm: React.FC = () => {
  const [toast, setToast] = useState<Toast>({
    type: "success",
    open: false,
    message: "",
    description: "",
  });
  const navigate = useNavigate();

  const schema = yup.object().shape({
    name: yup.string().required("Full name is required"),
    idNumber: yup
      .string()
      .matches(
        /^[A-Za-z0-9]+$/,
        "ID number can only contain letters and numbers"
      )
      .required("ID number is required"),
    date_of_birth: yup
      .mixed<moment.Moment>()
      .nullable()
      .required("Date of birth is required"),
    gender: yup.string().required("Gender is required"),
    contact: yup
      .string()
      .matches(/^[0-9+()-\s]*$/, "Invalid contact number")
      .required("Contact is required"),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      name: "",
      idNumber: "",
      date_of_birth: null,
      gender: "",
      contact: "",
    },
  });

  const onSubmit = (data: FormData) => {
    const formattedData = {
      ...data,
      date_of_birth: data.date_of_birth
        ? data.date_of_birth.format("YYYY-MM-DD")
        : null,
    };

    axiosInstance
      .post("/api/patients/new-patient", formattedData)
      .then((res) => {
        setToast((prev) => ({ ...prev, open: false }));
        setTimeout(() => {
          setToast({
            type: "success",
            message: "User Registration",
            description: res?.data?.message,
            open: true,
          });
        }, 10);
        setTimeout(() => navigate("/patients"), 2000);
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
  };

  return (
    <MhFormContainer
      title="Add a Patient"
      subTitle="Register a new patient to provide them care"
    >
      <Form
        layout="vertical"
        onFinish={handleSubmit(onSubmit)}
        style={{ width: "100%" }}
      >
        <Row gutter={16}>
          {/* Full Name */}
          <Col xs={24} sm={12}>
            <Form.Item
              label="Full Name"
              validateStatus={errors.name ? "error" : ""}
              help={errors.name?.message}
            >
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    {...field}
                    className="custom-input"
                    placeholder="Full Name"
                  />
                )}
              />
            </Form.Item>
          </Col>

          {/* ID Number */}
          <Col xs={24} sm={12}>
            <Form.Item
              label="ID Number"
              validateStatus={errors.idNumber ? "error" : ""}
              help={errors.idNumber?.message}
            >
              <Controller
                name="idNumber"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    {...field}
                    className="custom-input"
                    placeholder="ID Number"
                  />
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          {/* Date of Birth */}
          <Col xs={24} sm={12}>
            <Form.Item
              label="Date of Birth"
              validateStatus={errors.date_of_birth ? "error" : ""}
              help={errors.date_of_birth?.message}
            >
              <Controller
                name="date_of_birth"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    className="custom-input"
                    {...field}
                    style={{ width: "100%" }}
                    placeholder="Select date of birth"
                    disabledDate={(current) =>
                      current && current > moment().endOf("day")
                    }
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                  />
                )}
              />
            </Form.Item>
          </Col>

          {/* Gender */}
          <Col xs={24} sm={12}>
            <Form.Item
              label="Gender"
              validateStatus={errors.gender ? "error" : ""}
              help={errors.gender?.message}
            >
              <Controller
                name="gender"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    {...field}
                    className="custom-input"
                    placeholder="Select Gender"
                  >
                    <Option value="Male">Male</Option>
                    <Option value="Female">Female</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Contact */}
        <Row gutter={16}>
          <Col xs={24} sm={24}>
            <Form.Item
              label="Contact"
              validateStatus={errors.contact ? "error" : ""}
              help={errors.contact?.message}
            >
              <Controller
                name="contact"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    {...field}
                    className="custom-input"
                    placeholder="Phone or email"
                  />
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row style={{ marginTop: 16 }}>
          <Col xs={24} style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="primary"
              className="custom-button"
              htmlType="submit"
              style={{ minWidth: 120 }}
            >
              Add Patient
            </Button>
          </Col>
        </Row>

        <ToastNotification
          type={toast.type}
          open={toast.open}
          message={toast.message}
          description={toast.description}
        />
      </Form>
    </MhFormContainer>
  );
};

export default MhAddPatientForm;
