/* eslint-disable @typescript-eslint/no-empty-object-type */
import "@testing-library/jest-dom";
import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

declare module "vitest" {
  interface Matchers<R = unknown>
    extends TestingLibraryMatchers<R, void> {}
}
