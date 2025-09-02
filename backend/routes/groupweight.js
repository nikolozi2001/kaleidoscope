const express = require("express");
const sql = require("mssql");
const config = require("../dbConfig");

const router = express.Router();

// GET /api/groupweight/:year/:level
router.get("/:year/:level", async (req, res) => {
  const { year, level } = req.params;

  try {
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
      return res.status(404).send("No data found for the given parameters.");
    }

    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
