import { useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { gradingReports } from "../../data/gradingReports";
import { trainers } from "../../data/trainers";
import { createOffer, type EmploymentType } from "../../lib/offers";
import MatchLayout from "./MatchLayout";
import { loadOnboardingConditions } from "../../routes/onboardingConditions";
import { isMvpDemoMode } from "../../demoMode";

export default function OfferFormPage() {
  const [searchParams] = useSearchParams();
  const requestedTrainerId = searchParams.get("trainerId");
  const trainer = trainers.find(
    (candidate) => candidate.id === requestedTrainerId && candidate.isCertified
  ) ?? trainers.find((candidate) => candidate.isCertified) ?? trainers[0];
  const report = trainer
    ? gradingReports.find((candidate) => candidate.trainerId === trainer.id)
    : undefined;
  const centerName = loadOnboardingConditions()?.centerName ?? "강남 코어짐 센터";
  const demoMode = isMvpDemoMode();
  const [employmentType, setEmploymentType] = useState<EmploymentType>("정직원");
  const [salary, setSalary] = useState(demoMode ? "월 290만원 + 인센티브" : "");
  const [startDate, setStartDate] = useState(demoMode ? "2026-08-01" : "");
  const [message, setMessage] = useState(
    demoMode
      ? "재활 PT 경험과 회원 유지 성과를 보고 제안드립니다. 주 5일 오후 근무를 우선 협의하고 싶습니다."
      : ""
  );
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  if (!trainer) {
    return (
      <MatchLayout role="recruiter" title="채용 제안 보내기" backTo="/trainers" backLabel="트레이너 목록">
        <div className="matchEmpty">
          <p>제안할 인증 트레이너를 찾을 수 없습니다.</p>
        </div>
      </MatchLayout>
    );
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = createOffer({
      trainerName: trainer.name,
      centerName,
      employmentType,
      salary,
      startDate,
      message
    }, demoMode);

    if (result.ok) {
      setFeedback({ ok: true, text: `${trainer.name}에게 제안이 저장되었습니다.` });
      setSalary("");
      setStartDate("");
      setMessage("");
    } else {
      setFeedback({ ok: false, text: result.error });
    }
  };

  return (
    <MatchLayout
      role="recruiter"
      title="채용 제안 보내기"
      backTo={`/trainers/${trainer.id}`}
      backLabel="트레이너 프로필"
    >
      <p className="matchEyebrow">센터 대표 · 채용 제안</p>
      <h1 className="matchTitle">채용 제안</h1>

      <div className="matchProfileSummary">
        <div className="matchProfileIdentity">
          <strong>{trainer.name}</strong>
          <span>{trainer.region} · 경력 {trainer.careerYears}년</span>
          <span className="matchVerifiedBadge">인증 트레이너</span>
          <small>{trainer.specialties.join(" · ")}</small>
        </div>
        <div className="matchScore">
          <span>테스트 점수</span>
          <strong>{report?.overallScore ?? 82}</strong>
        </div>
      </div>

      <form className="matchForm" onSubmit={submit}>
        <fieldset className="matchField">
          <legend>고용 형태</legend>
          <div className="matchRadioGroup">
            {(["정직원", "프리랜서"] as EmploymentType[]).map((type) => (
              <label className="matchRadioOption" key={type}>
                <input
                  checked={employmentType === type}
                  name="employmentType"
                  onChange={() => setEmploymentType(type)}
                  type="radio"
                  value={type}
                />
                {type}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="matchField" htmlFor="offer-salary">
          급여 조건
          <input
            className="matchInput"
            id="offer-salary"
            onChange={(event) => setSalary(event.target.value)}
            placeholder="예: 월 270만원"
            required
            value={salary}
          />
        </label>

        <label className="matchField" htmlFor="offer-start-date">
          시작일
          <input
            className="matchInput"
            id="offer-start-date"
            onChange={(event) => setStartDate(event.target.value)}
            required
            type="date"
            value={startDate}
          />
        </label>

        <label className="matchField" htmlFor="offer-message">
          메시지 <small>선택 입력</small>
          <textarea
            className="matchInput"
            id="offer-message"
            onChange={(event) => setMessage(event.target.value)}
            placeholder="센터 운영 방향과 근무 조건을 남겨주세요."
            value={message}
          />
        </label>

        <p className="matchNotice">채용 확정 시 담당자가 3일 내 연락드립니다.</p>
        {feedback ? (
          <p aria-live="polite" className={`matchFeedback${feedback.ok ? "" : " error"}`}>
            {feedback.text}
          </p>
        ) : null}

        <div className="matchActions">
          <button className="primaryButton" type="submit">제안 보내기</button>
        </div>
      </form>
    </MatchLayout>
  );
}
