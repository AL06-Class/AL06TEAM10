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

  // 추천 카드 집합은 필터와 무관하게 전체 트레이너 기준 고정(프로필 상세와 판정 일치 위함).
  const recommendedTrainers = getRecommendedTrainers(trainers);
  const recommendedIds = new Set(recommendedTrainers.map((trainer) => trainer.id));

  const filteredTrainers = filterTrainers(trainers, { specialties, region, career, cert, employment });
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
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {recommendedTrainers.map((trainer) => (
            <TrainerCard key={trainer.id} trainer={trainer} recommended />
          ))}
        </ul>
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
          <ul className="divide-y divide-[#d9dee7] overflow-hidden rounded-lg border border-[#d9dee7] bg-white">
            {remainingTrainers.map((trainer) => (
              <li key={trainer.id}>
                <Link
                  to={`/trainers/${trainer.id}`}
                  className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm hover:bg-surface"
                >
                  <span className="font-semibold text-ink">{trainer.name}</span>
                  <span className="text-[#52606d]">{trainer.specialties.join(", ")}</span>
                  <span className="text-[#52606d]">경력 {trainer.careerYears}년</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
