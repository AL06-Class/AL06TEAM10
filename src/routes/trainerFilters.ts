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

export function filterTrainers(
  trainers: Trainer[],
  filters: { specialty: string; region: string; career: CareerBand }
): Trainer[] {
  return trainers
    .filter((trainer) => trainer.status === "active")
    .filter((trainer) => !filters.specialty || trainer.specialties.includes(filters.specialty))
    .filter((trainer) => !filters.region || trainer.region === filters.region)
    .filter((trainer) => matchesCareerBand(trainer.careerYears, filters.career));
}

export const RECOMMENDED_COUNT = 4;

export function rankForRecommendation(trainers: Trainer[]): Trainer[] {
  return [...trainers].sort((a, b) => {
    if (a.isCertified !== b.isCertified) return a.isCertified ? -1 : 1;
    return b.careerYears - a.careerYears;
  });
}

// 추천 집합은 전체 활성 트레이너 기준 고정 정렬 결과 — 목록 필터와 무관하게 항상 동일해야
// 목록·프로필 상세의 추천 판정이 일치한다(필터는 "그 외" 리스트에만 적용).
export function getRecommendedTrainers(trainers: Trainer[]): Trainer[] {
  const activeTrainers = trainers.filter((trainer) => trainer.status === "active");
  return rankForRecommendation(activeTrainers).slice(0, RECOMMENDED_COUNT);
}
