import { Link, useSearchParams } from "react-router-dom";
import { gradingReports } from "../../data/gradingReports";
import { trainers } from "../../data/trainers";
import { loadTrainerFlowState } from "../../trainerFlow";
import { isMvpDemoMode } from "../../demoMode";
import MatchLayout from "./MatchLayout";

export default function CertifiedPage() {
  const [searchParams] = useSearchParams();
  const reviewMode = searchParams.get("review") === "1";
  const reviewSuffix = reviewMode ? "?review=1" : "";
  const state = loadTrainerFlowState(reviewMode || isMvpDemoMode());
  const fallbackTrainer = trainers.find((candidate) => candidate.isCertified) ?? trainers[0];
  const trainer = state.profile.name
    ? {
        name: state.profile.name,
        region: state.profile.activeRegion,
        careerYears: state.profile.careerYears,
        specialties: state.profile.specialties.filter((specialty) => specialty.level > 0).map((specialty) => specialty.name),
        score: state.caseResult.overallScore,
      }
    : fallbackTrainer
      ? {
          name: fallbackTrainer.name,
          region: fallbackTrainer.region,
          careerYears: String(fallbackTrainer.careerYears),
          specialties: fallbackTrainer.specialties,
          score: gradingReports.find((candidate) => candidate.trainerId === fallbackTrainer.id)?.overallScore ?? 82,
        }
      : null;

  if (!trainer) {
    return (
      <MatchLayout role="candidate" title="인증 완료">
        <div className="matchEmpty">
          <p>인증된 트레이너 정보를 찾을 수 없습니다.</p>
        </div>
      </MatchLayout>
    );
  }

  return (
    <MatchLayout role="candidate" title="인증 완료">
      <div className="matchHero">
        <div aria-hidden="true" className="matchHeroMark">PASS</div>
        <div>
          <p className="matchEyebrow">검증 결과</p>
          <h1 className="matchTitle">인증 완료</h1>
          <p className="matchLead">이제 센터 대표에게 프로필이 공개됩니다.</p>
        </div>

        <div className="matchProfileSummary">
          <div className="matchProfileIdentity">
            <strong>{trainer.name}</strong>
            <span>{trainer.region} · 경력 {trainer.careerYears}</span>
            <span className="matchVerifiedBadge">인증 트레이너</span>
            <small>{trainer.specialties.join(" · ") || "전문 분야를 입력해 주세요"}</small>
          </div>
          <div className="matchScore">
            <span>케이스 테스트</span>
            <strong>{trainer.score}</strong>
          </div>
        </div>

        <div className="matchActions centered">
          <Link className="primaryButton" to={`/trainer/offers${reviewSuffix}`}>
            채용 제안 확인하기
          </Link>
          <Link className="secondaryButton" to={`/trainer${reviewSuffix}`}>
            내 프로필로 이동
          </Link>
        </div>
      </div>
    </MatchLayout>
  );
}
