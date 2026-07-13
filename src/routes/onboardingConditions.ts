import type { CareerBand, CertFilter, EmploymentFilter, OnboardingConditions } from "./trainerFilters";
import { ONBOARDING_DRAFT_KEY } from "./onboardingDraft";

interface OnboardingDraftShape {
  specialties?: string[];
  region?: string;
  career?: CareerBand;
  cert?: CertFilter;
  employment?: EmploymentFilter;
}

// 목록(Trainers.tsx)과 상세(TrainerDetail.tsx)가 동일하게 호출해 추천 판정을 일치시키는
// 공용 헬퍼. 온보딩 draft가 필터와 동일 스키마(specialties·region·career·cert·employment)로
// 저장되므로 별도 매핑 없이 그대로 읽는다. draft가 없거나 파싱 실패하면 null(호출부에서 fallback).
export function loadOnboardingConditions(): OnboardingConditions | null {
  if (typeof localStorage === "undefined") return null;

  const raw = localStorage.getItem(ONBOARDING_DRAFT_KEY);
  if (!raw) return null;

  let draft: OnboardingDraftShape;
  try {
    draft = JSON.parse(raw);
  } catch {
    return null;
  }

  return {
    specialties: Array.isArray(draft.specialties) ? draft.specialties : [],
    region: typeof draft.region === "string" ? draft.region : "",
    career: draft.career ?? "",
    cert: draft.cert ?? "",
    employment: draft.employment ?? "",
  };
}

// 필터(Trainers.tsx)에서 조건이 바뀔 때 온보딩 draft에도 같은 조건을 반영하는 공용 헬퍼 —
// 필터와 온보딩이 항상 같은 조건을 가리키는 단일 소스가 되게 한다. 센터정보(센터명·유형·
// 트레이너 수)는 draft에 이미 있으면 그대로 보존하고 조건 필드만 덮어쓴다.
export function saveConditionsToDraft(conditions: OnboardingConditions): void {
  if (typeof localStorage === "undefined") return;

  const raw = localStorage.getItem(ONBOARDING_DRAFT_KEY);
  let existing: Record<string, unknown> = {};
  if (raw) {
    try {
      existing = JSON.parse(raw);
    } catch {
      existing = {};
    }
  }

  localStorage.setItem(ONBOARDING_DRAFT_KEY, JSON.stringify({ ...existing, ...conditions }));
}
