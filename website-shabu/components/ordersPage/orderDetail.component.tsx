import { Avatar, Button, Card, Dropdown, List, Menu, Skeleton } from "antd";
import QueueAnim from "rc-queue-anim";
import { useContext } from "react";
import { OrdersPageContext } from "../../pages/orders";
import { DownOutlined } from "@ant-design/icons";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const OrderDetailComponent = () => {
  const orderPageContext = useContext(OrdersPageContext);

  const { selectedInvoice } = orderPageContext;

  if (!selectedInvoice) return <span></span>;

  const orderID = selectedInvoice.id.substring(
    selectedInvoice.id.length - 6,
    selectedInvoice.id.length
  );

  return (
    <QueueAnim className="demo-content">
      <Card
        title={orderID.toUpperCase()}
        className=" sticky top-0 rounded-md"
        extra={[
          <Button key={1} className=" rounded-md">
            ເພີ່ມລາຍການ
          </Button>,
          <Dropdown
            key={2}
            overlay={
              <Menu
                key={1}
                onClick={() => {
                  var myDiv = document.getElementById("myTable"); //get #myDiv
                  console.log(myDiv?.clientHeight);
                  console.log(myDiv!.clientHeight * 0.5);
                  const height = myDiv!.clientHeight * 0.5;
                  const doc = new jsPDF(
                    "p",
                    "mm",
                    [88, height < 88 ? 88 : height],
                    false
                  );
                  doc.addFont(
                    "/assets/fonts/Phetsarath OT.ttf",
                    "saysettha_OT",
                    "normal"
                  );
                  doc.setFont("saysettha_OT");
                  doc.text("ນ້ຳ", 1, 10);

                  autoTable(doc, {
                    theme: "plain",
                    margin: {
                      top: 10,
                      left: 1,
                      right: 1,
                      bottom: 1
                    },
                    html: "#table",
                    styles: { font: "saysettha_OT", fontSize: 7 }
                  });
                  doc.output("dataurlnewwindow");
                  doc.close();
                }}
              >
                <Menu.Item key={1}>
                  <a>ປິ້ນໃບບິນ</a>
                </Menu.Item>
              </Menu>
            }
          >
            <Button className=" rounded-md ml-3">
              <DownOutlined />
            </Button>
          </Dropdown>
        ]}
      >
        <List
          style={{ height: "70vh", overflow: "scroll" }}
          itemLayout="horizontal"
          dataSource={selectedInvoice.orders}
          locale={{ emptyText: "ບໍ່ມີລາຍການ" }}
          renderItem={(item, index) => (
            <div
              key={index}
              className=" px-3 mb-3 rounded-md border-2 hover:shadow-md cursor-pointer "
            >
              <List.Item
                actions={[
                  <a key="list-loadmore-edit">ແກ້ໄຂ</a>,
                  <a key="list-loadmore-more">ລົບ</a>
                ]}
              >
                <Skeleton avatar title={false} loading={false}>
                  <List.Item.Meta
                    avatar={
                      <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                    }
                    title={item.name}
                    description={item.size.name}
                  />
                  {item.totalPrice.toLocaleString()}
                </Skeleton>
              </List.Item>
            </div>
          )}
        />
      </Card>
      <div
        id="myTable"
        style={{ left: -1000 }}
        className=" absolute bg-gray-500"
      >
        <table id="table">
          <thead>
            <tr>
              <th>#</th>
              <th>ສິນຄ້າ</th>
              <th>ຈຳນວນ</th>
              <th>ລາຄາ</th>
              <th>ລວມ</th>
            </tr>
          </thead>
          <tbody>
            {selectedInvoice.orders.map((item, index) => (
              <tr key={index}>
                <td>{++index}</td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.size.price.toLocaleString()}</td>
                <td>{item.totalPrice.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </QueueAnim>
  );
};

export default OrderDetailComponent;
