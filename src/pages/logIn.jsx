import React from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { Link } from "react-router-dom";

import Styles from "../styles/login.module.css";
const onFinish = (values) => {
  console.log("Success:", values);
};

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const Login = () => (
  <div className={Styles.loginContainer}>
    <div className={Styles.formContainer}>
      <h1 className={Styles.formTitle}>Login</h1>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          className={Styles.formItem}
          label="Username"
          name="username"
          // rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          className={Styles.formItem}
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          className={Styles.formItem}
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Link to="/signup">Sign up</Link>
        </Form.Item>
        <Form.Item
          className={Styles.formItem}
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox className={Styles.checkbox}>Remember me</Checkbox>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            <Link to="/home">Log in </Link>
          </Button>
        </Form.Item>
      </Form>
    </div>
  </div>
);

export default Login;
