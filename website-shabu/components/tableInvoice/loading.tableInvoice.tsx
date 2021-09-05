import { Skeleton, Space } from "antd";

const LoadingTableInvoiceComponent = () => {
  return (
    <div className=" container m-auto">
      <Space split={" "} direction="vertical" className="w-full">
        {[1, 2, 3, 4].map((item, key) => (
          <div key={key} className=" w-full flex gap-3">
            <Skeleton.Avatar size="large" active />
            <Skeleton.Button size="large" active block />
          </div>
        ))}
      </Space>
    </div>
  );
};

export default LoadingTableInvoiceComponent;
