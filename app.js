const express = require("express");
const app = express();
const mongoose = require("mongoose");

const { PORT = 3001 } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
