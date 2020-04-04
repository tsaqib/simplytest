- [Introduction](#introduction)
- [Example](#example)
- [API Documentation](#api-documentation)
  - [Classes](#classes)
  - [TestFunc](#testfunc)
    - [new TestFunc()](#new-testfunc)
    - [testFunc.useMocks(...mocks) ⇒](#testfuncusemocksmocks-%e2%87%92)
    - [testFunc.case(title, param, params) ⇒](#testfunccasetitle-param-params-%e2%87%92)
    - [testFunc.report(name, actual, expected)](#testfuncreportname-actual-expected)
    - [testFunc.reportMock()](#testfuncreportmock)
    - [testFunc.run()](#testfuncrun)
    - [TestFunc.TestFunc](#testfunctestfunc)
      - [new TestFunc(fn)](#new-testfuncfn)
  - [Mock](#mock)
    - [new Mock()](#new-mock)
    - [mock.name](#mockname)
    - [mock.instance](#mockinstance)
    - [mock.timesCalled](#mocktimescalled)
    - [mock.timesCalledExpected](#mocktimescalledexpected)
    - [mock.calledWith](#mockcalledwith)
    - [mock.parameters](#mockparameters)
    - [Mock.Mock](#mockmock)
      - [new Mock(fn, timesCalledExpected, returnValue, ...parameters)](#new-mockfn-timescalledexpected-returnvalue-parameters)

# Introduction

Writing a large amount of boilerplate code and the ceremonies that we must abide by to write simple unit test code for JavaScript programs is quite mundane. Life shouldn't be that hard. Think about clogging your `node_modules` with arbitrary number of test libraries and their dependencies. Therefore, a small set of classes was written in a single file that you can drop in your project and start testing your JavaScript programs quickly. No strings attached and no dependencies to add.

# Example

```javascript
// Problem description: find the integer that appears only once in a list in linear time
// while others appear exactly twice. Return 0 when none found.

const { TestFunc, Mock } = require("./simplytest");

// Compute: O(n), Space: O(1)
const xor = (nums) => {
  return nums.reduce((acc, curr) => acc ^ curr);
};

new TestFunc(xor)
  .case("should find the number when in the beginning", 4, [4, 1, 2, 1, 2])
  .case("should find the number when in the end", 4, [1, 2, 1, 2, 4])
  .case("should return 0 when none found", f => xor([2, 1, 2, 1]) === 0)
  .run();

// Compute: O(2n), Space: O(2n)
const sumBased = (sum, nums) => {
  // Note that the sum function is actually called twice.
  return 2 * sum(Array.from(new Set(nums))) - sum(nums);
};

// This is a correct implementation, but lets spoil it using its mock
const sum = (nums) => {
  return nums.reduce((acc, curr) => acc + curr, 0);
};

// mock the 'sum' function, return 10 and verify it was run 1-time
// and expect it to be called with [4,1,2,1]; whcih is wrong of course
const mockedSum = new Mock(sum, 1, 10, [4, 1, 2, 1]); // arbitrary number of parameters
new TestFunc(sumBased)
  .useMocks(mockedSum) // inject arbitrary number of mocks here
  .case(
    "should find the number when in the beginning",
    () => sumBased(mockedSum.instance, [4, 1, 2, 1, 2]) === 4
  )
  .run();
```

Clone the repository and lets run it. Execute `npm test` or `node index.js`. Here is the output you may expect:

![Output](https://raw.githubusercontent.com/tsaqib/simplytest/master/images/screenshot.png)

If your program awaits on a response that may take time, you may find the test result appear in a different order:

![Output](https://raw.githubusercontent.com/tsaqib/simplytest/master/images/screenshot2.png)

# API Documentation

## Classes

<dl>
<dt><a href="#TestFunc">TestFunc</a></dt>
<dd></dd>
<dt><a href="#Mock">Mock</a></dt>
<dd></dd>
</dl>

<a name="TestFunc"></a>

## TestFunc
**Kind**: global class  

* [TestFunc](#TestFunc)
    * [new TestFunc()](#new_TestFunc_new)
    * _instance_
        * [.useMocks(...mocks)](#TestFunc+useMocks) ⇒
        * [.case(title, param, params)](#TestFunc+case) ⇒
        * [.report(name, actual, expected)](#TestFunc+report)
        * [.reportMock()](#TestFunc+reportMock)
        * [.run()](#TestFunc+run)
    * _static_
        * [.TestFunc](#TestFunc.TestFunc)
            * [new TestFunc(fn)](#new_TestFunc.TestFunc_new)

<a name="new_TestFunc_new"></a>

### new TestFunc()
This class tests a function

<a name="TestFunc+useMocks"></a>

### testFunc.useMocks(...mocks) ⇒
Registers the mocks to be used in test run for this TestFunc instance

**Kind**: instance method of [<code>TestFunc</code>](#TestFunc)  
**Returns**: TestFunc  

| Param | Type | Description |
| --- | --- | --- |
| ...mocks | [<code>Array.&lt;Mock&gt;</code>](#Mock) | A list of mocks |

<a name="TestFunc+case"></a>

### testFunc.case(title, param, params) ⇒
This function registers a test case with title, expectation, parameters or a function call

**Kind**: instance method of [<code>TestFunc</code>](#TestFunc)  
**Returns**: TestFunc  

| Param | Type | Description |
| --- | --- | --- |
| title | <code>string</code> | The title for the test case |
| param | <code>\*</code> | The expected value of the test, eg. 25, or a function return value check, eg. f => fn(args) === 0 |
| params | <code>\*</code> | An arbitrary list of arguments for the function under test |

<a name="TestFunc+report"></a>

### testFunc.report(name, actual, expected)
Reports success or failure of a test case

**Kind**: instance method of [<code>TestFunc</code>](#TestFunc)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the test case |
| actual | <code>\*</code> | The actual value produced by the test case |
| expected | <code>\*</code> | The expected value for the test case |

<a name="TestFunc+reportMock"></a>

### testFunc.reportMock()
Verifies and reports the usage of mocked objects

**Kind**: instance method of [<code>TestFunc</code>](#TestFunc)  
<a name="TestFunc+run"></a>

### testFunc.run()
The function that invokes all test cases

**Kind**: instance method of [<code>TestFunc</code>](#TestFunc)  
<a name="TestFunc.TestFunc"></a>

### TestFunc.TestFunc
**Kind**: static class of [<code>TestFunc</code>](#TestFunc)  
<a name="new_TestFunc.TestFunc_new"></a>

#### new TestFunc(fn)
Creates an instance of TestFunc.


| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | The function to test |

<a name="Mock"></a>

## Mock
**Kind**: global class  

* [Mock](#Mock)
    * [new Mock()](#new_Mock_new)
    * _instance_
        * [.name](#Mock+name)
        * [.instance](#Mock+instance)
        * [.timesCalled](#Mock+timesCalled)
        * [.timesCalledExpected](#Mock+timesCalledExpected)
        * [.calledWith](#Mock+calledWith)
        * [.parameters](#Mock+parameters)
    * _static_
        * [.Mock](#Mock.Mock)
            * [new Mock(fn, timesCalledExpected, returnValue, ...parameters)](#new_Mock.Mock_new)

<a name="new_Mock_new"></a>

### new Mock()
This class creates mocked functions and tracks the usage

<a name="Mock+name"></a>

### mock.name
The name of the mocked function

**Kind**: instance property of [<code>Mock</code>](#Mock)  
**Read only**: true  
<a name="Mock+instance"></a>

### mock.instance
The mocked function instance

**Kind**: instance property of [<code>Mock</code>](#Mock)  
**Read only**: true  
<a name="Mock+timesCalled"></a>

### mock.timesCalled
The number of times the mocked function was called

**Kind**: instance property of [<code>Mock</code>](#Mock)  
**Read only**: true  
<a name="Mock+timesCalledExpected"></a>

### mock.timesCalledExpected
The number of times the mocked function was expected to be called

**Kind**: instance property of [<code>Mock</code>](#Mock)  
**Read only**: true  
<a name="Mock+calledWith"></a>

### mock.calledWith
The argument list of the mocked function was called with

**Kind**: instance property of [<code>Mock</code>](#Mock)  
**Read only**: true  
<a name="Mock+parameters"></a>

### mock.parameters
The argument list for the mocked function was expected to be called with

**Kind**: instance property of [<code>Mock</code>](#Mock)  
**Read only**: true  
<a name="Mock.Mock"></a>

### Mock.Mock
**Kind**: static class of [<code>Mock</code>](#Mock)  
<a name="new_Mock.Mock_new"></a>

#### new Mock(fn, timesCalledExpected, returnValue, ...parameters)
Creates an instance of Mock.


| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | The function needs to be mocked |
| timesCalledExpected | <code>number</code> | Indicates how many times the mocked function is expected to be called |
| returnValue | <code>\*</code> | Specifies the return value of the mocked function |
| ...parameters | <code>\*</code> | Specifies the arguments the mocked function is expected to be called with |


