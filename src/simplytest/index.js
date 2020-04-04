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

class TestFunc {
  constructor(fn, fname) {
    this.fn = fn;
    this.fname = fname;
    this.cases = [];
    this.mocks = [];
    return this;
  }

useMocks(...mocked) {
  mocked.forEach(m => {
    if (m instanceof Mock) {
      if (this.mocks.filter(mock => mock.name === m.name).length > 0) {
        throw Error('Cannot register mocks with the same function name.');
      }
      this.mocks.push(m);
    } else {
      throw Error('Unrecognized mock supplied.');
    }
  })
  return this;
}

case(title, parameters, expected) {
  if (arguments.length < 2 || arguments.length > 3) {
    throw Error("Parameters cannot be less than 2 or more than 3.");
  }

  if (typeof title !== "string") {
    throw Error("The 'title' (1st function parameter) must be a string.");
  }
  
  if (expected === undefined) {
    if (typeof parameters === "function") {
      this.cases.push({ fn: parameters, name: title });
    } else {
      throw Error("When you skip 'expected', pass an expression as parameters (2nd function parameter)");
    }
  } else {
    this.cases.push({
      fn: this.fn,
      name: title,
      parameters: parameters,
      expected: expected
    });
  }

  return this;
}

report(name, actual, expected) {
  if (JSON.stringify(actual) === JSON.stringify(expected)) {
    console.log(`✔️ ${this.fname} ${name}`);
  } else {
    console.error(`❌ ${this.fname} ${name}, Expected=${JSON.stringify(expected)}, actual=${JSON.stringify(actual)}`);
  }
}

reportMock() {
  this.mocks.forEach(m => {
    if (m.timesCalled !== m.timesCalledExpected) {
      console.log(`❌ ${m.name}() was called ${m.timesCalled} time(s), but expected ${m.timesCalledExpected} time(s).`);
    }
    if (m.calledWith !== m.parameters) {
      console.log(`❌ ${m.name}() was called with ${m.calledWith}, but expected ${m.parameters}.`);
    }
  });
}

run() {
  this.cases.forEach(t => {
    try {
      if (t.expected !== undefined) {
        this.report(t.name, t.fn(t.parameters), t.expected);
      } else {
        this.report(t.name, t.fn(), true);
      }
    } catch (e) {
      console.error("🔥 ", t.name, e.stack);
    }
  });

  this.reportMock();
}
};

class Mock {
constructor(fn, timesCalledExpected, returnValue, ...parameters) {
  const thisInstance = this;
  const handler = {
    apply: function(target, thisArg, theArguments) {
      thisInstance.tracker.timesCalled++;
      thisInstance.tracker.calledWith = theArguments;
      return returnValue;
    }
  };

  this.tracker = {
    name: fn.name,
    mocked: new Proxy(fn, handler),
    parameters: parameters,
    returnValue: returnValue,
    calledWith: null,
    timesCalled: 0,
    timesCalledExpected: timesCalledExpected
  };
}

get name() {
  return this.tracker.name;
}

get instance() {
  return this.tracker.mocked;
}

get timesCalled() {
  return this.tracker.timesCalled;
}

get timesCalledExpected() {
  return this.tracker.timesCalledExpected;
}

get calledWith() {
  return JSON.stringify(this.tracker.calledWith);
}

get parameters() {
  return JSON.stringify(this.tracker.parameters);
}
}

module.exports.TestFunc = TestFunc;
module.exports.Mock = Mock;