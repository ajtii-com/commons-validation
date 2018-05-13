import {
  AbstractModel,
  IAttrConstructor,
  IModel,
  IModelConstructor,
  IPartialAttrOptions,
} from ".";

export function attr(
  type: IAttrConstructor | IModelConstructor<any>,
  options: IPartialAttrOptions = {},
) {
  return (model: IModel, name: string) => {
    return model.defineAttr(name, type, options);
  };
}
