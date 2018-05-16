import { newLogicError } from "@ajtii/commons-error";
import { AbstractAttr, Result } from "..";

export class Test1Attr extends AbstractAttr {
  protected async doValidate(nullable: boolean, [allowB]: ReadonlyArray<any>) {
    if (typeof allowB === "undefined") {
      allowB = false;
    }

    if (typeof allowB !== "boolean") {
      throw newLogicError("$allowB must be a boolean");
    }

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
