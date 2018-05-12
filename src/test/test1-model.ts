import { Test1Attr } from ".";
import { AbstractModel, attr, Result } from "..";

export class Test1Model extends AbstractModel {
  public readonly label = "Test 1 Model";

  @attr(Test1Attr)
  // tslint:disable-next-line:member-access
  public attr1!: string;

  @attr(Test1Attr, {
    defaultValue: "a",
  })
  // tslint:disable-next-line:member-access
  public attr2!: string;

  @attr(Test1Attr, {
    nullable: false,
  })
  // tslint:disable-next-line:member-access
  public attr3!: string;

  @attr(Test1Attr, {
    args: [true],
  })
  // tslint:disable-next-line:member-access
  public attr4!: string;

  protected async doValidate(
    nullable: boolean,
    forceEqualityOfAttrs2and3: any,
  ) {
    if (!nullable && this.value === null) {
      return this.fail("Object must be entered");
    }

    if (forceEqualityOfAttrs2and3 && this.attr2 === this.attr3) {
      return this.fail("Attribute 2 and 3 are not equal");
    }

    return this.ok();
  }
}
