import { Spin } from "antd";

const Spinner = () => {
  return (
    <div className="spinner-overlay d-flex align-items-center justify-content-center">
      <Spin size="large" />
    </div>
  );
};

export default Spinner;

