const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { MONGOURI } = require("./config/keys");

const PORT = 3000;

mongoose
    .connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Mongo Connected"))
    .catch((err) => console.log(err));

app.use(express.json());
app.use(require("./routes/user"));

app.listen(PORT, () => {
    console.log("Listening on Port " + PORT);
});
