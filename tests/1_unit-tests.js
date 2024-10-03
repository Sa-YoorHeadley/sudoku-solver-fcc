const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

const validPuzzle =
  "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
const solvedPuzzle =
  "135762984946381257728459613694517832812936745357824196473298561581673429269145378";

suite("Unit Tests", () => {
  test("Logic handles a valid puzzle string of 81 characters", () => {
    const solvedValidPuzzle = solver.solve(validPuzzle);
    assert.equal(solvedValidPuzzle, solvedPuzzle);
  });

  test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", () => {
    const invalidPuzzle =
      "1.5.p2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";

    const { message } = solver.validate(invalidPuzzle);
    assert.equal(message, "Invalid characters in puzzle");
  });

  test("Logic handles a puzzle string that is not 81 characters in length", () => {
    const shortPuzzle =
      "1.5.2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";

    const { message } = solver.validate(shortPuzzle);
    assert.equal(message, "Expected puzzle to be 81 characters long");
  });

  test("Logic handles a valid row placement", () => {
    const puzzle =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    const row = "A";
    const column = 1;
    const value = 7;

    const isValid = solver.checkRowPlacement(puzzle, row, column, value);

    assert.equal(isValid, true);
  });

  test("Logic handles an invalid row placement", () => {
    const puzzle =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    const row = "A";
    const column = 1;
    const value = 1;

    const isValid = solver.checkRowPlacement(puzzle, row, column, value);

    assert.equal(isValid, false);
  });

  test("Logic handles a valid column placement", () => {
    const puzzle =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    const row = "A";
    const column = 1;
    const value = 2;

    const isValid = solver.checkColPlacement(puzzle, row, column, value);

    assert.equal(isValid, true);
  });

  test("Logic handles an invalid column placement", () => {
    const puzzle =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    const row = "A";
    const column = 1;
    const value = 1;

    const isValid = solver.checkColPlacement(puzzle, row, column, value);

    assert.equal(isValid, false);
  });

  test("Logic handles a valid region (3x3 grid) placement", () => {
    const puzzle =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    const row = "A";
    const column = 1;
    const value = 1;

    const isValid = solver.checkRegionPlacement(puzzle, row, column, value);

    assert.equal(isValid, true);
  });

  test("Logic handles an invalid region (3x3 grid) placement", () => {
    const puzzle =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    const row = "A";
    const column = 1;
    const value = 2;

    const isValid = solver.checkRegionPlacement(puzzle, row, column, value);

    assert.equal(isValid, false);
  });

  test("Valid puzzle strings pass the solver", () => {
    const solvedValidPuzzle = solver.solve(validPuzzle);
    assert.equal(solvedValidPuzzle, solvedPuzzle);
  });

  test("Invalid puzzle strings fail the solver", () => {
    const invalidPuzzle =
      "2.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    const solvedInvalidPuzzle = solver.solve(invalidPuzzle);
    assert.equal(solvedInvalidPuzzle, false);
  });

  test("Solver returns the expected solution for an incomplete puzzle", () => {
    const solvedValidPuzzle = solver.solve(validPuzzle);
    assert.equal(solvedValidPuzzle, solvedPuzzle);
  });
});
