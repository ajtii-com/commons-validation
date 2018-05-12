import { newLogicError } from "@ajtii/commons-error";
import { AbstractAttr, Result } from "..";

export class Test1Attr extends AbstractAttr {
  public readonly label = "Test 1 Attribute";

  public validate(nullable: boolean, allowB: boolean = false) {
    if (typeof allowB === "undefined") {
      allowB = false;
    }

    if (typeof allowB !== "boolean") {
      throw newLogicError("$allowB must be a boolean");
    }

    return super.validate(nullable, allowB);
  }

  protected async doValidate(nullable: boolean, allowB: boolean) {
    if (!nullable && this.value === null) {
      return this.fail("Value must be entered");
    }

    if (
      this.value !== null &&
      this.value !== "A" &&
      (!allowB || this.value !== "B")
    ) {
      if (nullable) {
        return this.fail("Value must be null, %s", allowB ? "A or B" : "A");
      } else {
        return this.fail("Value must be %s", allowB ? "A or B" : "A");
      }
    }

    return this.ok();
  }
}
