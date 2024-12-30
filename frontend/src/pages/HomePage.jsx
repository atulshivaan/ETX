import axios from "axios";
import Layout from "../component/layout/Layout";
import { useState , useEffect } from "react";
import { Button, Form, Input, Modal, DatePicker, Select, message,  Table } from "antd";
import Spinner from "../component/spinner/Spinner";
import moment from "moment"


const { Option } = Select;
const { RangePicker } = DatePicker;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alltransaction,setAllTransaction]=useState([])
  const [frequency,setFrequency] = useState("7")
  const [selectedDate,setSelectedDate]=useState([])
  const [type,setType]=useState("all")
  const [form] = Form.useForm();

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render:(text)=><span>{moment(text).format("YYYY-MM-DD")}</span>
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
      title:"Actions"
    }
  ];


  
  

  //use effet
  useEffect(()=>{
//getAll transaction
const getAllTransaction = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      throw new Error("User not logged in or invalid user data");
    }

    console.log("Requesting transactions for:", user.id); // Debugging request payload

    const res = await axios.post("/gettransaction", { userId: user.id,frequency ,selectedDate,type});
    console.log("Server response:", res.data); // Debugging server response
    setAllTransaction(res.data.transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error.response?.data || error.message);
    message.error(error.response?.data?.message || "Fetch issue with transaction");
  }
};
getAllTransaction();
  },[frequency,selectedDate,type])

  // Form submission handler
  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log("User from localStorage:", user);
  
      // Update this line to check for 'id' instead of '_id'
      if (!user || !user.id) {
        throw new Error("User not logged in or invalid user data");
      }
  
      console.log("Form values:", values);
  
      setLoading(true);
  
      // Include the userId in the request body
      const transactionData = { ...values, userId: user.id };
      console.log(transactionData);
  
      // API call to add transaction
      await axios.post("/addtransaction", transactionData);
      message.success("Transaction added successfully");
      form.resetFields();
      setShowModal(false);
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Layout>
      {loading && <Spinner />}
      <div className="filters d-flex justify-content-between align-items-center mb-4">
        <div>
          
        <div className="filter-container" style={{ width: "200px" }}>
      <h6>Select Frequency</h6>
      <Select
      placeholder="Select "
        Value={frequency}
        style={{ width: "100%" }}
        onChange={(values)=>setFrequency(values)}
      >
        <Select.Option value="7">Last 1 week</Select.Option>
        <Select.Option value="30">Last 1 month</Select.Option>
        <Select.Option value="365">Last 1 year</Select.Option>
        <Select.Option value="custom">Custom</Select.Option>
      </Select>
      {frequency==="custom" && <RangePicker value={selectedDate} onChange={(values)=>setSelectedDate(values)}/>}
    </div>
        </div>
        <div>
          
        <div className="filter-container" style={{ width: "200px" }}>
      <h6>Select Type</h6>
      <Select
      placeholder="Select "
        Value={type}
        style={{ width: "100%" }}
        onChange={(values)=>setType(values)}
      >
        <Select.Option value="all">All</Select.Option>
        <Select.Option value="income">Income</Select.Option>
        <Select.Option value="expense">Expense</Select.Option>
        
      </Select>
      {frequency==="custom" && <RangePicker value={selectedDate} onChange={(values)=>setSelectedDate(values)}/>}
    </div>
        </div>
        <div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Add New
          </button>
        </div>
      </div>
      <div className="content">
        <Table columns={columns} dataSource={alltransaction}/>
      </div>
      <Modal
          title="Add Transaction"
          open={showModal} // Updated from `visible` to `open`
          onCancel={() => setShowModal(false)}
          footer={null}
        >
          <Form
            layout="vertical"
            form={form} // Bind the form instance
            onFinish={handleSubmit}
            initialValues={{
              category: "Other",
              type: "income", // Default value for type
            }}
          >
            <Form.Item
              label="Amount"
              name="amount"
              rules={[{ required: true, message: "Please enter the amount!" }]}
            >
              <Input type="number" placeholder="Enter amount" />
            </Form.Item>

            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: "Please select a type!" }]}
            >
              <Select>
                <Option value="income">Income</Option>
                <Option value="expense">Expense</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: "Please select a category!" }]}
            >
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

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Please enter a description!" }]}
            >
              <Input.TextArea rows={3} placeholder="Enter description" />
            </Form.Item>

            <Form.Item
              label="Date"
              name="date"
              rules={[{ required: true, message: "Please select a date!" }]}
            >
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" placeholder="Select date" />
            </Form.Item>

            <div className="d-flex justify-content-end">
              <Button className="me-2" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Add Transaction
              </Button>
            </div>
          </Form>
        </Modal>
    </Layout>
  );
};

export default HomePage;
