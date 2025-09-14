const express = require("express");
const sql = require("mssql");
const config = require("../dbConfig");

const router = express.Router();

// GET /api/groupweightchart/:year
router.get("/:year", async (req, res) => {
  const { year } = req.params;

  try {
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
      return res.status(404).send("No data found for the given parameters.");
    }

    res.json(result.recordset);
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Server error while fetching groupweightchart data.");
  }
});

module.exports = router;
