import { Fragment } from 'react'
import DefaultLayout from '../layouts/default'
import TableListHome from './home/tableList.home'


const Home: any = () => {
  return (
    <Fragment>
      <div className=" grid grid-cols-4">
        <TableListHome />
      </div>
    </Fragment>
  )
}

Home.getLayout = DefaultLayout

export default Home
