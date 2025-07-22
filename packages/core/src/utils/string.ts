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
