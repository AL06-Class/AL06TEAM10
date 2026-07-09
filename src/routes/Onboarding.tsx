import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { REGION_OPTIONS, SPECIALTY_OPTIONS } from "../data/trainers";
import ChipGroup from "../components/ChipGroup";
import Segmented from "../components/Segmented";
import {
  mapCareerRequirementToBand,
  mapCertificationRequirementToFilter,
  mapEmploymentTypeToFilter,
  type CareerRequirement,
  type CertificationRequirement,
  type EmploymentTypeRequirement,
} from "./onboardingConditions";
import { ONBOARDING_DRAFT_KEY, loadInitialValue, serializeDraft } from "./onboardingDraft";

type CenterType = "일반 헬스장" | "개인 PT 스튜디오" | "필라테스·기타";

interface OnboardingFormState {
  centerName: string;
  region: string;
  centerType: CenterType;
  currentTrainerCount: string;
  desiredSpecialties: string[];
  desiredCareer: CareerRequirement;
  desiredCertification: CertificationRequirement;
  employmentType: EmploymentTypeRequirement;
}

const INITIAL_FORM_STATE: OnboardingFormState = {
  centerName: "",
  region: "",
  centerType: "일반 헬스장",
  currentTrainerCount: "",
  desiredSpecialties: [],
  desiredCareer: "무관",
  desiredCertification: "무관",
  employmentType: "무관",
};

// 🐛 회귀 수정(B): 이전에는 "마운트 시 localStorage 복원" 이펙트와 "form 변경마다 저장" 이펙트가
// 분리돼 있었다. 최초 마운트 커밋에서 두 이펙트가 선언 순서대로 실행되는데, 저장 이펙트가
// 복원 이펙트의 setState가 아직 반영되지 않은 "그 순간의 form"(=기본값)을 그대로 localStorage에
// 덮어썼다. React.StrictMode(main.tsx가 앱을 감쌈)의 개발 모드 마운트→이펙트→언마운트→재마운트
// 동작 때문에, 재마운트 시 복원 이펙트가 "이미 기본값으로 덮어써진" localStorage를 읽어 들여
// 실제 저장된 초안이 복원 전에 영구히 사라졌다(정확한 원인, 추정 아님). lazy initializer로
// 마운트 시 동기적으로 복원해 이 레이스를 원천 제거 — 저장 이펙트만 남기고 복원 이펙트는 삭제.
function loadInitialForm(): OnboardingFormState {
  return loadInitialValue(ONBOARDING_DRAFT_KEY, INITIAL_FORM_STATE);
}

const CENTER_TYPE_OPTIONS = (["일반 헬스장", "개인 PT 스튜디오", "필라테스·기타"] as CenterType[]).map(
  (option) => ({ value: option, label: option })
);
const CAREER_REQUIREMENT_OPTIONS = (["무관", "1년 이상", "3년 이상"] as CareerRequirement[]).map(
  (option) => ({ value: option, label: option })
);
const CERTIFICATION_REQUIREMENT_OPTIONS = (
  ["무관", "국가공인", "국제공인"] as CertificationRequirement[]
).map((option) => ({ value: option, label: option }));
const EMPLOYMENT_TYPE_OPTIONS = (["정직원", "프리랜서", "무관"] as EmploymentTypeRequirement[]).map(
  (option) => ({ value: option, label: option })
);

