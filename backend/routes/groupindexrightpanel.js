const express = require("express");
const sql = require("mssql");
const config = require("../dbConfig");

const router = express.Router();

// GET /api/groupindexrightpanel/:year/:month/:level
router.get("/:year/:month/:level", async (req, res) => {
  const { year, month, level } = req.params;

  try {
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
      return res.status(404).send("No data found for the given parameters.");
    }

    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
