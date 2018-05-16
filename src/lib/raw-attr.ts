import { Env, Side } from "@ajtii/commons-env";
import { IObjectProvider } from "./interfaces";
import { ObjectFactory } from "./object-factory";
import { Result } from "./result";
import { Hook, IAttr, Validator } from "./types";

export class RawAttr {
  // tslint because of !
  // tslint:disable-next-line:member-access variable-name member-ordering
  private attr!: IAttr;

  private _value: any = null;

  public constructor(
    private readonly objectFactory: ObjectFactory,
    private readonly objectProvider: IObjectProvider,
  ) {}

  public init(attr: IAttr) {
    this.attr = attr;
  }

  public get name() {
    const name = this.attr.constructor.name;

    return (
      name.charAt(0).toLowerCase() +
      (name.endsWith("Attr") ? name.slice(1, -4) : name.slice(1))
    );
  }

  public get value() {
    return this._value;
  }

  public set value(value: any) {
    if (typeof value === "undefined") {
      value = null;
    }

    this._value = value;
  }

  public get env() {
    return this.objectProvider.env;
  }

  public get side() {
    return this.objectProvider.side;
  }

  public fail(msg: string, ...args: any[]) {
    return this.objectFactory.newFailResult(
      this.name,
      this._value,
      msg,
      ...args,
    );
  }

  public failWithPath(
    path: string | number | Array<string | number>,
    msg: string,
    ...args: any[]
  ) {
    return this.objectFactory.newFailResult(
      Array.isArray(path) ? [this.name, ...path] : [this.name, path],
      this._value,
      msg,
      ...args,
    );
  }

  public ok() {
    return this.objectFactory.newOkResult();
  }

  public beforeValidate(run: Hook) {
    return run();
  }

  public validate(validate: Validator) {
    return validate();
  }

  public afterValidate(run: Hook) {
    return run();
  }
}
