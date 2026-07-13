import type { Trainer } from "../data/trainers";

export type CareerBand = "" | "junior" | "mid" | "senior";

export const CAREER_BAND_OPTIONS: { value: CareerBand; label: string }[] = [
  { value: "", label: "전체" },
  { value: "junior", label: "1~3년" },
  { value: "mid", label: "4~7년" },
  { value: "senior", label: "8년 이상" },
];

export function matchesCareerBand(careerYears: number, band: CareerBand): boolean {
  if (band === "junior") return careerYears >= 1 && careerYears <= 3;
  if (band === "mid") return careerYears >= 4 && careerYears <= 7;
  if (band === "senior") return careerYears >= 8;
  return true;
}

export type CertFilter = "" | "national" | "international";

export const CERT_FILTER_OPTIONS: { value: CertFilter; label: string }[] = [
  { value: "", label: "무관" },
  { value: "national", label: "국가공인" },
  { value: "international", label: "국제공인" },
];

export type EmploymentFilter = "" | "fulltime" | "freelancer";

export const EMPLOYMENT_FILTER_OPTIONS: { value: EmploymentFilter; label: string }[] = [
  { value: "", label: "무관" },
  { value: "fulltime", label: "정직원" },
  { value: "freelancer", label: "프리랜서" },
];

export interface OnboardingConditions {
  specialties: string[];
  region: string;
  career: CareerBand;
  cert: CertFilter;
  employment: EmploymentFilter;
}

export const EMPTY_CONDITIONS: OnboardingConditions = {
  specialties: [],
  region: "",
  career: "",
  cert: "",
  employment: "",
};

export function filterTrainers(trainers: Trainer[], filters: OnboardingConditions): Trainer[] {
  return trainers
    .filter((trainer) => trainer.status === "active")
    .filter(
      (trainer) =>
        filters.specialties.length === 0 ||
        filters.specialties.every((specialty) => trainer.specialties.includes(specialty))
    )
    .filter((trainer) => !filters.region || trainer.region === filters.region)
    .filter((trainer) => matchesCareerBand(trainer.careerYears, filters.career))
    .filter((trainer) => !filters.cert || trainer.certificationLevels.includes(filters.cert))
    .filter(
      (trainer) => !filters.employment || trainer.employmentTypes.includes(filters.employment)
    );
}

export const RECOMMENDED_COUNT = 4;

export function rankForRecommendation(trainers: Trainer[]): Trainer[] {
  return [...trainers].sort((a, b) => {
    if (a.isCertified !== b.isCertified) return a.isCertified ? -1 : 1;
    return b.careerYears - a.careerYears;
  });
}

// 추천 집합 = 온보딩 채용조건(conditions)에 부합하는 트레이너 중 상위 RECOMMENDED_COUNT.
// conditions가 없으면(온보딩 미작성) 전체 활성 트레이너 기준으로 fallback — 목록(Trainers.tsx)과
// 상세(TrainerDetail.tsx)가 항상 같은 conditions를 넣어 호출해야 판정이 일치한다.
// 조건 부합 인원이 RECOMMENDED_COUNT 미만이면 부합하는 만큼만 반환(비부합으로 채우지 않음).
export function getRecommendedTrainers(
  trainers: Trainer[],
  conditions?: OnboardingConditions | null
): Trainer[] {
  const matched = filterTrainers(trainers, conditions ?? EMPTY_CONDITIONS);
  return rankForRecommendation(matched).slice(0, RECOMMENDED_COUNT);
}
