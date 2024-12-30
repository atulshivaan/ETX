import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import Spinner from "../component/spinner/Spinner";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submitHandler = async (values) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/login", values);
      
      // Store only necessary user data
      const userData = {
        id: data.id,
        name: data.name,
        email: data.email,
        token: data.token, // Example if token is returned
      };
      localStorage.setItem("user", JSON.stringify(userData));

      message.success("Login Successfully");
      setLoading(false);
      navigate("/"); // Redirect to home page or dashboard
    } catch (error) {
      setLoading(false);
      message.error(error.response?.data?.message || "Invalid username or password");
    }
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-center vh-100 bg-light">
      {loading && <Spinner />}
      <div
        className="p-4 rounded shadow-sm bg-white"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center mb-4">Login</h2>
        <Form layout="vertical" onFinish={submitHandler}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input type="email" placeholder="Enter your email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input type="password" placeholder="Enter your password" />
          </Form.Item>
          <div className="d-flex justify-content-between align-items-center">
            <Link to="/userregister" className="text-primary">
              Not registered? Register here
            </Link>
            <button className="btn btn-primary" type="submit">
              Login
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
