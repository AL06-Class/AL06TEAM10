// localStorage 초안 저장/복원 순수 함수 — JSX가 없는 파일로 분리해 node에서 직접
// 라운드트립(저장→복원 동일성) 테스트가 가능하게 함.

export const ONBOARDING_DRAFT_KEY = "onboarding-draft";

export function serializeDraft<T>(value: T): string {
  return JSON.stringify(value);
}

export function parseDraft<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// lazy initializer용: 마운트 시 동기적으로 저장된 값을 복원(없거나 파싱 실패 시 fallback).
export function loadInitialValue<T>(key: string, fallback: T): T {
  if (typeof localStorage === "undefined") return fallback;
  return parseDraft<T>(localStorage.getItem(key)) ?? fallback;
}
