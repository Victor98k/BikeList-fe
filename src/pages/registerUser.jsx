import React from "react";
import { Form, Input, Button } from "antd";
import apiKit from "../utils/ApiKit";
import localStorageKit from "../utils/LocalStorageKit";
import { useNavigate } from "react-router-dom";
import styles from "../styles/registerUser.module.css";

const Register = () => {
  const navigate = useNavigate();
  const onFinish = (values) => {
    console.log("Form Values:", values);

    const payload = {
      ...values,
      admin: false,
    };

    apiKit
      // why no work?
      .post("http://localhost:8080/auth/register", JSON.stringify(payload), {
        // .post("https://storystream-fe.onrender.com", JSON.stringify(payload), {
        headers: {
          "Content-Type": "application/json",
        },
      })

      .then((response) => {
        const token = response.data;
        localStorageKit.setTokenInStorage(token);
        navigate("/");
      })

      .catch((error) => {
        console.log("Sending payload:", JSON.stringify(payload));
        console.error("Error in registering user: ", error.response);
        const errors = error.response.data.errors;
        console.error("Server-side errors:", errors);

        const message = errors
          ? Object.values(errors).join(", ")
          : "Something went wrong";
        console.warn("Error message: ", message);
      });
  };

  return (
    <div className={styles.registerContainer}>
      <Form
        name="registerForm"
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
        className={styles.formContainer}
      >
        <Form.Item>
          <h1>Story Stream</h1>
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Please input your Email!",
            },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              min: 8,
              message: "Please input your Password with minimum 8 characters!",
            },
          ]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[{ required: true, message: "Please input your First Name!" }]}
        >
          <Input placeholder="First name" />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true, message: "Please input your Last Name!" }]}
        >
          <Input placeholder="Last name" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
