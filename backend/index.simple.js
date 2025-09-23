require('dotenv').config();
const express = require("express");
const cors = require("cors");

// Import routes
const itemsRoute = require("./routes/items");
const groupIndexRoute = require("./routes/groupindex");
const groupIndexRightPanelRoute = require("./routes/groupindexrightpanel");
const groupWeightRoute = require("./routes/groupweight");
const groupWeightChartRoute = require("./routes/groupweightchart");

const app = express();
const PORT = process.env.PORT || 8080;

// Basic middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use("/api/items", itemsRoute);
app.use("/api/groupindex", groupIndexRoute);
app.use("/api/groupindexrightpanel", groupIndexRightPanelRoute);
app.use("/api/groupweight", groupWeightRoute);
app.use("/api/groupweightchart", groupWeightChartRoute);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.originalUrl} not found`
    }
  });
});

// Basic error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    success: false,
    error: {
      message: err.message || 'Server Error'
    }
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please use a different port.`);
  } else if (err.code === 'EACCES') {
    console.error(`Permission denied to bind to port ${PORT}. Please use a different port or run with admin privileges.`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});

module.exports = app;