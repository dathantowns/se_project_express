const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { notFound } = require("./utils/handleError");
const { login, createUser } = require("./controllers/users");
const auth = require("./middlewares/auth");

const app = express();
const { PORT = 3001 } = process.env;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use("/", require("./routes/index"));

app.use(auth);

app.use("/items", require("./routes/items"));
app.use("/users", require("./routes/users"));

app.use((req, res) => {
  res.status(notFound).json({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
