import { expect } from "chai";
import {
  transformIfAllDepsSet,
  transformIfAllDepsUnset,
  transformIfOneDepSet,
  transformIfOneDepUnset,
} from ".";
import "../test";

describe("transformIfOneDepUnset", () => {
  it("should return $value", () => {
    expect(transformIfOneDepUnset("a", () => "b", {})).to.eq("a");
  });

  it("should return $defaultValue if no $value", () => {
    expect(transformIfOneDepUnset(null, () => "b", {})).to.eq("b");
  });

  it("should return $defaultValue if no $value", () => {
    expect(transformIfOneDepUnset(undefined, () => "b", {})).to.eq("b");
  });

  it("should return $value if $depValues given", () => {
    expect(transformIfOneDepUnset("a", () => "b", { c: "d", e: "f" })).to.eq(
      "a",
    );
  });

  it("should return null if some of $depValues given", () => {
    expect(transformIfOneDepUnset("a", () => "b", { c: "d", e: null })).to.eq(
      null,
    );
  });

  it("should return null if some of $depValues given", () => {
    expect(
      transformIfOneDepUnset("a", () => "b", { c: "d", e: undefined }),
    ).to.eq(null);
  });
});

describe("transformIfAllDepsUnset", () => {
  it("should return $value", () => {
    expect(transformIfAllDepsUnset("a", () => "b", {})).to.eq("a");
  });

  it("should return $defaultValue if no $value", () => {
    expect(transformIfAllDepsUnset(null, () => "b", {})).to.eq("b");
  });

  it("should return $defaultValue if no $value", () => {
    expect(transformIfAllDepsUnset(undefined, () => "b", {})).to.eq("b");
  });

  it("should return $value if $depValues given", () => {
    expect(transformIfAllDepsUnset("a", () => "b", { c: "d", e: "f" })).to.eq(
      "a",
    );
  });

  it("should return $defaultValue if some of $depValues given", () => {
    expect(transformIfAllDepsUnset(null, () => "b", { c: null, e: "f" })).to.eq(
      "b",
    );
  });

  it("should return null if any of $depValues given", () => {
    expect(
      transformIfAllDepsUnset("a", () => "b", { c: null, e: undefined }),
    ).to.eq(null);
  });
});

describe("transformIfOneDepSet", () => {
  it("should return $value", () => {
    expect(transformIfOneDepSet("a", () => "b", {})).to.eq("a");
  });

  it("should return $defaultValue if no $value", () => {
    expect(transformIfOneDepSet(null, () => "b", {})).to.eq("b");
  });

  it("should return $defaultValue if no $value", () => {
    expect(transformIfOneDepSet(undefined, () => "b", {})).to.eq("b");
  });

  it("should return null if $depValues given", () => {
    expect(transformIfOneDepSet("a", () => "b", { c: "d", e: "f" })).to.eq(
      null,
    );
  });

  it("should return null if some of $depValues given", () => {
    expect(transformIfOneDepSet("a", () => "b", { c: "d", e: null })).to.eq(
      null,
    );
  });

  it("should return $defaultValue if any of $depValues given", () => {
    expect(
      transformIfOneDepSet(null, () => "b", { c: null, e: undefined }),
    ).to.eq("b");
  });
});

describe("transformIfAllDepsSet", () => {
  it("should return $value", () => {
    expect(transformIfAllDepsSet("a", () => "b", {})).to.eq("a");
  });

  it("should return $defaultValue if no $value", () => {
    expect(transformIfAllDepsSet(null, () => "b", {})).to.eq("b");
  });

  it("should return $defaultValue if no $value", () => {
    expect(transformIfAllDepsSet(undefined, () => "b", {})).to.eq("b");
  });

  it("should return null if $depValues given", () => {
    expect(transformIfAllDepsSet("a", () => "b", { c: "d", e: "f" })).to.eq(
      null,
    );
  });

  it("should return $defaultValue if some of $depValues given", () => {
    expect(transformIfAllDepsSet(null, () => "b", { c: null, e: "f" })).to.eq(
      "b",
    );
  });

  it("should return $value if any of $depValues given", () => {
    expect(
      transformIfAllDepsSet("a", () => "b", { c: null, e: undefined }),
    ).to.eq("a");
  });
});
