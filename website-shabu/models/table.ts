import { gql } from "@apollo/client";

export interface TableModel {
    id: string
    name: string
    created_date: string
    schema_version: number
}


export interface ReadyTableModel {
    table: TableModel
    status: string
    orders: number
}

export const GetReadyTablesQueryString = gql`
    query Query {
        getReadyTables {
            table {
                id
                name
                created_date
                schema_version
            }
            status
            orders
        }
    }`