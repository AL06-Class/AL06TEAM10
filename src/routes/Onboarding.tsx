import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { REGION_OPTIONS, SPECIALTY_OPTIONS } from "../data/trainers";

type CenterType = "일반 헬스장" | "개인 PT 스튜디오" | "필라테스·기타";
type CareerRequirement = "무관" | "1년 이상" | "3년 이상";
type CertificationRequirement = "무관" | "국가공인" | "국제공인";
type EmploymentType = "정직원" | "프리랜서" | "무관";

interface OnboardingFormState {
  centerName: string;
  region: string;
  centerType: CenterType;
  currentTrainerCount: string;
  desiredSpecialties: string[];
  desiredCareer: CareerRequirement;
  desiredCertification: CertificationRequirement;
  employmentType: EmploymentType;
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

export default function Onboarding() {
  const navigate = useNavigate();
  const [form, setForm] = useState<OnboardingFormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<{ centerName?: string; region?: string }>({});

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

    navigate("/trainers");
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

            <fieldset className="flex flex-col gap-1 text-sm text-[#52606d]">
              <legend>센터 유형</legend>
              <div className="mt-1 flex flex-wrap gap-4">
                {(["일반 헬스장", "개인 PT 스튜디오", "필라테스·기타"] as CenterType[]).map(
                  (option) => (
                    <label key={option} className="flex items-center gap-1 text-sm text-ink">
                      <input
                        type="radio"
                        name="centerType"
                        checked={form.centerType === option}
                        onChange={() => setForm((prev) => ({ ...prev, centerType: option }))}
                      />
                      {option}
                    </label>
                  )
                )}
              </div>
            </fieldset>

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
            <fieldset className="flex flex-col gap-1 text-sm text-[#52606d]">
              <legend>원하는 전문 분야</legend>
              <div className="mt-1 flex flex-wrap gap-4">
                {SPECIALTY_OPTIONS.map((option) => (
                  <label key={option} className="flex items-center gap-1 text-sm text-ink">
                    <input
                      type="checkbox"
                      checked={form.desiredSpecialties.includes(option)}
                      onChange={() => toggleSpecialty(option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-1 text-sm text-[#52606d]">
              <legend>경력</legend>
              <div className="mt-1 flex flex-wrap gap-4">
                {(["무관", "1년 이상", "3년 이상"] as CareerRequirement[]).map((option) => (
                  <label key={option} className="flex items-center gap-1 text-sm text-ink">
                    <input
                      type="radio"
                      name="desiredCareer"
                      checked={form.desiredCareer === option}
                      onChange={() => setForm((prev) => ({ ...prev, desiredCareer: option }))}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-1 text-sm text-[#52606d]">
              <legend>자격증</legend>
              <div className="mt-1 flex flex-wrap gap-4">
                {(["무관", "국가공인", "국제공인"] as CertificationRequirement[]).map((option) => (
                  <label key={option} className="flex items-center gap-1 text-sm text-ink">
                    <input
                      type="radio"
                      name="desiredCertification"
                      checked={form.desiredCertification === option}
                      onChange={() =>
                        setForm((prev) => ({ ...prev, desiredCertification: option }))
                      }
                    />
                    {option}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-1 text-sm text-[#52606d]">
              <legend>고용 형태</legend>
              <div className="mt-1 flex flex-wrap gap-4">
                {(["정직원", "프리랜서", "무관"] as EmploymentType[]).map((option) => (
                  <label key={option} className="flex items-center gap-1 text-sm text-ink">
                    <input
                      type="radio"
                      name="employmentType"
                      checked={form.employmentType === option}
                      onChange={() => setForm((prev) => ({ ...prev, employmentType: option }))}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </fieldset>
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
