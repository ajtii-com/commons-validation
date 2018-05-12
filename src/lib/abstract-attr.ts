import { Env, Side } from "@ajtii/commons-env";
import { RawAttr, Result } from ".";

export abstract class AbstractAttr {
  public static readonly classType: "attr" = "attr";

  public constructor(private readonly attr: RawAttr) {}

  public init() {
    return this.attr.init(this);
  }

  public get name() {
    return this.attr.name;
  }

  public abstract get label(): string;

  public get help() {
    return "";
  }

  public get value() {
    return this.attr.value;
  }

  public set value(value: any) {
    this.attr.value = value;
  }

  public beforeValidate(nullable: boolean, ...args: any[]) {
    return this.attr.beforeValidate(() =>
      this.doBeforeValidate(nullable, ...args),
    );
  }

  public validate(nullable: boolean, ...args: any[]) {
    return this.attr.validate(() => this.doValidate(nullable, ...args));
  }

  public afterValidate(nullable: boolean, ...args: any[]) {
    return this.attr.afterValidate(() =>
      this.doAfterValidate(nullable, ...args),
    );
  }

  protected get env() {
    return this.attr.env;
  }

  protected get side() {
    return this.attr.side;
  }

  protected async doBeforeValidate(
    nullable: boolean,
    ...args: any[]
  ): Promise<void> {
    return;
  }

  protected abstract async doValidate(
    nullable: boolean,
    ...args: any[]
  ): Promise<Result>;

  protected async doAfterValidate(
    nullable: boolean,
    ...args: any[]
  ): Promise<void> {
    return;
  }

  protected fail(msg: string, ...args: any[]) {
    return this.attr.fail(msg, ...args);
  }

  protected failWithPath(
    path: string | number | Array<string | number>,
    msg: string,
    ...args: any[]
  ) {
    return this.attr.failWithPath(path, msg, ...args);
  }

  protected ok() {
    return this.attr.ok();
  }
}
