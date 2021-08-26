
import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"

let db: any

(async () => {

    const mongod = await MongoMemoryServer.create();

    const uri = mongod.getUri();

    db = await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
})()
