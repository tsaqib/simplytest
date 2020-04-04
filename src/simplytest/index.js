/*
MIT License

Copyright (c) 2020 Tanzim Saqib

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/**
 * This class tests a function
 *
 * @class TestFunc
 */
class TestFunc {
  /**
   *Creates an instance of TestFunc.
   * @param {Function} fn The function to test
   * @memberof TestFunc
   */
  constructor(fn) {
    this.fn = fn;
    this.fname = fn.name;
    this.cases = [];
    this.mocks = [];
    return this;
  }

  /**
   * Registers the mocks to be used in test run for this TestFunc instance
   *
   * @param {Mock[]} mocks A list of mocks
   * @returns TestFunc
   * @memberof TestFunc
   */
  useMocks(...mocks) {
    mocks.forEach((m) => {
      if (m instanceof Mock) {
        if (this.mocks.filter((mock) => mock.name === m.name).length > 0) {
          throw Error("Cannot register mocks with the same function name.");
        }
        this.mocks.push(m);
      } else {
        throw Error("Unrecognized mock supplied.");
      }
    });

    return this;
  }

  /**
   * This function registers a test case with title, expectation, parameters or a function call
   *
   * @param {string} title The title for the test case
   * @param {*} param The expected value of the test, eg. 25, or a function return value check, eg. f => fn(args) === 0
   * @param {*} params An arbitrary list of arguments for the function under test
   * @returns TestFunc
   * @memberof TestFunc
   */
  case(title, param, params) {
    if (arguments.length < 2) {
      throw Error("Parameters cannot be less than 2.");
    }

    if (typeof title !== "string") {
      throw Error("The 'title' (1st function parameter) must be a string.");
    }

    if (typeof param === "function") {
      this.cases.push({ fn: param, name: title });
    } else {
      this.cases.push({
        fn: this.fn,
        name: title,
        parameters: params,
        expected: param,
      });
		}
		
    return this;
  }

  /**
   * Reports success or failure of a test case
   *
   * @param {string} name The name of the test case
   * @param {*} actual The actual value produced by the test case
   * @param {*} expected The expected value for the test case
   * @memberof TestFunc
   */
  report(name, actual, expected) {
    if (JSON.stringify(actual) === JSON.stringify(expected)) {
      console.log(`✔️ ${this.fname}() ${name}`);
    } else {
      console.error(
        `❌ ${this.fname}() ${name}; expected=${JSON.stringify(
          expected
        )}, actual=${JSON.stringify(actual)}`
      );
    }
  }

  /**
   * Verifies and reports the usage of mocked objects
   *
   * @memberof TestFunc
   */
  reportMock() {
    this.mocks.forEach((m) => {
      if (m.timesCalled !== m.timesCalledExpected) {
        console.log(
          `❌ ${m.name}() was called ${m.timesCalled} time(s), but expected ${m.timesCalledExpected} time(s).`
        );
      }
      if (m.calledWith !== m.parameters) {
        console.log(
          `❌ ${m.name}() was called with ${m.calledWith}, but expected ${m.parameters}.`
        );
      }
    });
  }

  /**
   * The function that invokes all test cases
   *
   * @memberof TestFunc
   */
  run() {
    this.cases.forEach(async (t) => {
      try {
        if (t.expected !== undefined) {
          // This testcase has an expected value
          this.report(t.name, await t.fn(t.parameters), t.expected);
        } else {
          // This testcase is a function value check
          this.report(t.name, await t.fn(), true);
        }
      } catch (e) {
        console.error("🔥 ", t.name, e.stack);
      }
    });

    this.reportMock();
  }
}

/**
 * This class creates mocked functions and tracks the usage
 *
 * @class Mock
 */
class Mock {

  /**
   * Creates an instance of Mock.
   * 
   * @param {Function} fn The function needs to be mocked
   * @param {number} timesCalledExpected Indicates how many times the mocked function is expected to be called
   * @param {*} returnValue Specifies the return value of the mocked function
   * @param {*} parameters Specifies the arguments the mocked function is expected to be called with
   * @memberof Mock
   */
  constructor(fn, timesCalledExpected, returnValue, ...parameters) {
    const thisInstance = this;
    const handler = {
      apply: function (target, thisArg, theArguments) {
        thisInstance.tracker.timesCalled++;
        thisInstance.tracker.calledWith = theArguments;
        return returnValue;
      },
    };

    this.tracker = {
      name: fn.name,
      mocked: new Proxy(fn, handler),
      parameters: parameters,
      returnValue: returnValue,
      calledWith: null,
      timesCalled: 0,
      timesCalledExpected: timesCalledExpected,
    };
  }

  /**
   * The name of the mocked function
   *
   * @readonly
   * @memberof Mock
   */
  get name() {
    return this.tracker.name;
  }

  /**
   * The mocked function instance
   *
   * @readonly
   * @memberof Mock
   */
  get instance() {
    return this.tracker.mocked;
  }

  /**
   * The number of times the mocked function was called
   *
   * @readonly
   * @memberof Mock
   */
  get timesCalled() {
    return this.tracker.timesCalled;
  }

  /**
   * The number of times the mocked function was expected to be called
   *
   * @readonly
   * @memberof Mock
   */
  get timesCalledExpected() {
    return this.tracker.timesCalledExpected;
  }

  /**
   * The argument list of the mocked function was called with
   *
   * @readonly
   * @memberof Mock
   */
  get calledWith() {
    return JSON.stringify(this.tracker.calledWith);
  }

  /**
   * The argument list for the mocked function was expected to be called with
   *
   * @readonly
   * @memberof Mock
   */
  get parameters() {
    return JSON.stringify(this.tracker.parameters);
  }
}

module.exports.TestFunc = TestFunc;
module.exports.Mock = Mock;
