"use strict";

const app = require("./app");
const { PORT } = require("./configs/config");

app.listen(PORT, function () {
  console.log(`Started on http://localhost:${PORT}`);
});
