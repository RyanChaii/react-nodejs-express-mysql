const express = require("express");
const cors = require("cors");
const app = express();

app.use(function (req, res, next) {
  var err = null;
  try {
    decodeURIComponent(req.path);
  } catch (e) {
    err = e;
    res.send({ code: 400 });
  }
  next();
});

app.use(express.json());
app.use(cors());

const dotenv = require("dotenv");

const connectDatabase = require("./config/database");

//Setting up config.env file variables
dotenv.config({ path: "./config/config.env" });

//Connecting to database
connectDatabase;

// Importing all routes
const user = require("./routes/user");
const kanban = require("./routes/kanban");
const api = require("./routes/api");

app.use(user);
app.use(kanban);
app.use(api);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Node server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
});

// app.use("*", (res) => {
//   console.log(`error`);
//   return res.send({
//     code: "CT03"
//   })

// });
