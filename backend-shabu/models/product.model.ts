import mongoose from "mongoose";

interface SizeDoc extends mongoose.Document {
    name: String,
    price: Number
}

interface Doc extends mongoose.Document {
    id: String
    name: String
    category: String
    sizes: SizeDoc[]
    created_date: String
}

const Schema = new mongoose.Schema(
    {
        name: { type: String, default: null, require: true },
        category: { type: String, default: null, require: true },
        sizes: [{
            name: { type: String, default: null, require: true },
            price: { type: Number, default: 0, require: true },
        }],
        created_date: { type: Date, default: Date.now }
    }
);

export const ProductModel = mongoose.model<Doc>("products", Schema);
