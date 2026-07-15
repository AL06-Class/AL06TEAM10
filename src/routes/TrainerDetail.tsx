import { Link, useParams } from "react-router-dom";
import { trainers } from "../data/trainers";
import { gradingReports } from "../data/gradingReports";
import HireProposalButton from "../components/HireProposalButton";
import Avatar from "../components/Avatar";
import Header from "../components/Header";
import { getRecommendedTrainers } from "./trainerFilters";
import { loadOnboardingConditions } from "./onboardingConditions";

export default function TrainerProfileDetailPage() {
  const { trainerId } = useParams<{ trainerId: string }>();
  const trainer = trainers.find((candidate) => candidate.id === trainerId);

  if (!trainer) {
    return (
      <>
        <Header title="트레이너 프로필" />
        <main className="mx-auto max-w-2xl px-6 py-10">
          <p className="mb-4 text-sm">
            <Link to="/trainers" className="text-primary">
              ← 목록으로
            </Link>
          </p>
          <div className="rounded-lg border border-dashed border-[#d9dee7] bg-white p-8 text-center">
            <p className="text-sm text-[#52606d]">트레이너를 찾을 수 없습니다.</p>
          </div>
        </main>
      </>
    );
  }

  const report = gradingReports.find((candidate) => candidate.trainerId === trainer.id);
  // 목록(Trainers.tsx)과 동일한 온보딩 조건을 읽어 추천 판정을 일치시킨다.
  const recommendedIds = new Set(
    getRecommendedTrainers(trainers, loadOnboardingConditions()).map((candidate) => candidate.id)
  );
  const isRecommended = recommendedIds.has(trainer.id);

  return (
    <>
      <Header title="트레이너 프로필" />
      <main className="mx-auto max-w-5xl px-6 py-10">
      <p className="mb-4 text-sm">
        <Link to="/trainers" className="text-primary">
          ← 목록으로
        </Link>
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-6">
          <section className="rounded-lg border border-[#d9dee7] bg-white p-6">
            <div className="flex items-start gap-4">
              <Avatar name={trainer.name} photoUrl={trainer.photoUrl} sizeClassName="h-20 w-20" />
              <div className="min-w-0 flex-1">
                <h1 className="text-xl font-bold text-ink">{trainer.name}</h1>
                <p className="mt-1 text-sm text-[#52606d]">
                  경력 {trainer.careerYears}년 · {trainer.region}
                  {trainer.isCertified && (
                    <span className="ml-2 rounded bg-[#f5f5f7] px-2 py-0.5 text-xs font-semibold text-primary">
                      ✅ 인증 트레이너
                    </span>
                  )}
                </p>
              </div>
            </div>
          </section>

          {isRecommended && (
            <section className="rounded-lg border-2 border-primary bg-white p-6">
              <h2 className="text-base font-bold text-primary">💡 추천 이유</h2>
              <p className="mt-3 text-sm leading-[1.6] text-ink">{trainer.recommendationReason}</p>
            </section>
          )}

          <section className="rounded-lg border border-[#d9dee7] bg-white p-6">
            <h2 className="text-base font-bold text-ink">전문 분야</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {trainer.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="rounded-full border border-[#d9dee7] px-3 py-1 text-xs text-[#52606d]"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-[#d9dee7] bg-white p-6">
            <h2 className="text-base font-bold text-ink">케이스 테스트 결과</h2>
            {!trainer.isCertified ? (
              <p className="mt-3 text-sm text-[#52606d]">미인증 트레이너 — 채점 리포트 없음</p>
            ) : report ? (
              <div className="mt-3 flex flex-col gap-3">
                {report.areaScores.map((area) => (
                  <div key={area.evaluationItem}>
                    <div className="flex justify-between text-sm text-[#52606d]">
                      <span>{area.evaluationItem}</span>
                      <span>{area.score}</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-[#f5f5f7]">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${area.score}%` }}
                      />
                    </div>
                  </div>
                ))}
                <Link
                  to={`/trainers/${trainer.id}/report`}
                  className="mt-1 inline-block text-sm font-semibold text-primary"
                >
                  AI 채점 리포트 보기 →
                </Link>
              </div>
            ) : (
              <Link
                to={`/trainers/${trainer.id}/report`}
                className="mt-3 inline-block text-sm font-semibold text-primary"
              >
                AI 채점 리포트 보기 →
              </Link>
            )}
          </section>

          <section className="rounded-lg border border-[#d9dee7] bg-white p-6">
            <h2 className="text-base font-bold text-ink">자격증</h2>
            {trainer.certifications.length > 0 ? (
              <ul className="mt-3 list-inside list-disc text-sm text-ink">
                {trainer.certifications.map((certification) => (
                  <li key={certification}>{certification}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-[#52606d]">등록된 자격증이 없습니다.</p>
            )}
          </section>

          <section className="rounded-lg border border-[#d9dee7] bg-white p-6">
            <h2 className="text-base font-bold text-ink">성과 데이터</h2>
            <p className="mt-3 text-sm leading-[1.6] text-ink">{trainer.performanceSummary}</p>
          </section>
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start flex flex-col gap-6">
          <section className="rounded-lg border border-[#d9dee7] bg-white p-6">
            <blockquote className="rounded border-l-4 border-primary bg-surface p-4 text-sm leading-[1.6] text-ink">
              💬 {trainer.aiSummary}
            </blockquote>

            <div className="mt-6 flex flex-col gap-2">
              <HireProposalButton trainerId={trainer.id} />
              <span className="w-full rounded border border-[#d9dee7] px-4 py-2 text-center text-sm font-semibold text-[#a0a8b4]">
                🔖 저장해두기
              </span>
            </div>
          </section>
        </div>
      </div>
      </main>
    </>
  );
}
