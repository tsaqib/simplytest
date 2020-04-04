// Problem description: find the integer that appears only once in a list in linear time while others appear exactly twice.

const { TestFunc, Mock } = require("./simplytest");

// Compute: O(n), Space: O(1)
const xor = (nums) => {
  return nums.reduce((acc, curr) => acc ^ curr);
};

new TestFunc(xor, "xor()")
  .case("should find the number when in the beginning", [4,1,2,1,2], 4)
  .case("should find the number when in the end", [1,2,1,2,4], 4)
  .case("should return 0 when none found", f => xor([2,1,2,1]) === 0)
  .run();

// Compute: O(2n), Space: O(2n)
const sumBased = (sum, nums) => {
	// Note that the sum function is actually called twice.
  return 2 * sum(Array.from(new Set(nums))) - sum(nums);
}

// This is a correct implementation, but lets spoil it using its mock
const sum = (nums) => {
  return nums.reduce((acc, curr) => acc + curr, 0);
};

// mock the 'sum' function, return 10 and verify it was run 1-time
const mockedSum = new Mock(sum, 1, 10, [4,1,2,1]);
new TestFunc(sumBased, "sumBased()")
  .useMock(mockedSum)
  .case("should find the number when in the beginning", () => sumBased(mockedSum.instance, [4,1,2,1,2]) === 4)
  .run();
