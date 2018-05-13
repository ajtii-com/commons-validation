import { IModel, IModelConstructor, RawModel } from "..";

export interface ITest100ModelConstructor
  extends IModelConstructor<ITest100Model> {}

export interface ITest100Model extends IModel {
  test: string;
}
