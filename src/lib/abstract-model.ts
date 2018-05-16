import { Env, Side } from "@ajtii/commons-env";
import { newLogicError } from "@ajtii/commons-error";
import {
  IAttrConstructor,
  IAttrDef,
  IAttrDefs,
  IModelConstructor,
} from "./interfaces";
import { isAttrType } from "./predications";
import { RawModel } from "./raw-model";
import { Result } from "./result";
import { transformIfOneDepUnset } from "./transformators";
import { IModel, IPartialAttrOptions, IReadonlyAttrDefs } from "./types";

export abstract class AbstractModel {
  public static readonly classType: "model" = "model";

  private readonly _attrDefs?: IAttrDefs;

  private readonly isProto = false;

  public constructor(private readonly model: RawModel) {}

  public defineAttr(
    name: string,
    type: IAttrConstructor | IModelConstructor<any>,
    label: string,
    options: IPartialAttrOptions = {},
  ) {
    if (this.isProto === false) {
      throw newLogicError("You can define the attribute on prototype only");
    }

    if (!this._attrDefs) {
      // @ts-ignore: menitelne len na prototype (this), vsade inde readonly
      this._attrDefs = {};
    }

    if (typeof this._attrDefs[name] !== "undefined") {
      throw newLogicError("The attribute is already defined");
    }

    this._attrDefs[name] = {
      type,
      label,
      nullable: options.nullable || false,
      defaultValue:
        typeof options.defaultValue === "undefined"
          ? isAttrType(type)
            ? null
            : {}
          : options.defaultValue,
      dependsOn: options.dependsOn || [],
      transform: options.transform || transformIfOneDepUnset,
      args: options.args || [],
      help: options.help || "",
      getDefaultValue:
        options.getDefaultValue ||
        function(this: IAttrDef) {
          if (
            isAttrType(this.type) &&
            this.defaultValue !== null &&
            typeof this.defaultValue === "object"
          ) {
            throw newLogicError(
              "You have to define your own $options.getDefaultValue for the attribute because you use an object as the default value",
            );
          }

          return this.defaultValue;
        },
    };

    Object.defineProperty(this, name, {
      configurable: true,
      enumerable: true,
      get(this: IModel) {
        return this.model.get(name);
      },
      set(this: IModel, value: any) {
        return this.model.set(name, value);
      },
    });
  }

  public get attrDefs(): IReadonlyAttrDefs {
    return this._attrDefs || {};
  }

  public get name() {
    return this.model.name;
  }

  public get value() {
    return this.model.value;
  }

  public set value(value: any) {
    this.model.value = value;
  }

  public init() {
    return this.model.init(this);
  }

  public beforeValidate(nullable: boolean, args: ReadonlyArray<any>) {
    return this.model.beforeValidate(() =>
      this.doBeforeValidate(nullable, args),
    );
  }

  public validate(nullable: boolean, args: ReadonlyArray<any>) {
    return this.model.validate(() => this.doValidate(nullable, args));
  }

  public afterValidate(nullable: boolean, args: ReadonlyArray<any>) {
    return this.model.afterValidate(() => this.doAfterValidate(nullable, args));
  }

  public run(args: ReadonlyArray<any> = []) {
    return this.model.run(args);
  }

  protected get env() {
    return this.model.env;
  }

  protected get side() {
    return this.model.side;
  }

  protected async doBeforeValidate(
    nullable: boolean,
    args: ReadonlyArray<any>,
  ): Promise<void> {
    return;
  }

  protected abstract async doValidate(
    nullable: boolean,
    args: ReadonlyArray<any>,
  ): Promise<Result>;

  protected async doAfterValidate(
    nullable: boolean,
    args: ReadonlyArray<any>,
  ): Promise<void> {
    return;
  }

  protected fail(msg: string, ...args: any[]) {
    return this.model.fail(msg, ...args);
  }

  protected failWithPath(
    path: string | number | Array<string | number>,
    msg: string,
    ...args: any[]
  ) {
    return this.model.failWithPath(path, msg, ...args);
  }

  protected ok() {
    return this.model.ok();
  }
}
