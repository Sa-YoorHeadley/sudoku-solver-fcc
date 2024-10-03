"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;
    // console.log(req.body);
    if (!puzzle || !coordinate || value == null || value == undefined) {
      return res.json({
        error: `Required field(s) missing`,
      });
    }

    // Coordinate Error Handling
    const row = coordinate.split("")[0];
    const column = coordinate.split("")[1];

    if (
      coordinate.length !== 2 ||
      !/[a-i]/i.test(row) ||
      !/[1-9]/i.test(column)
    ) {
      return res.json({ error: "Invalid coordinate" });
    }

    // Puzzle Error Handling
    const { valid, message } = solver.validate(puzzle);
    if (!valid) {
      return res.json({ error: message });
    }

    // Value Error Handling
    if (!/^[1-9]{1}$/.test(value)) {
      return res.json({ error: "Invalid value" });
    }

    let index = (solver.letterToNumber(row) - 1) * 9 + (+column - 1);

    if (puzzle[index] == value) {
      return res.json({ valid: true });
    }

    let validRow = solver.checkRowPlacement(puzzle, row, column, value);
    let validColumn = solver.checkColPlacement(puzzle, row, column, value);
    let validRegion = solver.checkRegionPlacement(puzzle, row, column, value);

    let conflict = [];
    if (validRow && validColumn && validRegion) {
      return res.json({ valid: true });
    }
    if (!validRow) {
      conflict.push("row");
    }
    if (!validColumn) {
      conflict.push("column");
    }
    if (!validRegion) {
      conflict.push("region");
    }
    return res.json({ valid: false, conflict });
  });

  app.route("/api/solve").post((req, res) => {
    const { puzzle } = req.body;
    if (!puzzle) {
      return res.json({ error: `Required field missing` });
    }

    const { valid, message } = solver.validate(puzzle);
    if (!valid) {
      return res.json({ error: message });
    }
    // if (puzzle.length != 81) {
    //   res.json({ error: "Expected puzzle to be 81 characters long" });
    //   return;
    // }
    // if (/[^0-9.]/g.test(puzzle)) {
    //   res.json({ error: "Invalid characters in puzzle" });
    //   return;
    // }
    let solution = solver.solve(puzzle);
    if (!solution) {
      res.json({ error: "Puzzle cannot be solved" });
    } else {
      res.json({ solution });
    }
  });
};
