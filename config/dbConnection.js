const mongoose=require("mongoose");
require("dotenv").config();
const DB_URL=process.env.MONGO_DB_URL;

const connectdb = async () => {
    try {
      console.log(DB_URL);
      console.log("in connection");
      const connect = await mongoose.connect(DB_URL);
  
      console.log(
        "Database Connected",
        connect.connection.host,
        connect.connection.name
      );
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  };
  
  module.exports = connectdb;
  