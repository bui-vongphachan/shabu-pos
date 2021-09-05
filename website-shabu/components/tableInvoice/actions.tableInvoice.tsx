import { useContext } from "react";
import { TableInvoiceContext } from "../../pages/report/[table_id]";

const ActionsTableInvoiceComponent = () => {
  const tableInvoiceContext = useContext(TableInvoiceContext);
  const { table_id } = tableInvoiceContext;
  return (
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
  );
};

export default ActionsTableInvoiceComponent;
