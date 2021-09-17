import { Avatar, Button, Card, List, Skeleton } from "antd";
import QueueAnim from "rc-queue-anim";
import { useContext } from "react";
import { OrdersPageContext } from "../../pages/orders";
import { jsPDF } from "jspdf";

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
          <Button
            key={2}
            className=" rounded-md"
            onClick={async () => {
              const invoice = selectedInvoice;
              const imageHeight = 50;
              const headerHeight = 15;
              const lineHeight = 5;
              const productHeight = 10;
              const subProductHeight = 5;
              const productNewLineHeight = 7;
              const sumaryHeight = 10;
              const signoffHeight = 10;
              let totalHeight = 10;
              let trackingHeight = 0;

              totalHeight += imageHeight;
              totalHeight += headerHeight;
              totalHeight += lineHeight;

              if (invoice.orders.length > 0) {
                invoice.orders.forEach((item) => {
                  totalHeight += productHeight;
                  item.options.forEach(() => {
                    totalHeight += subProductHeight;
                  });
                });
              }

              totalHeight += productNewLineHeight;
              totalHeight += sumaryHeight;
              totalHeight += productNewLineHeight;
              totalHeight += signoffHeight;

              const doc = new jsPDF("p", "mm", [88, totalHeight], false);

              doc.addFont(
                "/assets/fonts/Phetsarath OT.ttf",
                "saysettha_OT",
                "normal"
              );

              trackingHeight += imageHeight;

              doc.addImage(
                "/assets/images/LOGO.png",
                18,
                1,
                trackingHeight,
                trackingHeight,
                "image",
                "FAST"
              );

              doc.setFont("saysettha_OT");
              doc.setFontSize(15);

              trackingHeight += headerHeight;

              doc.text(`ຊີ້ນດາດໂປ້ຍຊຽນ - Poysian BBQ`, 9, trackingHeight);

              trackingHeight += lineHeight;

              doc.line(87, trackingHeight, 1, trackingHeight);

              doc.setFontSize(10);

              invoice.orders.forEach((item) => {
                trackingHeight += productHeight;

                doc.text(
                  `${item.name} (${item.size.name}) ${
                    item.quantity
                  } x ${item.size.price.toLocaleString()}`,
                  4,
                  trackingHeight
                );
                doc.text(
                  item.totalFoodPrice.toLocaleString(),
                  83,
                  trackingHeight,
                  {
                    align: "right"
                  }
                );
                if (item.options.length > 0) {
                  doc.setFontSize(8);

                  item.options.forEach((item) => {
                    trackingHeight += subProductHeight;
                    doc.text(`- ${item.name}`, 6, trackingHeight);
                    doc.text(item.price.toLocaleString(), 83, trackingHeight, {
                      align: "right"
                    });
                  });

                  doc.setFontSize(10);
                }
              });

              trackingHeight += productNewLineHeight;
              doc.line(87, trackingHeight, 1, trackingHeight);

              trackingHeight += sumaryHeight;
              doc.setFontSize(13);
              doc.text("ຍອດລວມ", 4, trackingHeight);
              doc.text(
                invoice.final_price.toLocaleString(),
                83,
                trackingHeight,
                {
                  align: "right"
                }
              );

              trackingHeight += productNewLineHeight;
              doc.line(87, trackingHeight, 1, trackingHeight);

              doc.setFontSize(13);
              trackingHeight += signoffHeight;
              doc.text("ຂອບໃຈທີ່ອຸດໜຸນ", 29, trackingHeight);

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
                    title={`${item.name} (${item.size.name})`}
                    description={item.options.map((option, index) => {
                      if (++index !== item.options.length)
                        return `${option.name}, `;
                      else return option.name;
                    })}
                  />
                  {item.totalPrice.toLocaleString()}
                </Skeleton>
              </List.Item>
            </div>
          )}
        />
      </Card>
    </QueueAnim>
  );
};

export default OrderDetailComponent;
