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
      // T_n = n(n+1)/2
      // T_0 = 0
      // T_1 = 1
      // T_2 = 3
      // T_3 = 6
      // T_4 = 10
      // T_5 = 15
      // T_6 = 21
      expect(isTriangular(0)).toBe(true);
      expect(isTriangular(1)).toBe(true);
      expect(isTriangular(3)).toBe(true);
      expect(isTriangular(6)).toBe(true);
      expect(isTriangular(10)).toBe(true);
      expect(isTriangular(15)).toBe(true);
      expect(isTriangular(21)).toBe(true);
      expect(isTriangular(55)).toBe(true); // T_10
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
      // T_100 = 100 * 101 / 2 = 5050
      expect(isTriangular(5050)).toBe(true);
      // T_1000 = 1000 * 1001 / 2 = 500500
      expect(isTriangular(500500)).toBe(true);
    });
  });
});
