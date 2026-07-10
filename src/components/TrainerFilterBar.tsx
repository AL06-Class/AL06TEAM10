import { REGION_OPTIONS, SPECIALTY_OPTIONS } from "../data/trainers";
import {
  CAREER_BAND_OPTIONS,
  CERT_FILTER_OPTIONS,
  EMPLOYMENT_FILTER_OPTIONS,
  type CareerBand,
  type CertFilter,
  type EmploymentFilter,
} from "../routes/trainerFilters";
import ChipGroup from "./ChipGroup";
import Segmented from "./Segmented";

interface TrainerFilterBarProps {
  specialties: string[];
  region: string;
  career: CareerBand;
  cert: CertFilter;
  employment: EmploymentFilter;
  onToggleSpecialty: (specialty: string) => void;
  onRegionChange: (value: string) => void;
  onCareerChange: (value: CareerBand) => void;
  onCertChange: (value: CertFilter) => void;
  onEmploymentChange: (value: EmploymentFilter) => void;
  onReset: () => void;
}

export default function TrainerFilterBar({
  specialties,
  region,
  career,
  cert,
  employment,
  onToggleSpecialty,
  onRegionChange,
  onCareerChange,
  onCertChange,
  onEmploymentChange,
  onReset,
}: TrainerFilterBarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-[#d9dee7] bg-white p-4">
      <div className="flex flex-wrap items-end gap-4">
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

        <div className="flex flex-col gap-1 text-sm text-[#52606d]">
          자격증
          <Segmented
            options={CERT_FILTER_OPTIONS}
            value={cert}
            onChange={(value) => onCertChange(value as CertFilter)}
          />
        </div>

        <div className="flex flex-col gap-1 text-sm text-[#52606d]">
          고용 형태
          <Segmented
            options={EMPLOYMENT_FILTER_OPTIONS}
            value={employment}
            onChange={(value) => onEmploymentChange(value as EmploymentFilter)}
          />
        </div>

        <button
          type="button"
          onClick={onReset}
          className="ml-auto rounded border border-[#d9dee7] px-4 py-2 text-sm font-semibold text-[#52606d] hover:bg-surface"
        >
          필터 초기화
        </button>
      </div>

      <div>
        <p className="mb-2 text-sm text-[#52606d]">전문 분야</p>
        <ChipGroup options={SPECIALTY_OPTIONS} selected={specialties} onToggle={onToggleSpecialty} />
      </div>
    </div>
  );
}
