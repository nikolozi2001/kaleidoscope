const express = require("express");
const cors = require("cors");
const itemsRoute = require("./routes/items");
const groupIndexRoute = require("./routes/groupindex");
const groupIndexRightPanelRoute = require("./routes/groupindexrightpanel");
const groupWeightRoute = require("./routes/groupweight");
const groupWeightChartRoute = require("./routes/groupweightchart");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/items", itemsRoute);
app.use("/api/groupindex", groupIndexRoute);
app.use("/api/groupindexrightpanel", groupIndexRightPanelRoute);
app.use("/api/groupweight", groupWeightRoute);
app.use("/api/groupweightchart", groupWeightChartRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
