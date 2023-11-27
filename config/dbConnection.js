const mongoose=require("mongoose");


const connectdb = async () => {
    try {
      console.log("in connection");
      const connect = await mongoose.connect("mongodb+srv://admin:admin@ameyascluster.l8f6hxs.mongodb.net/Bloggy?retryWrites=true&w=majority");
  
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
  