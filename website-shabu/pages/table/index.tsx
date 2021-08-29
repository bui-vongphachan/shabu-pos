import { useMutation } from "@apollo/client"
import { Button, Card, Form, Input, } from "antd"
import { useState } from "react"
import DefaultLayout from "../../layouts/default"
import { client } from "../../lib/apolloSetup"
import { addTableQueryString } from "../../lib/graphql/addtable.gql"
import { getTablesQueryString } from "../../lib/graphql/getTable.gql"
import { PageProps, TableModel } from "../../models"
import dynamic from 'next/dynamic'
import { useEffect } from "react"
import { ValidateStatus } from "antd/lib/form/FormItem"

const TableList = dynamic(() => import('./tableList'),
    { loading: () => <p>...</p> })


const TablePage = (props: PageProps) => {
    const [name, setName] = useState("")
    const [validation, setValidation] = useState<ValidateStatus>("")
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [tables, saveTables] = useState<TableModel[]>([])
    const [addTable, addTableMutation] = useMutation(addTableQueryString);

    const submitForm = async () => {
        try {
            setValidation("validating")
            const response = await addTable({ variables: { addTableName: name } })

            saveTables(response.data.addTable)
            setName("")
            setValidation("")

        } catch (error) {
            console.log(error.message)
        }
    }
    useEffect(() => {
        saveTables(props.tables)
    }, [])

    useEffect(() => {
        if (addTableMutation.error) {
            setValidation("error")
            setErrorMessage(addTableMutation.error.message)
        }
    }, [addTableMutation.error])

    return (
        <div className=" container m-auto">
            <div className=" grid md:grid-cols-2 sm:grid-cols-1 justify-center">
                <div>
                    <Card className=" rounded-md m-3" title="ເພີ່ມໂຕະ">
                        <Form layout="vertical" requiredMark onFinish={submitForm}>
                            <Form.Item validateStatus={validation} label="ເລກໂຕະ / ຊື່ໂຕະ" required help={errorMessage}>
                                <Input disabled={addTableMutation.loading} value={name} onChange={e => setName(e.target.value)} />
                            </Form.Item>
                            <Form.Item>
                                <Button disabled={name === "" || addTableMutation.loading} htmlType="submit" >ເພີ່ມ</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
                <TableList tables={tables} />
            </div>
        </div>
    )
}

export const getStaticProps = async () => {
    const { data } = await client.query({
        query: getTablesQueryString,
    });
    return {
        props: {
            tables: data.getTables
        }
    }
}

export default TablePage


TablePage.getLayout = DefaultLayout