// MVP 전체 플로우를 빠르게 확인하기 위한 임시 데모 토글입니다.
// 실제 입력 상태로 전환할 때는 이 값을 false로 바꾸면 됩니다.
export const MVP_DEMO_MODE = true;

export function isMvpDemoMode(search?: string): boolean {
  const currentSearch = search ?? (typeof window !== "undefined" ? window.location.search : "");
  const override = new URLSearchParams(currentSearch).get("demo");

  if (override === "0") return false;
  if (override === "1") return true;
  return MVP_DEMO_MODE;
}