export default function Onboarding() {
  const navigate = useNavigate();
  const [form, setForm] = useState<OnboardingFormState>(loadInitialForm);
  const [errors, setErrors] = useState<{ centerName?: string; region?: string }>({});

  useEffect(() => {
    localStorage.setItem(ONBOARDING_DRAFT_KEY, serializeDraft(form));
  }, [form]);

  const toggleSpecialty = (specialty: string) => {
    setForm((prev) => ({
      ...prev,
      desiredSpecialties: prev.desiredSpecialties.includes(specialty)
        ? prev.desiredSpecialties.filter((item) => item !== specialty)
        : [...prev.desiredSpecialties, specialty],
    }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const nextErrors: { centerName?: string; region?: string } = {};
    if (!form.centerName.trim()) nextErrors.centerName = "센터 이름을 입력해 주세요.";
    if (!form.region) nextErrors.region = "지역을 선택해 주세요.";
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    const params = new URLSearchParams();
    if (form.desiredSpecialties.length > 0) {
      params.set("specialty", form.desiredSpecialties.join(","));
    }
    if (form.region) params.set("region", form.region);

    const careerBand = mapCareerRequirementToBand(form.desiredCareer);
    if (careerBand) params.set("career", careerBand);

    const certFilter = mapCertificationRequirementToFilter(form.desiredCertification);
    if (certFilter) params.set("cert", certFilter);

    const employmentFilter = mapEmploymentTypeToFilter(form.employmentType);
    if (employmentFilter) params.set("employment", employmentFilter);

    navigate(`/trainers?${params.toString()}`);
  };

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <p className="mb-4 text-sm">
        <Link to="/" className="text-primary">
          홈으로 돌아가기
        </Link>
      </p>
      <h1 className="mb-2 text-2xl font-bold text-ink">채용 조건 설정</h1>
      <p className="mb-6 text-sm text-[#52606d]">
        센터 정보와 원하는 트레이너 조건을 입력하면 맞춤 추천을 시작합니다.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <section className="rounded-lg border border-[#d9dee7] bg-white p-6">
          <h2 className="text-base font-bold text-ink">센터 정보</h2>

          <div className="mt-4 flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-sm text-[#52606d]">
              센터 이름
              <input
                type="text"
                value={form.centerName}
                onChange={(event) => setForm((prev) => ({ ...prev, centerName: event.target.value }))}
                className="rounded border border-[#d9dee7] px-3 py-2 text-sm text-ink"
              />
              {errors.centerName && (
                <span className="text-xs text-[#c0392b]">{errors.centerName}</span>
              )}
            </label>

            <label className="flex flex-col gap-1 text-sm text-[#52606d]">
              지역
              <select
                value={form.region}
                onChange={(event) => setForm((prev) => ({ ...prev, region: event.target.value }))}
                className="rounded border border-[#d9dee7] px-3 py-2 text-sm text-ink"
              >
                <option value="">선택해 주세요</option>
                {REGION_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.region && <span className="text-xs text-[#c0392b]">{errors.region}</span>}
            </label>

            <div className="flex flex-col gap-1 text-sm text-[#52606d]">
              센터 유형
              <Segmented
                options={CENTER_TYPE_OPTIONS}
                value={form.centerType}
                onChange={(value) => setForm((prev) => ({ ...prev, centerType: value as CenterType }))}
              />
            </div>

            <label className="flex flex-col gap-1 text-sm text-[#52606d]">
              현재 트레이너 수
              <input
                type="number"
                min={0}
                value={form.currentTrainerCount}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, currentTrainerCount: event.target.value }))
                }
                className="rounded border border-[#d9dee7] px-3 py-2 text-sm text-ink"
              />
            </label>
          </div>
        </section>

        <section className="rounded-lg border border-[#d9dee7] bg-white p-6">
          <h2 className="text-base font-bold text-ink">채용 조건</h2>

          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1 text-sm text-[#52606d]">
              원하는 전문 분야
              <ChipGroup
                options={SPECIALTY_OPTIONS}
                selected={form.desiredSpecialties}
                onToggle={toggleSpecialty}
              />
            </div>

            <div className="flex flex-col gap-1 text-sm text-[#52606d]">
              경력
              <Segmented
                options={CAREER_REQUIREMENT_OPTIONS}
                value={form.desiredCareer}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, desiredCareer: value as CareerRequirement }))
                }
              />
            </div>

            <div className="flex flex-col gap-1 text-sm text-[#52606d]">
              자격증
              <Segmented
                options={CERTIFICATION_REQUIREMENT_OPTIONS}
                value={form.desiredCertification}
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    desiredCertification: value as CertificationRequirement,
                  }))
                }
              />
            </div>

            <div className="flex flex-col gap-1 text-sm text-[#52606d]">
              고용 형태
              <Segmented
                options={EMPLOYMENT_TYPE_OPTIONS}
                value={form.employmentType}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, employmentType: value as EmploymentTypeRequirement }))
                }
              />
            </div>
          </div>
        </section>

        <button
          type="submit"
          className="rounded bg-primary px-4 py-2 text-sm font-semibold text-white"
        >
          트레이너 찾기
        </button>
      </form>
    </main>
  );
}
