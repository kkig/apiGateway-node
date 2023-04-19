const express = require("express");
const app = express();
const port = 8080;

app.get("/name", (req, res) => {
  res.json({ name: "Pikachu" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
