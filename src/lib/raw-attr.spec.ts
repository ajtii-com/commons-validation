import { expect } from "chai";
import { createStubInstance, SinonStubbedInstance } from "sinon";
import { IAttr, IObjectProvider, ObjectFactory, RawAttr } from ".";
import "../test";

describe("RawAttr", () => {
  let objFact: ObjectFactory & SinonStubbedInstance<ObjectFactory>;
  let objProv: IObjectProvider;
  let attr: RawAttr;

  beforeEach(() => {
    objFact = createStubInstance(ObjectFactory);
    objProv = {} as IObjectProvider;
    attr = new RawAttr(objFact, objProv);
  });

  describe("name", () => {
    it("should return name in lowercase", () => {
      attr.init({
        constructor: {
          name: "TestAttr",
        },
      } as IAttr);

      expect(attr.name).to.eq("test");
    });

    it("should return name in lowercase", () => {
      attr.init({
        constructor: {
          name: "TestAt",
        },
      } as IAttr);

      expect(attr.name).to.eq("testAt");
    });
  });
});
