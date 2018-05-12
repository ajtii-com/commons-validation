import { IModel, IModelConstructor, RawModel } from "..";

export interface ITest100ModelConstructor extends IModelConstructor {
  new (model: RawModel): ITest100Model;
}

export interface ITest100Model extends IModel {
  test: string;
}
