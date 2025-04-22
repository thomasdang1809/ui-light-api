const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Import route tạo entity
const entityRoutes = require("./routes/entityRoutes");
app.use("/entities", entityRoutes); // => http://localhost:5000/entities

// Các API khác của bạn...

app.listen(PORT, () => {
  console.log(`🚀 ui-light-api is running at http://localhost:${PORT}`);
});
