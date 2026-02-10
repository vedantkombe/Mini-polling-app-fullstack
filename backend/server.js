const express = require("express");
const cors = require("cors");

const pollRoutes = require("./routes/pollRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/polls", pollRoutes);


app.listen(4000, () => {
  console.log("Backend running on port 4000");
});
