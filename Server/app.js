const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const connectDatabase = require("./config/database");

//Setting up config.env file variables
dotenv.config({ path: "./config/config.env" });

//Connecting to database
connectDatabase;

// Set cookie parser
app.use(cookieParser());

// Importing all routes
const user = require("./routes/user");
const kanban = require("./routes/kanban");

app.use(user);
app.use(kanban);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Node server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
});
