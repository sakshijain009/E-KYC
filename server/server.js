const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5002;
const connectToMongo = require('./middleware/db');

app.use(cors());
app.use(express.json());

// Require Routes
app.use(require("./routes/testAPI"));
app.use("/api/", require("./routes/index"));

// DB Config
connectToMongo();

// Listen on port
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});