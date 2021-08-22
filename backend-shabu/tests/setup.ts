
import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"

(async () => {

    const mongod = await MongoMemoryServer.create();

    const uri = mongod.getUri();

    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
})()