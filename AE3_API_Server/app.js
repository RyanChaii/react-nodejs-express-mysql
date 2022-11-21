const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Prevent crashing and handle error in the req.body
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).send({ code: "AA88" });
  }
  next();
});

// Prevent crashing and handle percentage in the url
app.use((req, res, next) => {
  try {
    decodeURIComponent(req.path);
  } catch (e) {
    return res.status(400).send({ code: "AA99" });
  }
  next();
});

const dotenv = require("dotenv");

const connectDatabase = require("./config/database");

//Setting up config.env file variables
dotenv.config({ path: "./config/config.env" });

//Connecting to database
connectDatabase;

// Importing all routes
const api = require("./routes/api");

app.use(api);

// All not valid api will be displayed with this code
app.all("*", (req, res, next) => {
  res.status(400).send({ code: "AA99" });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Node server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
});
