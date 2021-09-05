import { Button, Typography } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { TableInvoiceContext } from "../../pages/report/[table_id]";

const NoInvoiceTableInvoiceComponent = () => {
  const tableInvoiceContext = useContext(TableInvoiceContext);
  const { table_id } = tableInvoiceContext;
  return (
    <div className=" text-center">
      <Image
        sizes="lg"
        width="100%"
        height="100%"
        src="/assets/images/nDkF0901.svg"
      />
      <Typography.Title level={4}>ຍັງບໍ່ມີອໍເດີ້</Typography.Title>
      <Link href={`/report/${table_id}/new-invoice`}>
        <Button
          size="large"
          type="primary"
          className=" rounded-md h-auto py-5 px-10"
        >
          <span style={{ fontSize: 20 }}>ສັ່ງອາຫານ</span>
        </Button>
      </Link>
    </div>
  );
};

export default NoInvoiceTableInvoiceComponent;
