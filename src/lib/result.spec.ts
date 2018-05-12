import { expect } from "chai";
import { IFail, Result } from ".";
import "../test";

describe("Result", () => {
  let r: Result;

  beforeEach(() => {
    r = new Result();

    expect(r.hasFails).to.eq(false);
  });

  describe("fromResponse", () => {
    it("should set fails when they are there", () => {
      r.fromResponse({ _validationFails: ["fails..."], x: 42 });

      expect(r.hasFails).to.eq(true);
    });

    it("should not set fails when they are not there", () => {
      r.fromResponse({ x: 42 });

      expect(r.hasFails).to.eq(false);
    });

    it("should not set fails when any other value given", () => {
      r.fromResponse(42);

      expect(r.hasFails).to.eq(false);
    });
  });

  describe("failsFor", () => {
    beforeEach(() => {
      r.fail(["a", "b", 0], "val1", "msg1");
      r.fail(["a", "b", 1], "val2", "msg2");
      r.fail(["a", "b"], "val3", "msg3", 11, 42);
      r.fail(["b", "c"], "val4", "msg4");
      r.fail(["b", "c"], "val5", "msg5", null);
      r.fail(["a"], "val6", "msg6");
    });

    it("should return fail with exact path", () => {
      const fails = r.failsFor("a", "b");

      expect(fails).to.have.lengthOf(1);

      expect(fails[0]).to.deep.eq({
        path: ["a", "b"],
        value: "val3",
        msg: "msg3",
        args: [11, 42],
      });
    });

    it("should return fails with exact path", () => {
      const fails = r.failsFor("b", "c");

      expect(fails).to.have.lengthOf(2);

      expect(fails[0]).to.deep.eq({
        path: ["b", "c"],
        value: "val4",
        msg: "msg4",
        args: [],
      });

      expect(fails[1]).to.deep.eq({
        path: ["b", "c"],
        value: "val5",
        msg: "msg5",
        args: [null],
      });
    });

    it("should return no fail when exact path does not exist", () => {
      const fails = r.failsFor("x", "y");

      expect(fails).to.have.lengthOf(0);
    });
  });

  describe("failsStartingWith", () => {
    beforeEach(() => {
      r.fail(["a", "b", 0], "val1", "msg1");
      r.fail(["a", "b", 1], "val2", "msg2");
      r.fail(["a", "b"], "val3", "msg3", 11, 42);
      r.fail(["b", "c"], "val4", "msg4");
      r.fail(["b", "c"], "val5", "msg5", null);
      r.fail(["a"], "val6", "msg6");
    });

    it("should return fails that starts with given path", () => {
      const fails = r.failsStartingWith("a", "b");

      expect(fails).to.have.lengthOf(3);

      expect(fails[0]).to.deep.eq({
        path: ["a", "b", 0],
        value: "val1",
        msg: "msg1",
        args: [],
      });

      expect(fails[1]).to.deep.eq({
        path: ["a", "b", 1],
        value: "val2",
        msg: "msg2",
        args: [],
      });

      expect(fails[2]).to.deep.eq({
        path: ["a", "b"],
        value: "val3",
        msg: "msg3",
        args: [11, 42],
      });
    });

    it("should return no fail when path does not exist", () => {
      const fails = r.failsStartingWith("x", "y");

      expect(fails).to.have.lengthOf(0);
    });
  });

  describe("append", () => {
    it("should append given result", () => {
      r.fromResponse({ _validationFails: ["modelFail"] });

      const r2 = new Result();

      r2.fromResponse({ _validationFails: ["attrFail"] });

      r.append(r2);

      expect(r.fails).to.deep.eq(["modelFail", "attrFail"]);
    });
  });

  describe("forModel", () => {
    it("should change the result according to model definition", () => {
      r.fromResponse({ _validationFails: [{ path: ["a", "z"] }] });

      r.forModel("x", "y");

      expect(r.fails).to.deep.eq([{ path: ["x", "y", "z"] }]);
    });
  });
});
