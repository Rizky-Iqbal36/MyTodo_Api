const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const router = require("./src/routes/router");

const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());

//public
app.use("/public/avatars", express.static("public/avatars"));
app.use(
  "/public/thumbnailParentCards",
  express.static("public/thumbnailParentCards")
);
app.use(
  "/public/thumbnailChildCards",
  express.static("public/thumbnailChildCards")
);
app.use("/api/v1", router);
app.get("/", (req, res) => {
  res.send("BACKEND MyTodo Rizky Iqbal");
});

app.listen(port, () => console.log(`Listening on port ${port}`));
