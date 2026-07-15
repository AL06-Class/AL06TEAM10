import { useEffect } from "react";
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
import { saveConditionsToDraft } from "./onboardingConditions";
import ProductHeader from "../components/ProductHeader";

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

  // 필터 조건이 바뀔 때마다 온보딩 draft에도 동일 조건을 반영 — 필터↔온보딩 단일 소스.
  // 센터정보(센터명·유형·트레이너 수)는 saveConditionsToDraft 내부에서 보존됨.
  const specialtiesKey = specialties.join(",");
  useEffect(() => {
    saveConditionsToDraft({ specialties, region, career, cert, employment });
  }, [specialtiesKey, region, career, cert, employment]);

  return (
    <div className="appShell">
      <ProductHeader title="트레이너 탐색" />
      <main className="mainSurface recruiterMain recruiterWide">
        <p className="pageLinkRow">
          <Link to="/recruiter" className="backLink">
            ← 홈으로 돌아가기
          </Link>
          <Link to="/onboarding" className="backLink">
            조건 수정
          </Link>
        </p>
        <div className="pageIntro">
          <p className="kicker">채용 후보</p>
          <h1>추천 트레이너 탐색</h1>
          <p className="lead">
            센터에 맞는 추천 트레이너를 먼저 비교하고, 조건을 좁혀 그 외 후보도 살펴보세요.
          </p>
        </div>

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

      <section className="recruiterSection listSection">
        <h2 className="sectionTitle">추천 {recommendedTrainers.length}명</h2>
        {recommendedTrainers.length === 0 ? (
          <div className="emptyState large">
            <p>
              조건에 맞는 추천 트레이너가 없습니다 — 조건을 완화해 보세요.
            </p>
            <Link
              to="/onboarding"
              className="primaryButton"
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

      <section className="recruiterSection listSection">
        <h2 className="sectionTitle">그 외 트레이너</h2>
        {remainingTrainers.length === 0 ? (
          <div className="emptyState large">
            <p>조건에 맞는 트레이너가 없습니다.</p>
            <button
              type="button"
              onClick={resetFilters}
              className="primaryButton"
            >
              필터 초기화
            </button>
          </div>
        ) : (
          <div className="trainerTable">
            <div
              className={`trainerTableHeader ${LIST_GRID_COLS}`}
            >
              <span>이름</span>
              <span>전문 분야</span>
              <span>인증 트레이너</span>
              <span>경력</span>
            </div>
            <ul className="trainerTableBody">
              {remainingTrainers.map((trainer) => (
                <li key={trainer.id}>
                  <Link
                    to={`/trainers/${trainer.id}`}
                    className={`trainerTableRow ${LIST_GRID_COLS}`}
                  >
                    <span className="truncate trainerTableName">{trainer.name}</span>
                    <span className="truncate">{trainer.specialties.join(", ")}</span>
                    <span>{trainer.isCertified ? "인증" : "미인증"}</span>
                    <span>{trainer.careerYears}년</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
      </main>
    </div>
  );
}
