import { Env, Side } from "@ajtii/commons-env";
import { IAttr, IModel, RawAttr, RawModel, Result, Transformator } from ".";

export interface IAttrOptions {
  readonly nullable: boolean;

  readonly defaultValue: any;

  readonly dependsOn: ReadonlyArray<string>;

  readonly transform: Transformator;

  readonly args: ReadonlyArray<any>;

  getDefaultValue(): any;
}

export interface IAttrDef extends IAttrOptions {
  readonly type: IAttrConstructor | IModelConstructor;
}

export interface IAttrDefs {
  [name: string]: IAttrDef;
}

export interface IDepValues {
  [attr: string]: any;
}

export interface IAttrConstructor {
  readonly classType: "attr";

  new (attr: RawAttr): IAttr;
}

export interface IModelConstructor {
  readonly classType: "model";

  new (model: RawModel): IModel;
}

export interface IFail {
  readonly path: Array<string | number>;

  readonly value: any;

  readonly msg: string;

  readonly args: ReadonlyArray<any>;
}

export interface IResultResponse {
  readonly _validationFails: IFail[];
}

export interface IObjectProvider {
  readonly env: Env;

  readonly side: Side;
}
