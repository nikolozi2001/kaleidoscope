const express = require("express");
const sql = require("mssql");
const config = require("../dbConfig");
const asyncHandler = require("../utils/asyncHandler");
const { validate, schemas } = require("../middleware/validation");
const logger = require("../config/logger");

const router = express.Router();

// GET /api/groupindexrightpanel/:year/:month/:level
router.get("/:year/:month/:level", 
  validate(schemas.groupIndexRightPanel),
  asyncHandler(async (req, res) => {
    const { year, month, level } = req.params;

    logger.info(`Fetching group index right panel data for year: ${year}, month: ${month}, level: ${level}`);

    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("year", sql.Int, year)
      .input("month", sql.Int, month)
      .input("level", sql.Int, level)
      .query(`
        SELECT *
        FROM groupindex
        WHERE
          year = @year AND
          month = @month AND
          level = @level
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          message: "No data found for the given parameters."
        }
      });
    }

    logger.info(`Successfully retrieved ${result.recordset.length} records`);

    res.status(200).json({
      success: true,
      count: result.recordset.length,
      data: result.recordset
    });
  })
);

module.exports = router;
