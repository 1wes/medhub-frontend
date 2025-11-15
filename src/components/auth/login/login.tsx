import { Row, Col, Flex, Form, Input, Button, Divider } from "antd";
import "./login.css";
import Title from "antd/es/typography/Title";
import "../../../App.css";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router-dom";
import ToastNotification from "../../toast/toast";
import type { NotificationType } from "../../toast/toast";
import { useState } from "react";
import axiosInstance from "../../../utils/axios";
import { useNavigate } from "react-router-dom";
import Logo from "../../logo/logo";
import { useAuthRedirect } from "../../../hooks/useAuth";

type FormData = {
  email: string;
  password: string;
};

interface Toast {
  type: NotificationType;
  open: boolean;
  message: string;
  description: string;
}

const LoginComponent: React.FC = () => {
  useAuthRedirect();
  const [toast, setToast] = useState<Toast>({
    type: "success",
    open: false,
    message: "",
    description: "",
  });
  const navigate = useNavigate();
  const schema = yup.object().shape({
    email: yup
      .string()
      .email("Wrong email format")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
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
      .post("/api/user/login", data)
      .then((res) => {
        setToast((prev) => ({ ...prev, open: false }));
        setTimeout(() => {
          setToast({
            type: "success",
            message: "Login ",
            description: res?.data?.message,
            open: true,
          });
        }, 10);

        setTimeout(() => {
          navigate("/");
        }, 2000);
      })
      .catch((err) => {
        const msg = err.response?.data?.message;
        setToast((prev) => ({ ...prev, open: false }));
        setTimeout(() => {
          setToast({
            type: "error",
            message: "Login Failed",
            description: msg,
            open: true,
          });
        }, 10);
      });
  };
  return (
    <>
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
          <Title
            style={{
              color: "var(--tertiary-color)",
              lineHeight: 0.1,
            }}
          >
            Healthcare Streamlined
          </Title>
          <Title
            level={5}
            style={{
              color: "var(--tertiary-color)",
              lineHeight: 0.1,
            }}
          >
            Give your patients the care they deserve, with minimal hassle.
          </Title>
        </Col>
        <Col span={12} className="form-fields">
          <Col style={{ width: "60%" }}>
            <Logo />
            <Flex>
              <Title
                level={1}
                style={{
                  color: "var(--primary-color)",
                }}
              >
                Welcome Back
              </Title>
            </Flex>
            <Flex>
              <Title
                style={{
                  color: "var(--secondary-color)",
                }}
                level={5}
              >
                Serve your patients better and efficiently
              </Title>
            </Flex>
            <Flex vertical style={{ width: "100%" }}>
              <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                <Form.Item
                  label="Email"
                  validateStatus={errors.email ? "error" : ""}
                  help={errors.email?.message}
                  style={{
                    color: "var(--primary-color)",
                    width: "100%",
                    fontFamily: "var(--primary-font-family)",
                  }}
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
                  ></Controller>
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
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  className="custom-button"
                >
                  Log in
                </Button>
                <Divider />
                <Title level={5} style={{ fontSize: "12px" }}>
                  <span style={{ color: "grey" }}>Dont have an account?</span>{" "}
                  <span>
                    <Link to={"/register"}>Register here.</Link>
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
    </>
  );
};
export default LoginComponent;
