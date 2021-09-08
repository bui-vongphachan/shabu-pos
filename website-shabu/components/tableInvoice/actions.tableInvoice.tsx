import { useRouter } from "next/router";
import { useContext } from "react";
import { TableInvoiceContext } from "../../pages/report/[table_id]";

const ActionsTableInvoiceComponent = () => {
  const router = useRouter();
  const tableInvoiceContext = useContext(TableInvoiceContext);
  const { table_id, invoice } = tableInvoiceContext;
  return (
    <ul className="rounded-md py-3 flex flex-wrap md:justify-start justify-center">
      {[
        {
          label: "ສັ່ງອາຫານ",
          link: `${table_id}/${invoice?.id}/new-order`
        },
        { label: "ພິມບິນ", link: `${table_id}/${invoice?.id}/bill` },
        { label: "ຈ່າຍເງິນ", link: `${table_id}/${invoice?.id}/pay` },
        {
          label: "ຍ້າຍໂຕະ",
          link: `${table_id}/switch-table`
        },
        { label: "ຍົກເລີກ", link: `${table_id}/${invoice?.id}/cancel` }
      ].map((item, index) => {
        return (
          <li style={{ margin: 1 }} key={index}>
            <span>
              <button
                type="button"
                className="ant-btn rounded-md ant-btn-lg"
                ant-click-animating-without-extra-node="false"
                onClick={() => router.push(item.link)}
              >
                <span>{item.label}</span>
              </button>
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default ActionsTableInvoiceComponent;
