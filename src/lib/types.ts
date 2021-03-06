import { AbstractAttr } from "./abstract-attr";
import { AbstractModel } from "./abstract-model";
import { IAttrDefs, IAttrOptions, IDepValues, IFail } from "./interfaces";
import { Result } from "./result";

export type IPartialAttrOptions = Partial<IAttrOptions>;

export type IReadonlyAttrDefs = Readonly<IAttrDefs>;

export type IReadonlyDepValues = Readonly<IDepValues>;

export type IReadonlyFails = ReadonlyArray<IFail>;

export type Transformator = (
  value: any,
  defaultValue: () => any,
  depValues: IReadonlyDepValues,
) => any;

export type IAttr = AbstractAttr;

export type AttrType = typeof AbstractAttr;

export type Hook = () => PromiseLike<void>;

export type Validator = () => PromiseLike<Result>;

export type IModel = AbstractModel;

export type ModelType = typeof AbstractModel;
