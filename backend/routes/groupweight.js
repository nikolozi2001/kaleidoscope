const express = require("express");
const sql = require("mssql");
const { config } = require("../dbConfig");
const asyncHandler = require("../utils/asyncHandler");
const { validate, schemas } = require("../middleware/validation");
const logger = require("../config/logger");

const router = express.Router();

// GET /api/groupweight/:year/:level
router.get("/:year/:level", 
  validate(schemas.groupWeight),
  asyncHandler(async (req, res) => {
    const { year, level } = req.params;

    logger.info(`Fetching group weight data for year: ${year}, level: ${level}`);

    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("year", sql.Int, year)
      .input("level", sql.Int, level)
      .query(`
        SELECT *
        FROM groupweight
        WHERE
          year = @year AND
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
