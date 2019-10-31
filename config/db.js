const mongoose = require("mongoose");
const config = require("config");
const dbURI = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log("Connected to database!");
  } catch (err) {
    console.log(err.message);

    //Exit with status 1
    process.exit(1);
  }
};

module.exports = connectDB;
