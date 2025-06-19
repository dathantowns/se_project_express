const express = require("express");
const mongoose = require("mongoose");
const { notFound } = require("./utils/handleError");

const app = express();
const { PORT = 3001 } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: "684a01bc0c1b517bbdc7f0a8",
  };
  next();
});

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use("/users", require("./routes/users"));
app.use("/items", require("./routes/items"));

app.use((req, res) => {
  res.status(notFound).json({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
