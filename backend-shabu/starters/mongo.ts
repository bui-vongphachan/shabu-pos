import mongoose from "mongoose";

export const connectToMongoDB = async () => {
  return mongoose
    .connect(
      "mongodb+srv://admin:123@cluster0.2lo7y.mongodb.net/shabu?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
      }
    )
    .then(() => console.log("DATABASE CONNECTED!!!"))
    .catch((er) => console.log(er));
};
