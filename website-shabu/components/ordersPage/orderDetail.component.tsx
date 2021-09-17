import { Avatar, Button, Card, List, Skeleton } from "antd";
import QueueAnim from "rc-queue-anim";
import { Fragment, useContext, useState } from "react";
import { OrdersPageContext } from "../../pages/orders";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const OrderDetailComponent = () => {
  const [curLine, setCurLine] = useState(0);
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
          <Button
            key={1}
            className=" rounded-md"
            onClick={async () => {
              var myDiv = document.getElementById("myTable"); //get #myDiv
              const height = myDiv!.clientHeight * 0.4;

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
              doc.setFontSize(10);

              let textLine = 10;

              selectedInvoice.orders.forEach((item, index) => {
                doc.text(`${item.name} (${item.size.name})`, 4, textLine);

                doc.text(item.totalPrice.toLocaleString(), 83, textLine, {
                  align: "right"
                });
                textLine += 4;
                doc.text(`${item.quantity} x ${item.size.price}`, 4, textLine);
                textLine += 10;
              });

              {
                doc.line(87, textLine, 1, textLine);
                doc.setFontSize(15);
                doc.text("ຍອດລວມ", 4, textLine + 10);
                doc.text(
                  selectedInvoice.final_price.toLocaleString(),
                  83,
                  textLine + 10,
                  {
                    align: "right"
                  }
                );
              }

              /*        autoTable(doc, {
                useCss: true,
                theme: "plain",
                margin: {
                  top: 40,
                  left: 1,
                  right: 1,
                  bottom: 1
                },
                html: "#table",
                styles: { font: "saysettha_OT", fontSize: 7 }
              }); */

              /*      let finalY = (doc as any).lastAutoTable.finalY;

            doc.text("Hello!", 1, finalY + 10, {});
*/
              doc.output("dataurlnewwindow");
            }}
          >
            ປິ້ນໃບບິນ
          </Button>
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
      <div id="myTable" style={{ left: -1000 }} className=" absolute bg-white">
        <table id="table">
          <thead>
            <tr>
              <th className=" text-left">ສິນຄ້າ</th>
              <th>ລາຄາ</th>
              <th className=" text-right">ລວມ</th>
            </tr>
          </thead>
          <tbody>
            {selectedInvoice.orders.map((item, index) => {
              return (
                <Fragment>
                  <tr key={index}>
                    <td>
                      {item.name} ({item.size.name}) x {item.quantity}
                    </td>
                    <td className=" text-right">
                      {item.size.price.toLocaleString()}
                    </td>
                    <td rowSpan={2} className=" text-right">
                      {item.totalPrice.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ marginLeft: 10 }}> - {item.size.name}</td>
                    <td className=" text-right">
                      {item.size.price.toLocaleString()}
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ fontSize: 20 }}>
              <td style={{ padding: 10 }} colSpan={2}>
                ຍອດລວມ
              </td>
              <td className=" text-right">
                {selectedInvoice.final_price.toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </QueueAnim>
  );
};

export default OrderDetailComponent;
