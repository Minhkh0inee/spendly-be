const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const MODE = process.env.MODE || "development";

const initMongoDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://khoidev159:AZuNdCQKmAtdpC5w@spendly-cluster.zcz9y3e.mongodb.net/spendly-dev?retryWrites=true&w=majority&appName=spendly-cluster"
    );
    console.log("Connect Mongo Atlas Success")
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = {initMongoDB}
