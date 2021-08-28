import '../styles/globals.css'
import { Fragment } from 'react';
import 'antd/dist/antd.css';
import { useRouter } from 'next/dist/client/router';

function MyApp({ Component, pageProps }: any) {
  const Layout = Component.getLayout || ((props: any) => <Fragment>{props.children}</Fragment>);
  return (
    <Fragment>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Fragment>
  )
}


export default MyApp
