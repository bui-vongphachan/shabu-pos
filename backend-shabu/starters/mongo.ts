import mongoose from "mongoose";

export const connectToMongoDB = async () => {
  return mongoose
    .connect(process.env.MONGO_URI!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => console.log("DATABASE CONNECTED!!!"))
    .catch((er) => console.log(er));
};
