import { newLogicError } from "@ajtii/commons-error";
import { IFail, IReadonlyFails, IResultResponse, isResultResponse } from ".";

export class Result {
  private _fails: IFail[] = [];

  public get fails(): IReadonlyFails {
    return this._fails;
  }

  public get hasFails() {
    return this._fails.length > 0;
  }

  public get response(): IResultResponse {
    return { _validationFails: this._fails };
  }

  public fromResponse(response: any) {
    if (this.hasFails) {
      throw newLogicError(
        "You can fill an empty result object from response only",
      );
    }

    if (isResultResponse(response)) {
      this._fails = response._validationFails;
    }
  }

  public fail(
    path: string | ReadonlyArray<string | number>,
    value: any,
    msg: string,
    ...args: any[]
  ) {
    if (Array.isArray(path) && typeof path[0] !== "string") {
      throw newLogicError("Attribute name is required");
    }

    this._fails.push({
      path: Array.isArray(path) ? path : [path],
      value,
      msg,
      args,
    });
  }

  public failsFor(...path: Array<string | number>) {
    const fails: IFail[] = [];

    x: for (const fail of this._fails) {
      if (fail.path.length === path.length) {
        for (const i in path) {
          if (fail.path[i] !== path[i]) {
            continue x;
          }
        }

        fails.push(fail);
      }
    }

    return fails;
  }

  public failsStartingWith(...path: Array<string | number>) {
    const fails: IFail[] = [];

    x: for (const fail of this._fails) {
      if (fail.path.length >= path.length) {
        for (const i in path) {
          if (fail.path[i] !== path[i]) {
            continue x;
          }
        }

        fails.push(fail);
      }
    }

    return fails;
  }

  public append(result: Result) {
    if (result === this) {
      throw newLogicError("Cannot append the same result");
    }

    this._fails = this._fails.concat(result._fails);
  }

  public forModel(name: string, attr: string) {
    for (const fail of this._fails) {
      fail.path.unshift(name);
      fail.path[1] = attr;
    }

    return this;
  }
}
