import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Checkbox } from "antd";
import apiKit from "../utils/ApiKit";
import localStorageKit from "../utils/LocalStorageKit";
import styles from "../styles/login.module.css";

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const onFinish = (values) => {
    setError(null);
    const { email, password } = values;

    apiKit
      .post("/auth/login", {
        email,
        password,
      })
      .then((response) => {
        console.log(response); // Log the response
        if (!response.data) {
          throw new Error("No data received from server");
        }
        const { tokens, user } = response.data;
        if (!tokens || !user) {
          throw new Error("Incomplete data received from server");
        }
        localStorageKit.setTokenInStorage(tokens.access);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("username", user.username);
        navigate("/home");
      })
      .catch((error) => {
        console.error("Login error:", error); // Log the entire error
        const message =
          error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred";
        console.warn("Error logging in", message);
        setError(message);
      });
  };

  const handleRegisterClick = () => {
    navigate("/signup");
  };

  return (
    <div className={styles.loginContainer}>
      <Form
        name="loginForm"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        className={styles.formContainer}
      >
        <Form.Item>
          <h1>Story Stream</h1>
        </Form.Item>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your Email!" }]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        {error && <p>{error}</p>}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
          <Button type="link" onClick={handleRegisterClick}>
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Login;
