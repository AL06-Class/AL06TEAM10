import type { CareerBand, CertFilter, EmploymentFilter, OnboardingConditions } from "./trainerFilters";

export type CareerRequirement = "무관" | "1년 이상" | "3년 이상";
export type CertificationRequirement = "무관" | "국가공인" | "국제공인";
export type EmploymentTypeRequirement = "정직원" | "프리랜서" | "무관";

export const ONBOARDING_DRAFT_KEY = "onboarding-draft";

// 온보딩 경력 옵션(무관/1년 이상/3년 이상)은 필터 구간(무관/1~3년/4~7년/8년 이상)과
// 정확히 일치하지 않는다 — "N년 이상"은 상한이 없는데 필터 밴드는 상한이 있는 구간이라
// 근사 매핑임(1년 이상→junior, 3년 이상→mid로 하한만 맞춤, coder-12부터 유지된 한계).
export function mapCareerRequirementToBand(requirement: CareerRequirement): CareerBand {
  if (requirement === "1년 이상") return "junior";
  if (requirement === "3년 이상") return "mid";
  return "";
}

export function mapCertificationRequirementToFilter(requirement: CertificationRequirement): CertFilter {
  if (requirement === "국가공인") return "national";
  if (requirement === "국제공인") return "international";
  return "";
}

export function mapEmploymentTypeToFilter(type: EmploymentTypeRequirement): EmploymentFilter {
  if (type === "정직원") return "fulltime";
  if (type === "프리랜서") return "freelancer";
  return "";
}

interface OnboardingDraftShape {
  region?: string;
  desiredSpecialties?: string[];
  desiredCareer?: CareerRequirement;
  desiredCertification?: CertificationRequirement;
  employmentType?: EmploymentTypeRequirement;
}

// 목록(Trainers.tsx)과 상세(TrainerDetail.tsx)가 동일하게 호출해 추천 판정을 일치시키는
// 공용 헬퍼. localStorage에 온보딩 draft가 없거나 파싱 실패하면 null(호출부에서 fallback).
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
    specialties: Array.isArray(draft.desiredSpecialties) ? draft.desiredSpecialties : [],
    region: typeof draft.region === "string" ? draft.region : "",
    career: draft.desiredCareer ? mapCareerRequirementToBand(draft.desiredCareer) : "",
    cert: draft.desiredCertification
      ? mapCertificationRequirementToFilter(draft.desiredCertification)
      : "",
    employment: draft.employmentType ? mapEmploymentTypeToFilter(draft.employmentType) : "",
  };
}
