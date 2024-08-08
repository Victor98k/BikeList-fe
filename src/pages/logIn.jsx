import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import apiKit from "../utils/ApiKit";
import localStorageKit from "../utils/LocalStorageKit";
import { useNavigate } from "react-router-dom";
import styles from "../styles/login.module.css";

function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    apiKit
      .post("http://localhost:8080/auth/login", values)
      // .post("https://storystream-fe.onrender.com/auth/login", values)
      .then((response) => {
        const { tokens, user } = response.data;
        if (!tokens || !tokens.access) {
          throw new Error("Access token not received");
        }
        localStorageKit.setTokenInStorage(tokens);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("username", user.username);
        navigate("/home");
      })
      .catch((error) => {
        console.error("Login error:", error);
        const errorMessage =
          error.response?.data?.message ||
          "Failed to log in. Please check your credentials and try again.";
        message.error(errorMessage);
      });
  };

  const handleRegisterClick = () => {
    navigate("/signup");
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.form}>
        <h1 className={styles.formTitle}>Welcome 2 BikeList</h1>
        <Form
          form={form}
          onFinish={handleSubmit}
          id="login-form"
          layout="vertical"
        >
          <Form.Item
            className={styles.formItem}
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input className={styles.input} placeholder="Email" />
          </Form.Item>
          <Form.Item
            className={styles.formItem}
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password className={styles.input} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button
              className={styles.buttonSubmit}
              onClick={handleRegisterClick}
            >
              Register
            </Button>
            <Button className={styles.btn} type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Login;
