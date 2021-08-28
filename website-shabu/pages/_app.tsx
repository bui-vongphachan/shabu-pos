import '../styles/globals.css'
import { Fragment } from 'react';
import 'antd/dist/antd.css';
import { GetStaticProps } from 'next';

function MyApp({ Component, pageProps }: any) {
  const getLayout = Component.getLayout || ((page: any) => page)

  return getLayout(<Component {...pageProps} />)
}


export default MyApp
