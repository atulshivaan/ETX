import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "../component/spinner/Spinner";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submitHandler = async (values) => {
    try {
      setLoading(true);
      await axios.post("/register", values); // No need to include the full URL
      message.success("Registered Successfully");
      setLoading(false);
      navigate("/userlogin");
    } catch (error) {
      setLoading(false);
      message.error(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  //prevent for loginuser
  useEffect(()=>{
    if(localStorage.getItem("user")){
        navigate("/");
    }
  },[navigate]);

  return (
    <div className="register-page d-flex align-items-center justify-content-center vh-100 bg-light">
      {loading && <Spinner />}
      <div
        className="p-4 rounded shadow-sm bg-white"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center mb-4">Register</h2>
        <Form layout="vertical" onFinish={submitHandler}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name!" }]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>
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
            <Link to="/userlogin" className="text-primary">
              Already registered? Login here
            </Link>
            <button className="btn btn-primary" type="submit">
              Register
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;
