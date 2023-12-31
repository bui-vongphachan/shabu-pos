import mongoose from "mongoose";

export interface TableDoc extends mongoose.Document {
    id: String
    name: String
    created_date: String
    schema_version: number
}

export interface ReadyTableDoc extends mongoose.Document {
    table: TableDoc
    status: String
    orders: Number
}

const Schema = new mongoose.Schema(
    {
        name: {
            type: String,
            default: null,
            require: true,
            unique: true
        },
        created_date: { type: Date, default: Date.now },
        schema_version: { type: Number, default: 2 },
    }
);

export const TableModel = mongoose.model<TableDoc>("tables", Schema);
