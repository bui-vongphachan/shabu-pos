import { Fragment } from 'react'
import DefaultLayout from '../layouts/default'
import ControlPanelHome from './home/controlPanel/controlPanel.home'
import TableListHome from './home/tableList/tableList.home'


const Home: any = () => {
  return (
    <Fragment>
      <div className=" grid grid-cols-4">
        <TableListHome />
        <div className=" col-span-3 bg-blue-300">
          <ControlPanelHome />
        </div>
      </div>
    </Fragment>
  )
}

Home.getLayout = DefaultLayout

export default Home
