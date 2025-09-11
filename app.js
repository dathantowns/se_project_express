const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { notFound } = require("./utils/handleError");
const { login, createUser } = require("./controllers/users");
const { getItems } = require("./controllers/items");
const auth = require("./middlewares/auth");
const { errors } = require("celebrate");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
require("dotenv").config();

const app = express();
const { PORT = 3001 } = process.env;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(requestLogger);

app.use("/", require("./routes/index"));
// Public route for GET /items
app.get("/items", getItems);
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.post("/signin", login);
app.post("/signup", createUser);

// Apply auth middleware to all routes below this point
app.use(auth);

// Protected /items and /users routes
app.use("/items", require("./routes/items"));
app.use("/users", require("./routes/users"));

app.use((req, res) => {
  res.status(notFound).json({ message: "Requested resource not found" });
});

app.use(errorLogger);

app.use(errors()); // celebrate error handler
app.use(errorHandler); // custom error handler

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
