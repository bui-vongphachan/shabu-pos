import { Button, Divider, List, Skeleton, Space, Typography } from "antd";
import DefaultLayout from "../../../layouts/default";
import { InvoiceModel } from "../../../models/invoice";
import Image from "next/image";
import Link from "next/link";
import Title from "antd/lib/typography/Title";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import moment from "moment";
import { MAIN_QUERY } from "./main.query";

const TableDetail = () => {
  const router = useRouter();
  const { table_id } = router.query;
  const { loading, error, data } = useQuery(MAIN_QUERY, {
    variables: {
      getInvoiceTableId: table_id,
      getInvoiceIsPaid: false
    }
  });
  if (loading) {
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
  }

  const invoice = data.getInvoice as InvoiceModel;

  if (data === undefined || !invoice) {
    return (
      <div className=" text-center">
        <Image
          sizes="lg"
          width="100%"
          height="100%"
          src="/assets/images/nDkF0901.svg"
        />
        <Title level={4}>ຍັງບໍ່ມີອໍເດີ້</Title>
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
  }

  let totalSpentTime = moment
    .duration(moment(new Date()).diff(invoice.arrived_time))
    .asMinutes();
  let totalSpentTimeText = "";
  if (totalSpentTime > 1000)
    totalSpentTimeText = `${Math.floor(totalSpentTime / 60)} ຊົ່ວໂມງ`;
  else totalSpentTimeText = `${Math.floor(totalSpentTime)} ນາທີ`;

  return (
    <div className="container my-3 mx-auto">
      <Typography.Title level={4}>
        ໂຕະໝາຍເລກ {invoice.table.name}
      </Typography.Title>
      <table className=" w-full">
        <tbody>
          <tr>
            <td className=" px-3 py-1">ຈຳນວນຄົນ</td>
            <td className=" px-3 py-1">{invoice.customers}</td>
          </tr>
          <tr className="bg-emerald-200">
            <td className=" px-3 py-1">ເວລາມາ</td>
            <td className=" px-3 py-1">
              {moment(invoice.arrived_time).format("HH:mm")}
            </td>
          </tr>
          <tr>
            <td className=" px-3 py-1">ເວລາທີ່ໃຊ້</td>
            <td className=" px-3 py-1">{totalSpentTimeText}</td>
          </tr>
          <tr>
            <td className=" px-3 py-1">ອໍເດີ້</td>
            <td className=" px-3 py-1">{invoice.orders.length}</td>
          </tr>
          <tr>
            <td className=" px-3 py-1">ລາຄາລວມ</td>
            <td className=" px-3 py-1">
              {invoice.total_price.toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
      <ul className="rounded-md py-3 flex flex-wrap md:justify-start justify-center">
        {[
          {
            label: "ສັ່ງອາຫານ",
            link: `report/${table_id}/new-order`
          },
          { label: "ພິມບິນ", link: `report/${table_id}/bill` },
          { label: "ຈ່າຍເງິນ", link: `report/${table_id}/pay` },
          {
            label: "ຍ້າຍໂຕະ",
            link: `report/${table_id}/switch-table`
          },
          { label: "ຍົກເລີກ", link: `report/${table_id}/cancel` }
        ].map((item, index) => {
          return (
            <li style={{ margin: 1 }} key={index}>
              <span>
                <button
                  type="button"
                  className="ant-btn rounded-md ant-btn-lg"
                  ant-click-animating-without-extra-node="false"
                >
                  <span>{item.label}</span>
                </button>
              </span>
            </li>
          );
        })}
      </ul>
      <Divider orientation="left">ລາຍການທີ່ສັ່ງ</Divider>
      <List
        className=" rounded-md lg:w-6/12 md:w-10/12 w-full"
        bordered
        dataSource={invoice.orders}
        renderItem={(item, index) => (
          <List.Item
            actions={[
              <a
                key="list-loadmore-edit"
                href={`${table_id}/edit-order`}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`${table_id}/${item.id}/edit-order`);
                }}
              >
                ແກ້ໄຂ
              </a>,
              <a key="list-loadmore-edit">ລົບ</a>
            ]}
          >
            <Typography.Text className=" mr-4">{++index}</Typography.Text>
            <List.Item.Meta
              title={item.name}
              description={`${item.size.name} x ${item.quantity}`}
            />
            <div>{item.totalPrice.toLocaleString()}</div>
          </List.Item>
        )}
      />
    </div>
  );
};

TableDetail.getLayout = DefaultLayout;

export default TableDetail;
