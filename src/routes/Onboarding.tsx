import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { REGION_OPTIONS, SPECIALTY_OPTIONS } from "../data/trainers";
import ChipGroup from "../components/ChipGroup";
import Header from "../components/Header";
import Segmented from "../components/Segmented";
import {
  CERT_FILTER_OPTIONS,
  EMPLOYMENT_FILTER_OPTIONS,
  type CareerBand,
  type CertFilter,
  type EmploymentFilter,
} from "./trainerFilters";
import { ONBOARDING_DRAFT_KEY, loadInitialValue, serializeDraft } from "./onboardingDraft";

type CenterType = "일반 헬스장" | "개인 PT 스튜디오" | "필라테스·기타";

// 온보딩 draft는 필터(Trainers.tsx)와 동일 스키마(specialties·region·career·cert·employment)를
// 그대로 쓴다 — 필터↔온보딩 조건 동기화(단일 소스)를 위해 근사 매핑을 전부 제거했다.
interface OnboardingFormState {
  centerName: string;
  centerType: CenterType;
  currentTrainerCount: string;
  specialties: string[];
  region: string;
  career: CareerBand;
  cert: CertFilter;
  employment: EmploymentFilter;
}

const INITIAL_FORM_STATE: OnboardingFormState = {
  centerName: "",
  centerType: "일반 헬스장",
  currentTrainerCount: "",
  specialties: [],
  region: "",
  career: "",
  cert: "",
  employment: "",
};

// 🐛 회귀 수정(이전 사이클): 마운트 시 localStorage 복원은 useState lazy initializer로
// 동기 수행 — effect 순서 레이스(React.StrictMode 이중 마운트에서 저장 이펙트가 기본값으로
// 덮어쓰는 문제)를 원천 제거. 저장 이펙트만 유지.
function loadInitialForm(): OnboardingFormState {
  return loadInitialValue(ONBOARDING_DRAFT_KEY, INITIAL_FORM_STATE);
}

const CENTER_TYPE_OPTIONS = (["일반 헬스장", "개인 PT 스튜디오", "필라테스·기타"] as CenterType[]).map(
  (option) => ({ value: option, label: option })
);

// 필터 구간(무관/1~3년/4~7년/8년 이상)과 동일한 CareerBand 값 — 온보딩 전용 한글 라벨만 다름
// ("전체" 대신 "무관"). 값 자체는 trainerFilters.ts의 CareerBand와 완전히 동일해 매핑 불필요.
const CAREER_OPTIONS_FOR_ONBOARDING: { value: CareerBand; label: string }[] = [
  { value: "", label: "무관" },
  { value: "junior", label: "1~3년" },
  { value: "mid", label: "4~7년" },
  { value: "senior", label: "8년 이상" },
];

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
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((item) => item !== specialty)
        : [...prev.specialties, specialty],
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
    if (form.specialties.length > 0) params.set("specialty", form.specialties.join(","));
    if (form.region) params.set("region", form.region);
    if (form.career) params.set("career", form.career);
    if (form.cert) params.set("cert", form.cert);
    if (form.employment) params.set("employment", form.employment);

    navigate(`/trainers?${params.toString()}`);
  };

  return (
    <>
      <Header title="채용 조건 설정" />
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
              경력
              <Segmented
                options={CAREER_OPTIONS_FOR_ONBOARDING}
                value={form.career}
                onChange={(value) => setForm((prev) => ({ ...prev, career: value as CareerBand }))}
              />
            </div>

            <div className="flex flex-col gap-1 text-sm text-[#52606d]">
              자격증
              <Segmented
                options={CERT_FILTER_OPTIONS}
                value={form.cert}
                onChange={(value) => setForm((prev) => ({ ...prev, cert: value as CertFilter }))}
              />
            </div>

            <div className="flex flex-col gap-1 text-sm text-[#52606d]">
              고용 형태
              <Segmented
                options={EMPLOYMENT_FILTER_OPTIONS}
                value={form.employment}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, employment: value as EmploymentFilter }))
                }
              />
            </div>

            <div className="flex flex-col gap-1 text-sm text-[#52606d]">
              원하는 전문 분야
              <ChipGroup
                options={SPECIALTY_OPTIONS}
                selected={form.specialties}
                onToggle={toggleSpecialty}
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
    </>
  );
}
