import { Row, Col, Flex, Form, Input, Button, Divider } from "antd";
import Title from "antd/es/typography/Title";
import "../../../App.css";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router-dom";
import "../login/login.css";
import axiosInstance from "../../../utils/axios";
import { useState } from "react";
import ToastNotification from "../../toast/toast";
import type { NotificationType } from "../../toast/toast";
import { useNavigate } from "react-router-dom";
import Logo from "../../logo/logo";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  repeatPassword: string;
};

interface Toast {
  type: NotificationType;
  open: boolean;
  message: string;
  description: string;
}

const RegisterComponent: React.FC = () => {
  const [toast, setToast] = useState<Toast>({
    type: "success",
    open: false,
    message: "",
    description: "",
  });
  const navigate = useNavigate();

  const schema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup
      .string()
      .email("Wrong email format")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    repeatPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Please repeat your password"),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    axiosInstance
      .post("/api/user/register", data)
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

        setTimeout(() => {
          navigate("/login");
        }, 4000);
      })
      .catch((err) => {
        const msg = err.response?.data?.message;
        setToast((prev) => ({ ...prev, open: false }));
        setTimeout(() => {
          setToast({
            type: "error",
            message: "User Registration",
            description: msg,
            open: true,
          });
        }, 10);
      });
  };

  return (
    <Row className="login">
      <Col
        span={12}
        className="main-copy"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          gap: 0,
          padding: "5em",
        }}
      >
        <Title style={{ color: "var(--tertiary-color)", lineHeight: 0.1 }}>
          Healthcare Streamlined
        </Title>
        <Title
          level={5}
          style={{ color: "var(--tertiary-color)", lineHeight: 0.1 }}
        >
          Give your patients the care they deserve, with minimal hassle.
        </Title>
      </Col>

      <Col span={12} className="form-fields">
        <Col style={{ width: "60%" }}>
          <Logo />

          <Flex>
            <Title level={1} style={{ color: "var(--primary-color)" }}>
              Create Account
            </Title>
          </Flex>

          <Flex>
            <Title level={5} style={{ color: "var(--secondary-color)" }}>
              Join Medhub to serve your patients better and efficiently
            </Title>
          </Flex>

          <Flex vertical style={{ width: "100%" }}>
            <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
              <Form.Item
                label="First Name"
                validateStatus={errors.firstName ? "error" : ""}
                help={errors.firstName?.message}
              >
                <Controller
                  name="firstName"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="First Name"
                      className="custom-input"
                    />
                  )}
                />
              </Form.Item>

              <Form.Item
                label="Last Name"
                validateStatus={errors.lastName ? "error" : ""}
                help={errors.lastName?.message}
              >
                <Controller
                  name="lastName"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Last Name"
                      className="custom-input"
                    />
                  )}
                />
              </Form.Item>

              <Form.Item
                label="Email"
                validateStatus={errors.email ? "error" : ""}
                help={errors.email?.message}
              >
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="youremail@domain.com"
                      className="custom-input"
                    />
                  )}
                />
              </Form.Item>

              <Form.Item
                label="Password"
                validateStatus={errors.password ? "error" : ""}
                help={errors.password?.message}
              >
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input.Password {...field} className="custom-input" />
                  )}
                />
              </Form.Item>

              <Form.Item
                label="Repeat Password"
                validateStatus={errors.repeatPassword ? "error" : ""}
                help={errors.repeatPassword?.message}
              >
                <Controller
                  name="repeatPassword"
                  control={control}
                  render={({ field }) => (
                    <Input.Password {...field} className="custom-input" />
                  )}
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                block
                className="custom-button"
              >
                Register
              </Button>

              <Divider />

              <Title level={5} style={{ fontSize: "12px" }}>
                <span style={{ color: "grey" }}>Already have an account?</span>{" "}
                <span>
                  <Link to={"/login"}>Login here.</Link>
                </span>
              </Title>
            </Form>
          </Flex>
        </Col>
      </Col>
      <ToastNotification
        type={toast.type}
        open={toast.open}
        message={toast.message}
        description={toast.description}
      />
    </Row>
  );
};

export default RegisterComponent;
