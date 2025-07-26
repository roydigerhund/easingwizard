import { isNil } from "./values";

// toHumanize("testTest_test-test.test-Test.TEST_testTest") => "Test Test Test Test Test Test TEST Test Test"
export const humanize = (value?: string) =>
  isNil(value)
    ? ""
    : value
        .replace(
          /(?:_|\.|-|–|\/|^)([a-z0-9])/gi,
          (match, group) => (match.length > 1 ? " " : "") + group.toUpperCase(),
        )
        .replace(/([a-z])(?=[A-Z])/g, "$1 ");


export const toScreamingSnakeCase = (value?: string) =>
  isNil(value)
    ? ""
    : value
        .replace(/([a-z])([A-Z])/g, "$1_$2")
        .replace(/[- ]/g, "_")
        .toUpperCase();

export const toCamelCase = (value?: string) =>
  isNil(value)
    ? ""
    : value
        .replace(/[-_ ](.)/g, (_, group) => group.toUpperCase())
        .replace(/[-_ ]/g, "")
        .replace(/^[A-Z]/, (match) => match.toLowerCase());