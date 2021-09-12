import NewOrderFormComponent from "../components/homePage/newOrderForm.component";
import OrderListComponent from "../components/homePage/orderList.componen";
import DefaultLayout from "../layouts/default";

const Home = () => {
  return (
    <div className=" grid grid-cols-2 lg:w-6/12 m-auto mt-3">
      <NewOrderFormComponent />
      <OrderListComponent />
    </div>
  );
};

Home.getLayout = DefaultLayout;

export default Home;
