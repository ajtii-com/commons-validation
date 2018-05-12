import { Env, Side } from "@ajtii/commons-env";
import {
  AttrTree,
  IAttr,
  IAttrConstructor,
  IModel,
  IModelConstructor,
  IObjectProvider,
  RawAttr,
  RawModel,
  Result,
} from ".";

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

  public newModelOf(type: IModelConstructor, value: any = {}): IModel {
    const attr = new type(
      new RawModel(new AttrTree(), this, this.objectProvider),
    );
    attr.init();
    attr.value = value;
    return attr;
  }
}
