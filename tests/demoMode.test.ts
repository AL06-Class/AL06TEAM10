import assert from "node:assert/strict";
import test from "node:test";
import { isMvpDemoMode } from "../src/demoMode.ts";

test("MVP 데모 모드는 기본 활성화되고 URL로 끌 수 있다", () => {
  assert.equal(isMvpDemoMode(""), true);
  assert.equal(isMvpDemoMode("?demo=0"), false);
  assert.equal(isMvpDemoMode("?demo=1"), true);
});
