import { expect } from "chai";
import {
  AbstractModel,
  RawModel,
  transformIfAllDepsUnset,
  transformIfOneDepUnset,
} from ".";
import {
  createTest100ModelClass,
  ITest100Model,
  ITest100ModelConstructor,
  Test1Attr,
  Test1Model,
} from "../test";

describe("AbstractModel", () => {
  describe("defineAttr", () => {
    let Test100Model: ITest100ModelConstructor;
    let Test100ModelProto: ITest100Model;
    let test100Model: ITest100Model;

    beforeEach(() => {
      Test100Model = createTest100ModelClass();
      Test100ModelProto = Test100Model.prototype;
      test100Model = new Test100Model({
        get(name: string) {
          return "x";
        },
      } as RawModel);
    });

    it("should define an attribute while $type is attr and no $options given", () => {
      Test100ModelProto.defineAttr("test", Test1Attr);

      expect(AbstractModel.prototype.attrDefs).not.to.eq(
        Test100ModelProto.attrDefs,
      );

      expect(test100Model.attrDefs).to.eq(Test100ModelProto.attrDefs);

      expect(Test100ModelProto.attrDefs.test.type).that.eqls(Test1Attr);

      expect(Test100ModelProto.attrDefs.test.nullable).that.eqls(false);

      expect(Test100ModelProto.attrDefs.test.defaultValue).that.eqls(null);

      expect(Test100ModelProto.attrDefs.test.dependsOn).that.is.deep.eq([]);

      expect(Test100ModelProto.attrDefs.test.transform).that.eqls(
        transformIfOneDepUnset,
      );

      expect(Test100ModelProto.attrDefs.test.args).that.is.deep.eq([]);

      expect(Test100ModelProto.attrDefs.test.getDefaultValue()).to.eq(
        Test100ModelProto.attrDefs.test.defaultValue,
      );

      expect(test100Model.test).to.eq("x");
    });

    it("should define an attribute while $type is attr and $options given", () => {
      Test100ModelProto.defineAttr("test", Test1Attr, {
        nullable: true,
        defaultValue: "x",
        dependsOn: ["y"],
        transform: transformIfAllDepsUnset,
        args: ["z", "y", "x"],
        getDefaultValue() {
          return "know nothing";
        },
      });

      expect(Test100ModelProto.attrDefs.test.nullable).that.eqls(true);

      expect(Test100ModelProto.attrDefs.test.defaultValue).that.eqls("x");

      expect(Test100ModelProto.attrDefs.test.dependsOn).that.is.deep.eq(["y"]);

      expect(Test100ModelProto.attrDefs.test.transform).that.eqls(
        transformIfAllDepsUnset,
      );

      expect(Test100ModelProto.attrDefs.test.args).that.is.deep.eq([
        "z",
        "y",
        "x",
      ]);

      expect(Test100ModelProto.attrDefs.test.getDefaultValue()).to.eq(
        "know nothing",
      );
    });

    it("should define an attribute while $type is model and no $options given", () => {
      Test100ModelProto.defineAttr("test", Test1Model);

      expect(Test100ModelProto.attrDefs.test.defaultValue).that.is.deep.eq({});

      expect(Test100ModelProto.attrDefs.test.getDefaultValue()).to.eq(
        Test100ModelProto.attrDefs.test.defaultValue,
      );
    });

    it("should define an attribute while $type is attr and $options.defaultValue is an object", () => {
      Test100ModelProto.defineAttr("test", Test1Attr, {
        defaultValue: { x: 42 },
      });

      expect(() => {
        Test100ModelProto.attrDefs.test.getDefaultValue();
      }).to.throw(/getDefaultValue/);
    });

    it("should throw an error if trying to define an attribute on instance of model", () => {
      expect(() => {
        test100Model.defineAttr("test", Test1Attr);
      }).to.throw(/prototype only/);
    });

    it("should throw an error if trying to define an attribute with existing name", () => {
      Test100ModelProto.defineAttr("test", Test1Attr);

      expect(() => {
        Test100ModelProto.defineAttr("test", Test1Attr);
      }).to.throw(/already defined/);
    });
  });
});
