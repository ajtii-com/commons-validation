import { expect } from "chai";
import {
  createStubInstance,
  match,
  SinonSpy,
  SinonStubbedInstance,
  spy,
  stub,
} from "sinon";
import {
  AbstractModel,
  AttrTree,
  IAttr,
  IModel,
  IObjectProvider,
  ObjectFactory,
  RawModel,
  Result,
} from ".";
import { Test1Attr, Test1Model } from "../test";

describe("RawModel", () => {
  let tree: AttrTree & SinonStubbedInstance<AttrTree>;
  let objFact: ObjectFactory & SinonStubbedInstance<ObjectFactory>;
  let objProv: IObjectProvider;
  let rawModel: RawModel;
  let model: IModel & SinonStubbedInstance<IModel>;

  beforeEach(() => {
    tree = createStubInstance(AttrTree);
    objFact = createStubInstance(ObjectFactory);
    objProv = {} as IObjectProvider;
    rawModel = new RawModel(tree, objFact, objProv);
    model = createStubInstance(AbstractModel);
  });

  describe("init", () => {
    it("should init model", () => {
      objFact.newAttrOf.returns("attr");
      objFact.newModelOf.returns("model");

      stub(model, "attrDefs").value({
        a: {
          type: Test1Attr,
          dependsOn: ["m"],
          getDefaultValue() {
            return "attr default";
          },
        },
        m: {
          type: Test1Model,
          getDefaultValue() {
            return "model default";
          },
        },
      });

      rawModel.init(model);

      expect(rawModel.value).to.eq(model);

      expect(objFact.newAttrOf.calledOnceWith(Test1Attr, "attr default")).to.eq(
        true,
      );

      expect(
        objFact.newModelOf.calledOnceWith(Test1Model, "model default"),
      ).to.eq(true);

      expect(tree.define.calledTwice).to.eq(true);

      expect(tree.define.calledWith("a", "attr")).to.eq(true);

      expect(tree.define.calledWith("m", "model")).to.eq(true);

      expect(tree.defineDep.calledTwice).to.eq(true);

      expect(tree.defineDep.calledWith("a", "m")).to.eq(true);

      expect(tree.defineDep.calledWith("m")).to.eq(true);
    });
  });

  describe("get name", () => {
    it("should return name in lowercase", () => {
      rawModel.init({
        constructor: {
          name: "TestModel",
        },
      } as IModel);

      expect(rawModel.name).to.eq("test");
    });

    it("should return name in lowercase", () => {
      rawModel.init({
        constructor: {
          name: "TestMod",
        },
      } as IModel);

      expect(rawModel.name).to.eq("testMod");
    });
  });

  describe("set value", () => {
    it("should set value to null when null assigned", () => {
      rawModel.value = null;

      expect(rawModel.value).to.eq(null);
    });

    it("should set value to null when undefined assigned", () => {
      rawModel.value = undefined;

      expect(rawModel.value).to.eq(null);
    });

    it("should set value to instance of the model when any assigned", () => {
      stub(model, "attrDefs").value({
        a: {
          type: Test1Attr,
          getDefaultValue() {
            return "a default";
          },
        },
      });

      rawModel.init(model);

      const a: any = {};

      tree.get.withArgs("a").returns(a);

      rawModel.value = 42;

      expect(rawModel.value).to.eq(model);

      expect(a.value).to.eq("a default");
    });

    it("should set value to instance of the model when object assigned", () => {
      stub(model, "attrDefs").value({
        a: {
          type: Test1Attr,
          getDefaultValue() {
            return "a default";
          },
        },
        b: {
          type: Test1Model,
          getDefaultValue() {
            return "b default";
          },
        },
      });

      rawModel.init(model);

      const a: any = {};
      const b: any = {};

      tree.get.withArgs("a").returns(a);
      tree.get.withArgs("b").returns(b);

      rawModel.value = { a: 8 };

      expect(rawModel.value).to.eq(model);

      expect(a.value).to.eq(8);

      expect(b.value).to.eq("b default");
    });
  });

  describe("beforeValidate", () => {
    it("should transform attribute values, run attribute hooks and run given hook finally", (done) => {
      const aTransfStub = stub().returns(null);
      const bTransfStub = stub().returns("b");

      stub(model, "attrDefs").value({
        a: {
          type: Test1Attr,
          nullable: true,
          dependsOn: ["b"],
          transform: aTransfStub,
          args: [42],
          getDefaultValue() {
            return "a default";
          },
        },
        b: {
          type: Test1Attr,
          nullable: false,
          dependsOn: [],
          transform: bTransfStub,
          getDefaultValue() {
            return "b default";
          },
        },
      });

      rawModel.init(model);

      const aBvSpy = spy();
      const bBvSpy = spy();
      const a: any = { value: "a", beforeValidate: aBvSpy };
      const b: any = { value: null, beforeValidate: bBvSpy };

      tree.names.returns(["b", "a"]);
      tree.get.withArgs("a").returns(a);
      tree.get.withArgs("b").returns(b);

      const hookSpy = spy();

      rawModel
        .beforeValidate(hookSpy)
        .then(() => {
          expect(
            aTransfStub.calledOnceWith(
              "a",
              match.func,
              // transformed from null to b
              match.has("b", "b"),
            ),
          ).to.eq(true);

          expect(a.value).to.eq(null);

          expect(aBvSpy.calledOnceWith(true, [42])).to.eq(true);

          expect(bTransfStub.calledOnceWith(null, match.func, match({}))).to.eq(
            true,
          );

          expect(b.value).to.eq("b");

          expect(bBvSpy.calledOnceWith(false)).to.eq(true);

          expect(hookSpy.calledOnce).to.eq(true);

          done();
        })
        .catch(done);
    });

    it("should run given hook only when value of the model is null", (done) => {
      rawModel.value = null;

      expect(rawModel.value).to.eq(null);

      rawModel
        .beforeValidate(async () => {
          return;
        })
        .then(() => {
          expect(tree.names.notCalled).to.eq(true);

          done();
        })
        .catch(done);
    });
  });

  describe("validate", () => {
    it("should run attribute validators and given validator finally", (done) => {
      stub(model, "attrDefs").value({
        a: {
          type: Test1Attr,
          nullable: true,
          args: [42],
          getDefaultValue() {
            return "a default";
          },
        },
        b: {
          type: Test1Attr,
          nullable: false,
          getDefaultValue() {
            return "b default";
          },
        },
      });

      rawModel.init(model);

      const aRes: Result & SinonStubbedInstance<Result> = createStubInstance(
        Result,
      );
      const bRes: Result & SinonStubbedInstance<Result> = createStubInstance(
        Result,
      );

      aRes.forModel.returnsThis();
      bRes.forModel.returnsThis();

      const aValidateStub = stub().resolves(aRes);
      const bValidateStub = stub().resolves(bRes);
      const a: any = { validate: aValidateStub };
      const b: any = { validate: bValidateStub };

      tree.names.returns(["b", "a"]);
      tree.get.withArgs("a").returns(a);
      tree.get.withArgs("b").returns(b);

      const res: Result & SinonStubbedInstance<Result> = createStubInstance(
        Result,
      );
      const validateStub = stub().resolves(res);

      // hack
      stub(rawModel, "name").get(() => "x");

      rawModel
        .validate(validateStub)
        .then(() => {
          expect(aValidateStub.calledOnceWith(true, [42])).to.eq(true);

          expect(aRes.forModel.calledOnceWith("x", "a")).to.eq(true);

          expect(bValidateStub.calledOnceWith(false)).to.eq(true);

          expect(bRes.forModel.calledOnceWith("x", "b")).to.eq(true);

          expect(validateStub.calledOnce).to.eq(true);

          expect(res.append.calledTwice).to.eq(true);

          expect(res.append.calledWith(bRes)).to.eq(true);

          expect(res.append.calledWith(aRes)).to.eq(true);

          done();
        })
        .catch(done);
    });

    it("should run given hook only when value of the model is null", (done) => {
      rawModel.value = null;

      expect(rawModel.value).to.eq(null);

      rawModel
        .validate(async () => createStubInstance(Result))
        .then(() => {
          expect(tree.names.notCalled).to.eq(true);

          done();
        })
        .catch(done);
    });
  });

  describe("afterValidate", () => {
    it("should run attribute hooks and given hook finally", (done) => {
      stub(model, "attrDefs").value({
        a: {
          type: Test1Attr,
          nullable: true,
          args: [42],
          getDefaultValue() {
            return "a default";
          },
        },
        b: {
          type: Test1Attr,
          nullable: false,
          getDefaultValue() {
            return "b default";
          },
        },
      });

      rawModel.init(model);

      const aAvSpy = spy();
      const bAvSpy = spy();
      const a: any = { afterValidate: aAvSpy };
      const b: any = { afterValidate: bAvSpy };

      tree.names.returns(["b", "a"]);
      tree.get.withArgs("a").returns(a);
      tree.get.withArgs("b").returns(b);

      const hookSpy = spy();

      rawModel
        .afterValidate(hookSpy)
        .then(() => {
          expect(aAvSpy.calledOnceWith(true, [42])).to.eq(true);

          expect(bAvSpy.calledOnceWith(false)).to.eq(true);

          expect(hookSpy.calledOnce).to.eq(true);

          done();
        })
        .catch(done);
    });

    it("should run given hook only when value of the model is null", (done) => {
      rawModel.value = null;

      expect(rawModel.value).to.eq(null);

      rawModel
        .afterValidate(async () => {
          return;
        })
        .then(() => {
          expect(tree.names.notCalled).to.eq(true);

          done();
        })
        .catch(done);
    });
  });
});
