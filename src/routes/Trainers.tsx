import { Link, useSearchParams } from "react-router-dom";
import TrainerCard from "../components/TrainerCard";
import TrainerFilterBar from "../components/TrainerFilterBar";
import { trainers } from "../data/trainers";
import {
  filterTrainers,
  getRecommendedTrainers,
  type CareerBand,
  type CertFilter,
  type EmploymentFilter,
} from "./trainerFilters";

function parseSpecialties(raw: string): string[] {
  return raw ? raw.split(",").filter(Boolean) : [];
}

const LIST_GRID_COLS = "grid-cols-[1.2fr_2fr_1fr_0.8fr]";

export default function TrainerListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const specialties = parseSpecialties(searchParams.get("specialty") ?? "");
  const region = searchParams.get("region") ?? "";
  const career = (searchParams.get("career") ?? "") as CareerBand;
  const cert = (searchParams.get("cert") ?? "") as CertFilter;
  const employment = (searchParams.get("employment") ?? "") as EmploymentFilter;

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const toggleSpecialty = (specialty: string) => {
    const nextSpecialties = specialties.includes(specialty)
      ? specialties.filter((item) => item !== specialty)
      : [...specialties, specialty];
    updateParam("specialty", nextSpecialties.join(","));
  };

  const resetFilters = () => setSearchParams(new URLSearchParams());

  // 추천 집합 = 현재 필터 조건(전문분야·지역·경력·자격증·고용형태)에 부합하는 상위 4명 —
  // 필터를 바꾸면 추천도 즉시 갱신된다. 필터가 전부 비어 있으면(쿼리 없음) 전체 active
  // 기준 상위 4로 fallback(getRecommendedTrainers 내부 EMPTY_CONDITIONS 동작과 동일).
  // 온보딩 제출 시 조건이 쿼리스트링 초기값이 되므로 "온보딩 조건 기반 추천"은 그대로 성립.
  const currentFilters = { specialties, region, career, cert, employment };
  const recommendedTrainers = getRecommendedTrainers(trainers, currentFilters);
  const recommendedIds = new Set(recommendedTrainers.map((trainer) => trainer.id));

  const filteredTrainers = filterTrainers(trainers, currentFilters);
  const remainingTrainers = filteredTrainers.filter((trainer) => !recommendedIds.has(trainer.id));

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <p className="mb-4 text-sm">
        <Link to="/" className="text-primary">
          홈으로 돌아가기
        </Link>
      </p>
      <h1 className="mb-2 text-2xl font-bold text-ink">추천 트레이너 탐색</h1>
      <p className="mb-6 text-sm text-[#52606d]">
        센터에 맞는 추천 트레이너를 먼저 비교하고, 조건을 좁혀 그 외 후보도 살펴보세요.
      </p>

      <TrainerFilterBar
        specialties={specialties}
        region={region}
        career={career}
        cert={cert}
        employment={employment}
        onToggleSpecialty={toggleSpecialty}
        onRegionChange={(value) => updateParam("region", value)}
        onCareerChange={(value) => updateParam("career", value)}
        onCertChange={(value) => updateParam("cert", value)}
        onEmploymentChange={(value) => updateParam("employment", value)}
        onReset={resetFilters}
      />

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-bold text-ink">추천 {recommendedTrainers.length}명</h2>
        {recommendedTrainers.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#d9dee7] bg-white p-8 text-center">
            <p className="text-sm text-[#52606d]">
              조건에 맞는 추천 트레이너가 없습니다 — 조건을 완화해 보세요.
            </p>
            <Link
              to="/onboarding"
              className="mt-4 inline-block rounded bg-primary px-4 py-2 text-sm font-semibold text-white"
            >
              채용 조건 다시 설정하기
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {recommendedTrainers.map((trainer) => (
              <TrainerCard key={trainer.id} trainer={trainer} recommended />
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-bold text-ink">그 외 트레이너</h2>
        {remainingTrainers.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#d9dee7] bg-white p-8 text-center">
            <p className="text-sm text-[#52606d]">조건에 맞는 트레이너가 없습니다.</p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 rounded bg-primary px-4 py-2 text-sm font-semibold text-white"
            >
              필터 초기화
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-[#d9dee7] bg-white">
            <div
              className={`grid ${LIST_GRID_COLS} gap-2 border-b border-[#d9dee7] bg-surface px-4 py-2 text-xs font-semibold text-[#52606d]`}
            >
              <span>이름</span>
              <span>전문 분야</span>
              <span>인증 트레이너</span>
              <span>경력</span>
            </div>
            <ul className="divide-y divide-[#d9dee7]">
              {remainingTrainers.map((trainer) => (
                <li key={trainer.id}>
                  <Link
                    to={`/trainers/${trainer.id}`}
                    className={`grid ${LIST_GRID_COLS} items-center gap-2 px-4 py-3 text-sm hover:bg-surface`}
                  >
                    <span className="truncate font-semibold text-ink">{trainer.name}</span>
                    <span className="truncate text-[#52606d]">{trainer.specialties.join(", ")}</span>
                    <span className="text-[#52606d]">{trainer.isCertified ? "인증" : "미인증"}</span>
                    <span className="text-[#52606d]">{trainer.careerYears}년</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </main>
  );
}
