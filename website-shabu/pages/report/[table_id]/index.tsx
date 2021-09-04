import { Button, Card, PageHeader } from "antd"
import { GetServerSidePropsContext } from "next"
import { Fragment, useState } from "react"
import DefaultLayout from "../../../layouts/default"
import { client } from "../../../lib/apolloSetup"
import { getInvoiceQueryString, InvoiceModel } from "../../../models/invoice"
import Image from "next/image"
import Link from "next/link"
import Title from "antd/lib/typography/Title"
import { useRouter } from "next/router"
const TableDetail = (props: {
    invoice: InvoiceModel | null
}) => {
    const router = useRouter()
    const { table_id } = router.query;
    if (!props.invoice) {
        return (
            <div className=" text-center">
                <Image
                    sizes="lg"
                    width="100%"
                    height="100%"
                    src="/assets/images/nDkF0901.svg" />
                <Title level={4}>ຍັງບໍ່ມີອໍເດີ້</Title>
                <Link href={`/report/${table_id}/new-invoice`}>
                    <Button size="large" type="primary" className=" rounded-md h-auto py-5 px-10">
                        <span style={{ fontSize: 20 }}>ສັ່ງອາຫານ</span>
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <Fragment>

        </Fragment>
    )
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const { data } = await client.query({
        query: getInvoiceQueryString,
        variables: { table_id: context.params!.table_id, isPaid: false }
    })
    return {
        props: {
            invoice: data.getInvoice,
        }
    }
}

TableDetail.getLayout = DefaultLayout

export default TableDetail