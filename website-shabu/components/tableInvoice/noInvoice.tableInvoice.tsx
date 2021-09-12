import { Button, Typography } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

const NoInvoiceTableInvoiceComponent = () => {
  const router = useRouter();
  const { table_id } = router.query;
  return (
    <div className=" text-center container m-auto">
      <Image width="50%" height="50%" src="/assets/images/nDkF0901.svg" />
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
