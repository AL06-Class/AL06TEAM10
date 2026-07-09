import { Link, useParams } from "react-router-dom";
import { trainers } from "../data/trainers";
import { gradingReports } from "../data/gradingReports";

export default function GradingReportPage() {
  const { trainerId } = useParams<{ trainerId: string }>();
  const trainer = trainers.find((candidate) => candidate.id === trainerId);
  const report = gradingReports.find((candidate) => candidate.trainerId === trainerId);

  const backLink = trainerId ? `/trainers/${trainerId}` : "/trainers";

  if (!trainer || !report) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-10">
        <p className="mb-4 text-sm">
          <Link to={backLink} className="text-primary">
            ← 프로필로
          </Link>
        </p>
        <div className="rounded-lg border border-dashed border-[#d9dee7] bg-white p-8 text-center">
          <p className="text-sm text-[#52606d]">채점 리포트가 아직 없습니다.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <p className="mb-4 text-sm">
        <Link to={backLink} className="text-primary">
          ← 프로필로
        </Link>
      </p>

      <section className="rounded-lg border border-[#d9dee7] bg-white p-6">
        <h1 className="text-base font-bold text-ink">종합 점수</h1>
        <p className="mt-2 text-3xl font-bold text-primary">
          {report.overallScore} <span className="text-base font-normal text-[#52606d]">/ 100</span>
        </p>
        <div className="mt-3 h-2 w-full rounded-full bg-[#f5f5f7]">
          <div
            className="h-2 rounded-full bg-primary"
            style={{ width: `${report.overallScore}%` }}
          />
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-[#d9dee7] bg-white p-6">
        <h2 className="text-base font-bold text-ink">케이스 요약</h2>
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <dt className="text-[#52606d]">나이/성별</dt>
          <dd className="text-ink">
            {report.caseSummary.age} · {report.caseSummary.gender}
          </dd>
          <dt className="text-[#52606d]">주호소</dt>
          <dd className="text-ink">{report.caseSummary.chiefComplaint}</dd>
          <dt className="text-[#52606d]">목표</dt>
          <dd className="text-ink">{report.caseSummary.goal}</dd>
          <dt className="text-[#52606d]">운동 경험</dt>
          <dd className="text-ink">{report.caseSummary.exerciseExperience}</dd>
        </dl>
      </section>

      <section className="mt-6 rounded-lg border border-[#d9dee7] bg-white p-6">
        <h2 className="text-base font-bold text-ink">영역별 평가</h2>
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
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-[#d9dee7] bg-white p-6">
        <h2 className="text-base font-bold text-ink">AI 코멘트</h2>
        <p className="mt-3 text-sm leading-[1.6] text-ink">👍 잘한 점: {report.strengthComment}</p>
        <p className="mt-2 text-sm leading-[1.6] text-ink">💡 보완할 점: {report.improvementComment}</p>
      </section>

      <div className="mt-6">
        <span className="block w-full rounded bg-[#f5f5f7] px-4 py-2 text-center text-sm font-semibold text-[#a0a8b4]">
          [ 채용 제안 보내기 ]
        </span>
      </div>
    </main>
  );
}
