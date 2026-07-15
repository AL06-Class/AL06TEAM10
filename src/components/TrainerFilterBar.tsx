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
    <div className="flowCard filterCard">
      <div className="filterControls">
        <label className="filterField">
          지역
          <select
            value={region}
            onChange={(event) => onRegionChange(event.target.value)}
            className="recruiterInput"
          >
            <option value="">전체</option>
            {REGION_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="filterField">
          경력 구간
          <select
            value={career}
            onChange={(event) => onCareerChange(event.target.value as CareerBand)}
            className="recruiterInput"
          >
            {CAREER_BAND_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="filterField">
          자격증
          <Segmented
            options={CERT_FILTER_OPTIONS}
            value={cert}
            onChange={(value) => onCertChange(value as CertFilter)}
          />
        </div>

        <div className="filterField">
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
          className="secondaryButton filterReset"
        >
          필터 초기화
        </button>
      </div>

      <div className="filterSpecialties">
        <p>전문 분야</p>
        <ChipGroup options={SPECIALTY_OPTIONS} selected={specialties} onToggle={onToggleSpecialty} />
      </div>
    </div>
  );
}
