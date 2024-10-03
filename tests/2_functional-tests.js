const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

const validPuzzle =
  "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
const solvedPuzzle =
  "135762984946381257728459613694517832812936745357824196473298561581673429269145378";

suite("Functional Tests", () => {
  test("Solve a puzzle with valid puzzle string: POST request to /api/solve", () => {
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: validPuzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        const { solution } = res.body;
        assert.equal(solution, solvedPuzzle);
      });
  });

  test("Solve a puzzle with missing puzzle string: POST request to /api/solve", () => {
    const missingPuzzleString = "";
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: missingPuzzleString })
      .end((err, res) => {
        assert.equal(res.status, 200);
        const { error } = res.body;
        assert.equal(error, `Required field missing`);
      });
  });

  test("Solve a puzzle with invalid characters: POST request to /api/solve", () => {
    const invalidPuzzle =
      "p.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: invalidPuzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        const { error } = res.body;
        assert.equal(error, `Invalid characters in puzzle`);
      });
  });

  test("Solve a puzzle with incorrect length: POST request to /api/solve", () => {
    const invalidPuzzle =
      ".5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";

    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: invalidPuzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        const { error } = res.body;
        assert.equal(error, `Expected puzzle to be 81 characters long`);
      });
  });

  test("Solve a puzzle that cannot be solved: POST request to /api/solve", () => {
    const invalidPuzzle =
      "145..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: invalidPuzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        const { error } = res.body;
        assert.equal(error, `Puzzle cannot be solved`);
      });
  });

  test("Check a puzzle placement with all fields: POST request to /api/check", () => {
    const puzzle =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    const coordinate = "A1";
    const value = 7;
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle, coordinate, value })
      .end((err, res) => {
        assert.equal(res.status, 200);
        const { valid } = res.body;
        assert.isTrue(valid);
      });
  });

  test("Check a puzzle placement with single placement conflict: POST request to /api/check", () => {
    const puzzle =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    const coordinate = "A1";
    const value = 2;
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle, coordinate, value })
      .end((err, res) => {
        assert.equal(res.status, 200);
        const { valid, conflict } = res.body;
        assert.isFalse(valid);
        assert.lengthOf(conflict, 1);
      });
  });

  test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", () => {
    const puzzle =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    const coordinate = "A1";
    const value = 1;
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle, coordinate, value })
      .end((err, res) => {
        assert.equal(res.status, 200);
        const { valid, conflict } = res.body;
        assert.isFalse(valid);
        assert.lengthOf(conflict, 2);
      });
  });

  test("Check a puzzle placement with all placement conflicts: POST request to /api/check", () => {
    const puzzle =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    const coordinate = "A1";
    const value = 5;
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle, coordinate, value })
      .end((err, res) => {
        assert.equal(res.status, 200);
        const { valid, conflict } = res.body;
        assert.isFalse(valid);
        assert.lengthOf(conflict, 3);
      });
  });

  test("Check a puzzle placement with missing required fields: POST request to /api/check", () => {
    const puzzle = "";
    const coordinate = "";
    const value = "";
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle, coordinate, value })
      .end((err, res) => {
        assert.equal(res.status, 200);
        const { error } = res.body;
        assert.equal(error, `Required field(s) missing`);
      });
  });

  test("Check a puzzle placement with invalid characters: POST request to /api/check", () => {
    const puzzle =
      "P.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    const coordinate = "A3";
    const value = 1;
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle, coordinate, value })
      .end((err, res) => {
        assert.equal(res.status, 200);
        const { error } = res.body;
        assert.equal(error, `Invalid characters in puzzle`);
      });
  });

  test("Check a puzzle placement with incorrect length: POST request to /api/check", () => {
    const puzzle =
      ".9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    const coordinate = "A3";
    const value = 1;
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle, coordinate, value })
      .end((err, res) => {
        assert.equal(res.status, 200);
        const { error } = res.body;
        assert.equal(error, `Expected puzzle to be 81 characters long`);
      });
  });

  test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", () => {
    const puzzle =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    const coordinate = "P3";
    const value = 1;
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle, coordinate, value })
      .end((err, res) => {
        assert.equal(res.status, 200);
        const { error } = res.body;
        assert.equal(error, `Invalid coordinate`);
      });
  });

  test("Check a puzzle placement with invalid placement value: POST request to /api/check", () => {
    const puzzle =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    const coordinate = "A3";
    const value = 10;
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle, coordinate, value })
      .end((err, res) => {
        assert.equal(res.status, 200);
        const { error } = res.body;
        assert.equal(error, `Invalid value`);
      });
  });
});
