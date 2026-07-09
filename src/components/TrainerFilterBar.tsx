import { REGION_OPTIONS, SPECIALTY_OPTIONS } from "../data/trainers";
import type { CareerBand } from "../routes/trainerFilters";
import { CAREER_BAND_OPTIONS } from "../routes/trainerFilters";

interface TrainerFilterBarProps {
  specialty: string;
  region: string;
  career: CareerBand;
  onSpecialtyChange: (value: string) => void;
  onRegionChange: (value: string) => void;
  onCareerChange: (value: CareerBand) => void;
  onReset: () => void;
}

export default function TrainerFilterBar({
  specialty,
  region,
  career,
  onSpecialtyChange,
  onRegionChange,
  onCareerChange,
  onReset,
}: TrainerFilterBarProps) {
  return (
    <div className="flex flex-wrap items-end gap-4 rounded-lg border border-[#d9dee7] bg-white p-4">
      <label className="flex flex-col gap-1 text-sm text-[#52606d]">
        전문 분야
        <select
          value={specialty}
          onChange={(event) => onSpecialtyChange(event.target.value)}
          className="rounded border border-[#d9dee7] px-3 py-2 text-sm text-ink"
        >
          <option value="">전체</option>
          {SPECIALTY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm text-[#52606d]">
        경력 구간
        <select
          value={career}
          onChange={(event) => onCareerChange(event.target.value as CareerBand)}
          className="rounded border border-[#d9dee7] px-3 py-2 text-sm text-ink"
        >
          {CAREER_BAND_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm text-[#52606d]">
        지역
        <select
          value={region}
          onChange={(event) => onRegionChange(event.target.value)}
          className="rounded border border-[#d9dee7] px-3 py-2 text-sm text-ink"
        >
          <option value="">전체</option>
          {REGION_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        onClick={onReset}
        className="rounded border border-[#d9dee7] px-4 py-2 text-sm font-semibold text-[#52606d] hover:bg-surface"
      >
        필터 초기화
      </button>
    </div>
  );
}
