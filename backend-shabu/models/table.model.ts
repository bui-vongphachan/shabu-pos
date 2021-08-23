import mongoose from "mongoose";

interface Doc extends mongoose.Document {
    id: String
    name: String
    created_date: String
    schema_version: number
}

const Schema = new mongoose.Schema(
    {
        name: {
            type: String,
            default: null,
            require: true,
            index: true,
            unique: true
        },
        created_date: { type: Date, default: Date.now },
        schema_version: { type: Number, default: 2 },
    }
);

export const TableModel = mongoose.model<Doc>("tables", Schema);
