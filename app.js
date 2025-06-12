const express = require("express");
const app = express();
const mongoose = require("mongoose");

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

app.use("/users", require("./routes/users.js"));
app.use("/clothingItems", require("./routes/clothingItems.js"));

app.get("/", (req, res) => {
  res.send(
    `<html>
    <body>
      <p>You rang?</p>
    </body>
    </html>`
  );
});

app.use((req, res) => {
  res.status(404).json({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
