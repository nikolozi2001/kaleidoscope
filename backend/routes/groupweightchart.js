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
             groupweight.[id]
            ,groupweight.[code]
            --,groupweight.[level]
            --,groupweight.[year]
            --,groupweight.[weight] AS weight_original
            ,FORMAT(CAST(groupweight.[weight] AS FLOAT) * 100, 'N2') AS weight
			      -- ,groupindex.[index] AS groupindex
            --,translates.[id]
            ,translates.[title_geo]
            ,translates.[title_en]
            --,translates.[code]
            --,translates.[level]
            --,translates.[parent_id]
        FROM [kaleidoscope].[dbo].[groupweight] AS groupweight
        JOIN [kaleidoscope].[dbo].[coicopgroup] AS translates
         ON translates.code = groupweight.code
        AND translates.level = groupweight.level
        -- JOIN [kaleidoscope].[dbo].[groupindex] AS groupindex
        -- ON groupindex.code = groupweight.code AND groupindex.level = 2
        WHERE
            groupweight.level = 2
        AND CAST(groupweight.[weight] AS FLOAT) > 0
        AND groupweight.year = @year
        -- AND groupindex.month = @month
      `);

    if (result.recordset.length === 0) {
      return res.status(404).send("No data found for the given parameters.");
    }

    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
