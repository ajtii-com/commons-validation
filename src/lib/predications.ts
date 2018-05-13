import { IAttrConstructor, IModelConstructor, IResultResponse } from ".";

export function isAttrType(
  type: IAttrConstructor | IModelConstructor<any>,
): type is IAttrConstructor {
  return type.classType === "attr";
}

export function isModelType(
  type: IAttrConstructor | IModelConstructor<any>,
): type is IModelConstructor<any> {
  return type.classType === "model";
}

export function isResultResponse(response: any): response is IResultResponse {
  return response && Array.isArray(response._validationFails);
}
