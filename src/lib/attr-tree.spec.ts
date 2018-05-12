import { expect } from "chai";
import { AttrTree, IAttr } from ".";
import "../test";

describe("AttrTree", () => {
  let tree: AttrTree;
  let a: IAttr;
  let b: IAttr;

  beforeEach(() => {
    tree = new AttrTree();
    a = {} as IAttr;
    b = {} as IAttr;
  });

  describe("defineDep", () => {
    it("should define a dependency", () => {
      tree.define("a", a);
      tree.define("b", b);
      tree.defineDep("a", "b");

      expect(tree.names()).to.deep.eq(["b", "a"]);
    });

    it("should throw an error if trying to define already defined dependency", () => {
      tree.define("a", a);
      tree.define("b", b);
      tree.defineDep("a", "b");

      expect(() => {
        tree.defineDep("a", "b");
      }).to.throw(/already depends/);
    });
  });
});
