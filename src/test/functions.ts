import { ITest100Model, ITest100ModelConstructor } from ".";
import { AbstractModel, RawModel } from "..";

export function createTest100ModelClass(): ITest100ModelConstructor {
  class Test100Model extends AbstractModel {
    public readonly label = "Test 100 Model";

    // tslint because of !
    // tslint:disable-next-line:member-access
    public test!: string;

    protected async doValidate() {
      return this.ok();
    }
  }

  return Test100Model;
}
