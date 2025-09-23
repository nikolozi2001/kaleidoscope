const express = require("express");
const sql = require("mssql");
const config = require("../dbConfig");
const asyncHandler = require("../utils/asyncHandler");
const { validate, schemas } = require("../middleware/validation");
const logger = require("../config/logger");

const router = express.Router();

// GET /api/groupweightchart/:year
router.get("/:year", 
  validate(schemas.groupWeightChart),
  asyncHandler(async (req, res) => {
    const { year } = req.params;

    logger.info(`Fetching group weight chart data for year: ${year}`);

    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("year", sql.Int, year)
      .query(`
        SELECT
             gw.[id]
            ,gw.[code]
            ,FORMAT(TRY_CAST(gw.[weight] AS FLOAT) * 100, 'N2') AS weight
            ,tr.[title_geo]
            ,tr.[title_en]
        FROM [kaleidoscope].[dbo].[groupweight] AS gw
        JOIN [kaleidoscope].[dbo].[coicopgroup] AS tr
          ON tr.code = gw.code
         AND tr.level = gw.level
        WHERE
            gw.level = 2
        AND TRY_CAST(gw.[weight] AS FLOAT) > 0
        AND gw.year = @year
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
