import type { CareerBand, CertFilter, EmploymentFilter, OnboardingConditions } from "./trainerFilters";
import { ONBOARDING_DRAFT_KEY } from "./onboardingDraft";

export type CareerRequirement = "무관" | "1년 이상" | "3년 이상";
export type CertificationRequirement = "무관" | "국가공인" | "국제공인";
export type EmploymentTypeRequirement = "정직원" | "프리랜서" | "무관";

// 경력 조건 매핑은 근사치: 온보딩은 "N년 이상"(하한만 있음)이고 필터는 상한이 있는 구간형
// (1~3년/4~7년/8년 이상)이라 정확히 일치하지 않는다(1년 이상→junior, 3년 이상→mid로 하한만 맞춤).
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
