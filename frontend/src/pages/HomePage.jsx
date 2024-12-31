import axios from "axios";
import Layout from "../component/layout/Layout";
import { useState, useEffect } from "react";
import { Button, Form, Input, Modal, DatePicker, Select, message, Table } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Spinner from "../component/spinner/Spinner";
import moment from "moment";

const { Option } = Select;
const { RangePicker } = DatePicker;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransaction, setAllTransaction] = useState([]);
  const [frequency, setFrequency] = useState("7");
  const [selectedDate, setSelectedDate] = useState([]);
  const [type, setType] = useState("all");
  const [editable, setEditable] = useState(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Actions",
      render: (text, record) => (
        <div>
          <EditOutlined
            onClick={() => {
              setEditable(record);
              setShowModal(true);
            }}
          />
          <DeleteOutlined onClick={() => handleDelete(record._id)} />
        </div>
      ),
    },
  ];

  useEffect(() => {
    const getAllTransaction = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) throw new Error("User not logged in");

        const res = await axios.post("/api/auth/gettransaction", {
          userId: user.id,
          frequency,
          selectedDate,
          type,
        });
        setAllTransaction(res.data.transactions);
      } catch (error) {
        message.error(error.response?.data?.message || "Failed to fetch transactions");
      }
    };
    getAllTransaction();
  }, [frequency, selectedDate, type]);

  useEffect(() => {
    if (editable) {
      form.setFieldsValue({
        ...editable,
        date: editable.date ? moment(editable.date) : null,
      });
    } else {
      form.resetFields();
    }
  }, [editable, form]);

  const handleDelete = async (transactionId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        throw new Error("User not logged in");
      }

      // Show confirmation before deleting
      const confirmed = window.confirm("Are you sure you want to delete this transaction?");
      if (!confirmed) return;

      setLoading(true);

      // Send the DELETE request
      await axios.delete("/api/auth/deleteTransaction", {
        data: { transactionId },  // Pass transactionId in the request body
      });

      // Refresh the list after deletion
      const res = await axios.post("/api/auth/gettransaction", {
        userId: user.id,
        frequency,
        selectedDate,
        type,
      });
      setAllTransaction(res.data.transactions);

      message.success("Transaction deleted successfully");
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to delete transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) throw new Error("User not logged in");

      setLoading(true);
      if (editable) {
        await axios.patch("/api/auth/editTransaction", {
          transactionId: editable._id,
          payload: { ...values, userId: user.id },
        });
        message.success("Transaction updated successfully");
      } else {
        await axios.post("/api/auth/addtransaction", { ...values, userId: user.id });
        message.success("Transaction added successfully");
      }

      form.resetFields();
      setShowModal(false);
      setEditable(null);
      // Refresh transactions
      const res = await axios.post("/api/auth/gettransaction", {
        userId: user.id,
        frequency,
        selectedDate,
        type,
      });
      setAllTransaction(res.data.transactions);
    } catch (error) {
      message.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {loading && <Spinner />}
      <div className="filters d-flex justify-content-between align-items-center mb-4">
        <div className="filter-container" style={{ width: "200px" }}>
          <h6>Select Frequency</h6>
          <Select
            placeholder="Select"
            value={frequency}
            style={{ width: "100%" }}
            onChange={(values) => setFrequency(values)}
          >
            <Option value="7">Last 1 week</Option>
            <Option value="30">Last 1 month</Option>
            <Option value="365">Last 1 year</Option>
            <Option value="custom">Custom</Option>
          </Select>
          {frequency === "custom" && <RangePicker value={selectedDate} onChange={(values) => setSelectedDate(values)} />}
        </div>
        <div className="filter-container" style={{ width: "200px" }}>
          <h6>Select Type</h6>
          <Select
            placeholder="Select"
            value={type}
            style={{ width: "100%" }}
            onChange={(values) => setType(values)}
          >
            <Option value="all">All</Option>
            <Option value="income">Income</Option>
            <Option value="expense">Expense</Option>
          </Select>
        </div>
        <div>
          <button className="btn" onClick={() => setShowModal(true)}>
            Add New
          </button>
        </div>
      </div>
      <div className="content">
        <Table columns={columns} dataSource={allTransaction} />
      </div>
      <Modal
        title={editable ? "Edit Transaction" : "Add Transaction"}
        open={showModal}
        onCancel={() => {
          setShowModal(false);
          setEditable(null); // Clear editable state when modal is closed
        }}
        footer={null}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          initialValues={{
            ...editable,
            date: editable?.date ? moment(editable.date) : null,
          }}
        >
          <Form.Item label="Amount" name="amount" rules={[{ required: true, message: "Please enter the amount!" }]}>
            <Input type="number" placeholder="Enter amount" />
          </Form.Item>

          <Form.Item label="Type" name="type" rules={[{ required: true, message: "Please select a type!" }]}>
            <Select>
              <Option value="income">Income</Option>
              <Option value="expense">Expense</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Category" name="category" rules={[{ required: true, message: "Please select a category!" }]}>
            <Select placeholder="Select category">
              <Option value="Food">Food</Option>
              <Option value="Travel">Travel</Option>
              <Option value="Shopping">Shopping</Option>
              <Option value="Bills">Bills</Option>
              <Option value="Salary">Salary</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Reference" name="reference">
            <Input placeholder="Enter reference (optional)" />
          </Form.Item>

          <Form.Item label="Description" name="description" rules={[{ required: true, message: "Please enter a description!" }]}>
            <Input.TextArea rows={3} placeholder="Enter description" />
          </Form.Item>

          <Form.Item label="Date" name="date" rules={[{ required: true, message: "Please select a date!" }]}>
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>

          <div className="modal-footer">
            <Button type="default" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;
