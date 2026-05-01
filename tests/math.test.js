const { isTriangular, isPerfectSquare } = require("../app.js");

describe("Math Utility Functions", () => {
  describe("isPerfectSquare", () => {
    test("identifies perfect squares", () => {
      expect(isPerfectSquare(0)).toBe(true);
      expect(isPerfectSquare(1)).toBe(true);
      expect(isPerfectSquare(4)).toBe(true);
      expect(isPerfectSquare(9)).toBe(true);
      expect(isPerfectSquare(16)).toBe(true);
      expect(isPerfectSquare(25)).toBe(true);
      expect(isPerfectSquare(100)).toBe(true);
      expect(isPerfectSquare(121)).toBe(true);
    });

    test("identifies non-perfect squares", () => {
      expect(isPerfectSquare(2)).toBe(false);
      expect(isPerfectSquare(3)).toBe(false);
      expect(isPerfectSquare(5)).toBe(false);
      expect(isPerfectSquare(8)).toBe(false);
      expect(isPerfectSquare(10)).toBe(false);
      expect(isPerfectSquare(99)).toBe(false);
    });

    test("handles negative numbers", () => {
      expect(isPerfectSquare(-1)).toBe(false);
      expect(isPerfectSquare(-4)).toBe(false);
      expect(isPerfectSquare(-9)).toBe(false);
    });
  });

  describe("isTriangular", () => {
    test("identifies triangular numbers", () => {
      expect(isTriangular(0)).toBe(true);
      expect(isTriangular(1)).toBe(true);
      expect(isTriangular(3)).toBe(true);
      expect(isTriangular(6)).toBe(true);
      expect(isTriangular(10)).toBe(true);
      expect(isTriangular(15)).toBe(true);
      expect(isTriangular(21)).toBe(true);
      expect(isTriangular(55)).toBe(true);
    });

    test("identifies non-triangular numbers", () => {
      expect(isTriangular(2)).toBe(false);
      expect(isTriangular(4)).toBe(false);
      expect(isTriangular(5)).toBe(false);
      expect(isTriangular(7)).toBe(false);
      expect(isTriangular(8)).toBe(false);
      expect(isTriangular(9)).toBe(false);
      expect(isTriangular(11)).toBe(false);
    });

    test("handles negative numbers", () => {
      expect(isTriangular(-1)).toBe(false);
      expect(isTriangular(-3)).toBe(false);
      expect(isTriangular(-6)).toBe(false);
    });

    test("handles large triangular numbers", () => {
      expect(isTriangular(5050)).toBe(true);
      expect(isTriangular(500500)).toBe(true);
    });
  });
});
