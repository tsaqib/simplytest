I have been really bored by the amount of boilerplate code we must write and the ceremonies that we must abide by to write simple unit test code for JavaScript programs. Life shouldn't be that hard. Think about clogging your `node_modules` with arbitrary number of test libraries and their dependencies. Therefore, I wrote a small set of classes in a single file that you can drop in your project and start testing your JavaScript programs. No strings attached.

```javascript
// Problem description: find the integer that appears only once in a list in linear time 
// while others appear exactly twice.

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
```

Clone the repository and lets run it. Execute `npm test` or `node index.js`. Here is the output you may expect:

![Output](https://raw.githubusercontent.com/tsaqib/simplytest/master/images/screenshot.png)
