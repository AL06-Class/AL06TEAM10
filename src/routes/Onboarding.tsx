import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { REGION_OPTIONS, SPECIALTY_OPTIONS } from "../data/trainers";
import ChipGroup from "../components/ChipGroup";
import Segmented from "../components/Segmented";
import {
  CERT_FILTER_OPTIONS,
  EMPLOYMENT_FILTER_OPTIONS,
  type CareerBand,
  type CertFilter,
  type EmploymentFilter,
} from "./trainerFilters";
import { ONBOARDING_DRAFT_KEY, loadInitialValue, serializeDraft } from "./onboardingDraft";
import ProductHeader from "../components/ProductHeader";
import { isMvpDemoMode } from "../demoMode";

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

const DEMO_FORM_STATE: OnboardingFormState = {
  centerName: "강남 코어짐 센터",
  centerType: "일반 헬스장",
  currentTrainerCount: "8",
  specialties: ["웨이트 트레이닝"],
  region: "서울",
  career: "",
  cert: "national",
  employment: "fulltime",
};

// 🐛 회귀 수정(이전 사이클): 마운트 시 localStorage 복원은 useState lazy initializer로
// 동기 수행 — effect 순서 레이스(React.StrictMode 이중 마운트에서 저장 이펙트가 기본값으로
// 덮어쓰는 문제)를 원천 제거. 저장 이펙트만 유지.
function loadInitialForm(): OnboardingFormState {
  if (isMvpDemoMode()) return { ...DEMO_FORM_STATE, specialties: [...DEMO_FORM_STATE.specialties] };
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
  const demoMode = isMvpDemoMode();
  const [form, setForm] = useState<OnboardingFormState>(loadInitialForm);
  const [errors, setErrors] = useState<{ centerName?: string; region?: string }>({});

  useEffect(() => {
    if (demoMode) return;
    localStorage.setItem(ONBOARDING_DRAFT_KEY, serializeDraft(form));
  }, [demoMode, form]);

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
    <div className="appShell">
      <ProductHeader title="채용 조건 설정" />
      <main className="mainSurface recruiterMain recruiterNarrow">
        <p className="pageLinkRow">
          <Link to="/recruiter" className="backLink">
            ← 홈으로 돌아가기
          </Link>
        </p>
        <div className="pageIntro">
          <p className="kicker">채용 시작하기</p>
          <h1>채용 조건 설정</h1>
          <p className="lead">
        센터 정보와 원하는 트레이너 조건을 입력하면 맞춤 추천을 시작합니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="recruiterForm">
          <section className="flowCard recruiterSection">
            <h2 className="sectionTitle">센터 정보</h2>

            <div className="recruiterFormGrid">
            <label className="recruiterField span2">
              센터 이름
              <input
                type="text"
                value={form.centerName}
                onChange={(event) => setForm((prev) => ({ ...prev, centerName: event.target.value }))}
                className="recruiterInput"
              />
              {errors.centerName && (
                <span className="text-xs text-[#c0392b]">{errors.centerName}</span>
              )}
            </label>

            <label className="recruiterField">
              지역
              <select
                value={form.region}
                onChange={(event) => setForm((prev) => ({ ...prev, region: event.target.value }))}
                className="recruiterInput"
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

            <div className="recruiterField span2">
              센터 유형
              <Segmented
                options={CENTER_TYPE_OPTIONS}
                value={form.centerType}
                onChange={(value) => setForm((prev) => ({ ...prev, centerType: value as CenterType }))}
              />
            </div>

            <label className="recruiterField">
              현재 트레이너 수
              <input
                type="number"
                min={0}
                value={form.currentTrainerCount}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, currentTrainerCount: event.target.value }))
                }
                className="recruiterInput"
              />
            </label>
            </div>
          </section>

          <section className="flowCard recruiterSection">
            <h2 className="sectionTitle">채용 조건</h2>

            <div className="recruiterFormGrid">
            <div className="recruiterField span2">
              경력
              <Segmented
                options={CAREER_OPTIONS_FOR_ONBOARDING}
                value={form.career}
                onChange={(value) => setForm((prev) => ({ ...prev, career: value as CareerBand }))}
              />
            </div>

            <div className="recruiterField span2">
              자격증
              <Segmented
                options={CERT_FILTER_OPTIONS}
                value={form.cert}
                onChange={(value) => setForm((prev) => ({ ...prev, cert: value as CertFilter }))}
              />
            </div>

            <div className="recruiterField span2">
              고용 형태
              <Segmented
                options={EMPLOYMENT_FILTER_OPTIONS}
                value={form.employment}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, employment: value as EmploymentFilter }))
                }
              />
            </div>

            <div className="recruiterField span2">
              원하는 전문 분야
              <ChipGroup
                options={SPECIALTY_OPTIONS}
                selected={form.specialties}
                onToggle={toggleSpecialty}
              />
            </div>
            </div>
          </section>

          <button type="submit" className="primaryButton recruiterSubmit">
            트레이너 찾기
          </button>
        </form>
      </main>
    </div>
  );
}
