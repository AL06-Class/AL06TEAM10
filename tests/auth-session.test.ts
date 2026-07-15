import assert from "node:assert/strict";
import test from "node:test";
import { getSession, login, logout } from "../src/auth/session.ts";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return Array.from(this.values.keys())[index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

const storage = new MemoryStorage();
Object.defineProperty(globalThis, "localStorage", { configurable: true, value: storage });

test.beforeEach(() => storage.clear());

test("candidate 세션은 canonical role로 저장된다", () => {
  const session = login("candidate", "최영");

  assert.equal(session.role, "candidate");
  assert.equal(getSession()?.role, "candidate");
  assert.equal(getSession()?.name, "최영");
});

test("기존 trainer 세션은 읽을 때 candidate로 정규화된다", () => {
  storage.setItem(
    "mvp.session",
    JSON.stringify({ role: "trainer", name: "기존 사용자", loginAt: "2026-07-15T00:00:00.000Z" })
  );

  assert.equal(getSession()?.role, "candidate");
});

test("로그아웃은 세션을 제거한다", () => {
  login(null, "게스트");
  logout();

  assert.equal(getSession(), null);
});
