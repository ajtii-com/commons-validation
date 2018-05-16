import { Env, Side } from "@ajtii/commons-env";
import { AttrTree } from "./attr-tree";
import {
  IAttrConstructor,
  IModelConstructor,
  IObjectProvider,
} from "./interfaces";
import { RawAttr } from "./raw-attr";
import { RawModel } from "./raw-model";
import { Result } from "./result";
import { IAttr, IModel } from "./types";

export class ObjectFactory {
  public constructor(private readonly objectProvider: IObjectProvider) {}

  public newFailResult(
    path: string | ReadonlyArray<string | number>,
    value: any,
    msg: string,
    ...args: any[]
  ) {
    const r = this.newOkResult();
    r.fail(path, value, msg, ...args);
    return r;
  }

  public newOkResult() {
    return new Result();
  }

  public newAttrOf(type: IAttrConstructor, value: any = null): IAttr {
    const attr = new type(new RawAttr(this, this.objectProvider));
    attr.init();
    attr.value = value;
    return attr;
  }

  public newModelOf<T extends IModel>(
    type: IModelConstructor<T>,
    value: any = {},
  ) {
    const model = new type(
      new RawModel(new AttrTree(), this, this.objectProvider),
    );
    model.init();
    model.value = value;
    return model;
  }
}
