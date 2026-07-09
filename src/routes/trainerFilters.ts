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

export const RECOMMENDED_COUNT = 5;

export function rankForRecommendation(trainers: Trainer[]): Trainer[] {
  return [...trainers].sort((a, b) => {
    if (a.isCertified !== b.isCertified) return a.isCertified ? -1 : 1;
    return b.careerYears - a.careerYears;
  });
}
