const express = require("express");
const sql = require("mssql");
const config = require("../dbConfig");
const asyncHandler = require("../utils/asyncHandler");
const logger = require("../config/logger");

const router = express.Router();

// GET all items
router.get("/", asyncHandler(async (req, res) => {
  logger.info('Fetching all items from coicopgroup');

  let pool = await sql.connect(config);
  let result = await pool.request().query("SELECT * FROM coicopgroup");

  logger.info(`Successfully retrieved ${result.recordset.length} items`);

  res.status(200).json({
    success: true,
    count: result.recordset.length,
    data: result.recordset
  });
}));

module.exports = router;
