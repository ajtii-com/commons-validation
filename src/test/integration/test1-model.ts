import { expect } from "chai";
import { Test1Model } from "..";
import { IModel, IObjectProvider, ObjectFactory } from "../..";

describe("Test1Model", () => {
  let objProv: IObjectProvider;
  let objFact: ObjectFactory;

  beforeEach(() => {
    objProv = {} as IObjectProvider;
    objFact = new ObjectFactory(objProv);
  });

  it("tests use case (1)", (done) => {
    const model = objFact.newModelOf(Test1Model, {
      attr1: "B",
      attr4: "A",
    });

    expect(model.attr1).to.eq("B");

    expect(model.attr2).to.eq("A");

    expect(model.attr3).to.eq(null);

    expect(model.attr4).to.eq("A");

    model.attr1 = null;

    expect(model.attr1).to.eq(null);

    model
      .run()
      .then((r) => {
        expect(model.attr1).to.eq(null);

        expect(model.attr2).to.eq("A");

        expect(model.attr3).to.eq(null);

        expect(model.attr4).to.eq(null);

        expect(r.hasFails).to.eq(true);

        expect(r.fails).to.have.lengthOf(2);

        expect(r.failsFor("test1", "attr1")).to.have.lengthOf(1);

        expect(r.failsFor("test1", "attr4")).to.have.lengthOf(1);

        done();
      })
      .catch(done);
  });
});
