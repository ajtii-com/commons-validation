import { Env, Side } from "@ajtii/commons-env";
import { newLogicError } from "@ajtii/commons-error";
import { AbstractAttr } from "./abstract-attr";
import { AbstractModel } from "./abstract-model";
import { AttrTree } from "./attr-tree";
import { IDepValues, IObjectProvider } from "./interfaces";
import { ObjectFactory } from "./object-factory";
import { isAttrType } from "./predications";
import { Result } from "./result";
import { Hook, IModel, Validator } from "./types";

export class RawModel {
  // tslint because of !
  // tslint:disable-next-line:member-access variable-name member-ordering
  private model!: IModel;

  private _value: IModel | null = null;

  public constructor(
    private readonly attrTree: AttrTree,
    private readonly objectFactory: ObjectFactory,
    private readonly objectProvider: IObjectProvider,
  ) {}

  public init(model: IModel) {
    this.model = model;
    this._value = model;

    for (const name in model.attrDefs) {
      if (model.attrDefs.hasOwnProperty(name)) {
        const attrDef = model.attrDefs[name];

        if (isAttrType(attrDef.type)) {
          this.attrTree.define(
            name,
            this.objectFactory.newAttrOf(
              attrDef.type,
              attrDef.getDefaultValue(),
            ),
          );
        } else {
          this.attrTree.define(
            name,
            this.objectFactory.newModelOf(
              attrDef.type,
              attrDef.getDefaultValue(),
            ),
          );
        }
      }
    }

    for (const name in model.attrDefs) {
      if (model.attrDefs.hasOwnProperty(name)) {
        const attrDef = model.attrDefs[name];

        this.attrTree.defineDep(name, ...attrDef.dependsOn);
      }
    }
  }

  public get name() {
    const name = this.model.constructor.name;

    return (
      name.charAt(0).toLowerCase() +
      (name.endsWith("Model") ? name.slice(1, -5) : name.slice(1))
    );
  }

  public get value() {
    return this._value;
  }

  public set value(value: any) {
    if (typeof value === "undefined" || value === null) {
      this._value = null;
    } else {
      this._value = this.model;

      for (const name in this.model.attrDefs) {
        if (this.model.attrDefs.hasOwnProperty(name)) {
          const attrDef = this.model.attrDefs[name];

          this.set(
            name,
            value instanceof Object && name in value
              ? value[name]
              : attrDef.getDefaultValue(),
          );
        }
      }
    }
  }

  public get env() {
    return this.objectProvider.env;
  }

  public get side() {
    return this.objectProvider.side;
  }

  public reset() {
    this.value = {};
  }

  public getAttr(name: string) {
    return this.attrTree.get(name);
  }

  public get(name: string) {
    return this.getAttr(name).value;
  }

  public set(name: string, value: any) {
    this.getAttr(name).value = value;
  }

  public async beforeValidate(run: Hook) {
    if (this._value !== null) {
      for (const name of this.attrTree.names()) {
        const attrDef = this.model.attrDefs[name];
        const attr = this.getAttr(name);
        const depValues: IDepValues = {};

        for (const depName of attrDef.dependsOn) {
          depValues[depName] = this.get(depName);
        }

        attr.value = attrDef.transform(
          attr.value,
          attrDef.getDefaultValue.bind(attrDef),
          depValues,
        );

        await attr.beforeValidate(attrDef.nullable, attrDef.args);
      }
    }

    return run();
  }

  public async validate(validate: Validator) {
    const results: Result[] = [];

    if (this._value !== null) {
      for (const name of this.attrTree.names()) {
        const attrDef = this.model.attrDefs[name];
        const attr = this.getAttr(name);

        const r1 = (await attr.validate(
          attrDef.nullable,
          attrDef.args,
        )).forModel(this.name, name);

        results.push(r1);
      }
    }

    const r2 = await validate();

    results.forEach((r) => r2.append(r));

    return r2;
  }

  public async afterValidate(run: Hook) {
    if (this._value !== null) {
      for (const name of this.attrTree.names()) {
        const attrDef = this.model.attrDefs[name];
        const attr = this.getAttr(name);

        await attr.afterValidate(attrDef.nullable, attrDef.args);
      }
    }

    return run();
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
    path: string | number | ReadonlyArray<string | number>,
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

  public async run(args: ReadonlyArray<any>) {
    await this.model.beforeValidate(false, args);
    const r = await this.model.validate(false, args);
    await this.model.afterValidate(false, args);
    return r;
  }
}
