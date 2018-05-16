import { newLogicError, newLogicErrorCausedBy } from "@ajtii/commons-error";
import { DepGraph } from "dependency-graph";
import { AbstractAttr } from "./abstract-attr";
import { AbstractModel } from "./abstract-model";
import { IAttr, IModel } from "./types";

export class AttrTree {
  private readonly tree: DepGraph<IAttr | IModel> = new DepGraph();

  private readonly depMap: { [name: string]: string[] } = {};

  public define(name: string, attr: IAttr | IModel) {
    if (this.has(name)) {
      throw newLogicError("Attribute %s already exists", name);
    }

    this.tree.addNode(name, attr);
    this.depMap[name] = [];
  }

  public defineDep(name: string, ...dependsOn: string[]) {
    if (!this.has(name)) {
      throw newLogicError("Attribute %s does not exist", name);
    }

    for (const depName of dependsOn) {
      if (!this.has(depName)) {
        throw newLogicError(
          "Attribute %s depends on attribute %s which does not exist",
          name,
          depName,
        );
      }

      if (depName === name) {
        throw newLogicError("Attribute %s cannot depend on itself", name);
      }

      if (this.depMap[name].includes(depName)) {
        throw newLogicError(
          "Attribute %s already depends on %s",
          name,
          depName,
        );
      }

      this.tree.addDependency(name, depName);
      this.depMap[name].push(depName);
    }
  }

  public has(name: string) {
    return this.tree.hasNode(name);
  }

  public get(name: string) {
    if (!this.has(name)) {
      throw newLogicError("Attribute %s does not exist", name);
    }

    return this.tree.getNodeData(name);
  }

  public names() {
    try {
      return this.tree.overallOrder();
    } catch (e) {
      throw newLogicErrorCausedBy(e, e.message);
    }
  }
}
