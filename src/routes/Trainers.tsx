import { Link, useSearchParams } from "react-router-dom";
import TrainerCard from "../components/TrainerCard";
import TrainerFilterBar from "../components/TrainerFilterBar";
import { trainers } from "../data/trainers";
import {
  RECOMMENDED_COUNT,
  filterTrainers,
  rankForRecommendation,
  type CareerBand,
} from "./trainerFilters";

export default function TrainerListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const specialty = searchParams.get("specialty") ?? "";
  const region = searchParams.get("region") ?? "";
  const career = (searchParams.get("career") ?? "") as CareerBand;

  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const resetFilters = () => setSearchParams(new URLSearchParams());

  const filteredTrainers = filterTrainers(trainers, { specialty, region, career });
  const recommendedIds = new Set(
    rankForRecommendation(filteredTrainers)
      .slice(0, RECOMMENDED_COUNT)
      .map((trainer) => trainer.id)
  );
  const recommendedTrainers = filteredTrainers.filter((trainer) => recommendedIds.has(trainer.id));

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <p className="mb-4 text-sm">
        <Link to="/" className="text-primary">
          홈으로 돌아가기
        </Link>
      </p>
      <h1 className="mb-2 text-2xl font-bold text-ink">추천 트레이너 탐색</h1>
      <p className="mb-6 text-sm text-[#52606d]">
        전문 분야·경력·지역으로 후보를 좁히고, 상위 {RECOMMENDED_COUNT}명을 비교해 보세요.
      </p>

      <TrainerFilterBar
        specialty={specialty}
        region={region}
        career={career}
        onSpecialtyChange={(value) => updateFilter("specialty", value)}
        onRegionChange={(value) => updateFilter("region", value)}
        onCareerChange={(value) => updateFilter("career", value)}
        onReset={resetFilters}
      />

      {filteredTrainers.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-[#d9dee7] bg-white p-8 text-center">
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
        <>
          <section className="mt-8 overflow-x-auto rounded-lg border border-[#d9dee7] bg-white">
            <table className="w-full min-w-[560px] text-left text-sm">
              <caption className="p-4 text-left text-sm font-semibold text-ink">
                추천 {recommendedTrainers.length}명 비교
              </caption>
              <thead className="bg-surface text-[#52606d]">
                <tr>
                  <th className="px-4 py-2">이름</th>
                  <th className="px-4 py-2">지역</th>
                  <th className="px-4 py-2">경력</th>
                  <th className="px-4 py-2">인증</th>
                  <th className="px-4 py-2">추천 이유</th>
                </tr>
              </thead>
              <tbody>
                {recommendedTrainers.map((trainer) => (
                  <tr key={trainer.id} className="border-t border-[#d9dee7]">
                    <td className="px-4 py-2 font-semibold text-ink">{trainer.name}</td>
                    <td className="px-4 py-2 text-[#52606d]">{trainer.region}</td>
                    <td className="px-4 py-2 text-[#52606d]">{trainer.careerYears}년</td>
                    <td className="px-4 py-2 text-[#52606d]">
                      {trainer.isCertified ? "인증" : "미인증"}
                    </td>
                    <td className="px-4 py-2 text-[#52606d]">{trainer.recommendationReason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filteredTrainers.map((trainer) => (
              <TrainerCard
                key={trainer.id}
                trainer={trainer}
                recommended={recommendedIds.has(trainer.id)}
              />
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
