const express = require("express");
const sql = require("mssql");
const config = require("../dbConfig");
const asyncHandler = require("../utils/asyncHandler");
const { validate, schemas } = require("../middleware/validation");
const logger = require("../config/logger");

const router = express.Router();

// GET /api/groupindex/:year/:month/:code/:level
router.get("/:year/:month/:code/:level", 
  validate(schemas.groupIndex),
  asyncHandler(async (req, res) => {
    const { year, month, code, level } = req.params;

    logger.info(`Fetching group index data for year: ${year}, month: ${month}, code: ${code}, level: ${level}`);

    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("year", sql.Int, year)
      .input("month", sql.Int, month)
      .input("code", sql.VarChar, code)
      .input("level", sql.Int, level)
      .query(`
        SELECT *
        FROM groupindex
        WHERE
          code = @code AND
          level = @level AND
          year = @year AND
          month = @month
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
