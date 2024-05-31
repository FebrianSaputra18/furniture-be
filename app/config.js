const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

module.exports = {
  mongoURI:
    process.env.MONGO_URI || "mongodb://localhost:27017/furniture-server",
  rootPath: path.join(__dirname, ".."),
  secretkey: process.env.SECRET_TOKEN,
  serviceName: process.env.SERVICE_NAME,
};
