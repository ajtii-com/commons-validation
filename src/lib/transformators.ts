import { IReadonlyDepValues, Transformator } from "./types";

export const transformIfOneDepUnset: Transformator = (
  value,
  defaultValue,
  depValues,
) => {
  for (const depValue of Object.values(depValues)) {
    if (typeof depValue === "undefined" || depValue === null) {
      return null;
    }
  }

  return typeof value === "undefined" || value === null
    ? defaultValue()
    : value;
};

export const transformIfAllDepsUnset: Transformator = (
  value,
  defaultValue,
  depValues,
) => {
  const depValuesArray = Object.values(depValues);

  if (!depValuesArray.length) {
    return typeof value === "undefined" || value === null
      ? defaultValue()
      : value;
  }

  for (const depValue of depValuesArray) {
    if (typeof depValue !== "undefined" && depValue !== null) {
      return typeof value === "undefined" || value === null
        ? defaultValue()
        : value;
    }
  }

  return null;
};

export const transformIfOneDepSet: Transformator = (
  value,
  defaultValue,
  depValues,
) => {
  for (const depValue of Object.values(depValues)) {
    if (typeof depValue !== "undefined" && depValue !== null) {
      return null;
    }
  }

  return typeof value === "undefined" || value === null
    ? defaultValue()
    : value;
};

export const transformIfAllDepsSet: Transformator = (
  value,
  defaultValue,
  depValues,
) => {
  const depValuesArray = Object.values(depValues);

  if (!depValuesArray.length) {
    return typeof value === "undefined" || value === null
      ? defaultValue()
      : value;
  }

  for (const depValue of depValuesArray) {
    if (typeof depValue === "undefined" || depValue === null) {
      return typeof value === "undefined" || value === null
        ? defaultValue()
        : value;
    }
  }

  return null;
};
