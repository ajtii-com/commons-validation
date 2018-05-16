import { AbstractModel } from "./abstract-model";
import { IAttrConstructor, IModelConstructor } from "./interfaces";
import { IModel, IPartialAttrOptions } from "./types";

export function attr(
  type: IAttrConstructor | IModelConstructor<any>,
  label: string,
  options: IPartialAttrOptions = {},
) {
  return (model: IModel, name: string) => {
    return model.defineAttr(name, type, label, options);
  };
}
