const express = require("express");
const sql = require("mssql");
const config = require("../dbConfig");

const router = express.Router();

// GET all items
router.get("/", async (req, res) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query("SELECT * FROM coicopgroup");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// // GET item by ID
// router.get("/:id", async (req, res) => {
//   try {
//     let pool = await sql.connect(config);
//     let result = await pool
//       .request()
//       .input("id", sql.Int, req.params.id)
//       .query("SELECT * FROM Items WHERE id = @id");

//     if (result.recordset.length === 0) {
//       return res.status(404).send("Item not found");
//     }

//     res.json(result.recordset[0]);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// // POST a new item
// router.post("/", async (req, res) => {
//   try {
//     let { name } = req.body;
//     let pool = await sql.connect(config);
//     let result = await pool
//       .request()
//       .input("name", sql.NVarChar, name)
//       .query("INSERT INTO Items (name) OUTPUT INSERTED.* VALUES (@name)");

//     res.status(201).json(result.recordset[0]);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// // PUT update item
// router.put("/:id", async (req, res) => {
//   try {
//     let { name } = req.body;
//     let pool = await sql.connect(config);
//     let result = await pool
//       .request()
//       .input("id", sql.Int, req.params.id)
//       .input("name", sql.NVarChar, name)
//       .query("UPDATE Items SET name = @name WHERE id = @id");

//     if (result.rowsAffected[0] === 0) {
//       return res.status(404).send("Item not found");
//     }

//     res.send("Item updated");
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// // DELETE item
// router.delete("/:id", async (req, res) => {
//   try {
//     let pool = await sql.connect(config);
//     let result = await pool
//       .request()
//       .input("id", sql.Int, req.params.id)
//       .query("DELETE FROM Items WHERE id = @id");

//     if (result.rowsAffected[0] === 0) {
//       return res.status(404).send("Item not found");
//     }

//     res.send("Item deleted");
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

module.exports = router;
