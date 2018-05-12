import { IAttrConstructor, IModelConstructor, IResultResponse } from ".";

export function isAttrType(
  type: IAttrConstructor | IModelConstructor,
): type is IAttrConstructor {
  return type.classType === "attr";
}

export function isModelType(
  type: IAttrConstructor | IModelConstructor,
): type is IModelConstructor {
  return type.classType === "model";
}

export function isResultResponse(response: any): response is IResultResponse {
  return response && Array.isArray(response._validationFails);
}
