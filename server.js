const express = require("express");
const connectdb = require("./config/db");
const app = express();
const PORT = process.env.PORT || 5000;

//Connect to database before running the server
connectdb();

//Initialize middleware to parse the body in JSON format
app.use(
  express.json({
    extended: false
  })
);
//Define routes
app.use("/api/user", require("./routes/api/users"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/auth", require("./routes/api/auth"));

//Test GET request to check if server is running or not
app.get("/", (req, res) => {
  res.send("API running");
});

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
