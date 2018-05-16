import { newLogicError } from "@ajtii/commons-error";
import { Test1Attr } from ".";
import { AbstractModel, attr, Result } from "..";

export class Test1Model extends AbstractModel {
  public readonly label = "Test 1 Model";

  @attr(Test1Attr, "Attr 1")
  // tslint:disable-next-line:member-access
  public attr1!: string | null;

  @attr(Test1Attr, "Attr 2", {
    defaultValue: "A",
  })
  // tslint:disable-next-line:member-access
  public attr2!: string | null;

  @attr(Test1Attr, "Attr 3", {
    nullable: true,
  })
  // tslint:disable-next-line:member-access
  public attr3!: string;

  @attr(Test1Attr, "Attr 4", {
    dependsOn: ["attr1"],
    args: [true],
  })
  // tslint:disable-next-line:member-access
  public attr4!: string | null;

  protected async doValidate(
    nullable: boolean,
    [forceEqualityOfAttrs2and3]: ReadonlyArray<any>,
  ) {
    if (typeof forceEqualityOfAttrs2and3 === "undefined") {
      forceEqualityOfAttrs2and3 = false;
    }

    if (typeof forceEqualityOfAttrs2and3 !== "boolean") {
      throw newLogicError("$forceEqualityOfAttrs2and3 must be a boolean");
    }

    if (!nullable && this.value === null) {
      return this.fail("Object must be entered");
    }

    if (forceEqualityOfAttrs2and3 && this.attr2 === this.attr3) {
      return this.fail("Attribute 2 and 3 are not equal");
    }

    return this.ok();
  }
}
