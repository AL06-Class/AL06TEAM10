import { Link, useParams } from "react-router-dom";
import { trainers } from "../data/trainers";

export default function TrainerProfileDetailPage() {
  const { trainerId } = useParams<{ trainerId: string }>();
  const trainer = trainers.find((candidate) => candidate.id === trainerId);

  if (!trainer) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-10">
        <p className="mb-4 text-sm">
          <Link to="/trainers" className="text-primary">
            트레이너 목록으로 돌아가기
          </Link>
        </p>
        <div className="rounded-lg border border-dashed border-[#d9dee7] bg-white p-8 text-center">
          <p className="text-sm text-[#52606d]">트레이너를 찾을 수 없습니다.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <p className="mb-4 text-sm">
        <Link to="/trainers" className="text-primary">
          트레이너 목록으로 돌아가기
        </Link>
      </p>

      <section className="rounded-lg border border-[#d9dee7] bg-white p-6">
        <div className="flex items-start gap-4">
          <img
            src={trainer.photoUrl}
            alt={`${trainer.name} 프로필 사진`}
            className="h-20 w-20 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold text-ink">{trainer.name}</h1>
            <p className="mt-1 text-sm text-[#52606d]">
              {trainer.region} · 경력 {trainer.careerYears}년
              {trainer.isCertified && (
                <span className="ml-2 rounded bg-[#f5f5f7] px-2 py-0.5 text-xs font-semibold text-primary">
                  인증 트레이너
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
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

      <section className="mt-6 rounded-lg border border-[#d9dee7] bg-white p-6">
        <h2 className="text-base font-bold text-ink">상세 정보</h2>

        <div className="mt-4">
          <h3 className="text-sm font-semibold text-[#52606d]">AI 한줄 요약</h3>
          <p className="mt-1 text-sm leading-[1.6] text-ink">{trainer.aiSummary}</p>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-semibold text-[#52606d]">성과 데이터 요약</h3>
          <p className="mt-1 text-sm leading-[1.6] text-ink">{trainer.performanceSummary}</p>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-semibold text-[#52606d]">추천 이유</h3>
          <p className="mt-1 text-sm leading-[1.6] text-ink">{trainer.recommendationReason}</p>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-semibold text-[#52606d]">자격증</h3>
          {trainer.certifications.length > 0 ? (
            <ul className="mt-1 list-inside list-disc text-sm text-ink">
              {trainer.certifications.map((certification) => (
                <li key={certification}>{certification}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-sm text-[#52606d]">등록된 자격증이 없습니다.</p>
          )}
        </div>
      </section>

      <section className="mt-6 min-h-[80px] rounded-lg border border-[#d9dee7] bg-white p-6" />
    </main>
  );
}
