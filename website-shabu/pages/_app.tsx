import '../styles/globals.css'
import { Fragment } from 'react';
import 'antd/dist/antd.css';
import 'tailwindcss/tailwind.css'
import { ApolloProvider } from '@apollo/client';
import { client } from '../lib/apolloSetup';

function MyApp({ Component, pageProps }: any) {
  const Layout = Component.getLayout || ((props: any) => <Fragment>{props.children}</Fragment>);
  return (
    <ApolloProvider client={client}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  )
}


export default MyApp
