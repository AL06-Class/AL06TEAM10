import { Link, Navigate, useParams } from "react-router-dom";
import { trainers } from "../data/trainers";
import { gradingReports } from "../data/gradingReports";
import HireProposalButton from "../components/HireProposalButton";
import ProductHeader from "../components/ProductHeader";

export default function GradingReportPage() {
  const { trainerId } = useParams<{ trainerId: string }>();
  const trainer = trainers.find((candidate) => candidate.id === trainerId);
  const report = gradingReports.find((candidate) => candidate.trainerId === trainerId);

  const backLink = trainerId ? `/trainers/${trainerId}` : "/trainers";

  if (trainer && !trainer.isCertified) {
    return <Navigate to={backLink} replace />;
  }

  if (!trainer || !report) {
    return (
      <div className="appShell">
        <ProductHeader title="예시 채점 리포트" />
        <main className="mainSurface recruiterMain recruiterNarrow">
        <p className="pageLinkRow">
          <Link to={backLink} className="backLink">
            ← 프로필로
          </Link>
        </p>
        <div className="emptyState large">
          <p>채점 리포트가 아직 없습니다.</p>
        </div>
        </main>
      </div>
    );
  }

  return (
    <div className="appShell">
      <ProductHeader title="예시 채점 리포트" />
      <main className="mainSurface recruiterMain recruiterNarrow">
      <p className="pageLinkRow">
        <Link to={backLink} className="backLink">
          ← 프로필로
        </Link>
      </p>

      <section className="rounded-lg border border-[#d9dee7] bg-white p-6">
        <h1 className="sectionTitle reportScoreTitle">예시 종합 점수</h1>
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
        <h2 className="text-base font-bold text-ink">예시 채점 코멘트</h2>
        <p className="mt-3 text-sm leading-[1.6] text-ink">👍 잘한 점: {report.strengthComment}</p>
        <p className="mt-2 text-sm leading-[1.6] text-ink">💡 보완할 점: {report.improvementComment}</p>
      </section>

      <div className="mt-6">
        <HireProposalButton trainerId={trainer.id} />
      </div>
      </main>
    </div>
  );
}
