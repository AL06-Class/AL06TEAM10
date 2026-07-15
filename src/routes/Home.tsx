import { useNavigate } from "react-router-dom";
import { login } from "../auth/session";
import ProductHeader from "../components/ProductHeader";

const PROOF_ITEMS = [
  {
    number: "01",
    title: "케이스 테스트",
    description: "실무 상황에 답하며 트레이너의 판단과 설명을 확인합니다.",
  },
  {
    number: "02",
    title: "인증 기준",
    description: "같은 평가 영역과 통과 기준으로 결과를 비교합니다.",
  },
  {
    number: "03",
    title: "매칭 추천",
    description: "센터 조건과 검증 결과를 바탕으로 후보를 탐색합니다.",
  },
];

const RUBRIC_ITEMS = ["평가 능력", "운동 처방", "커뮤니케이션", "안전 고려"];

const JOURNEY_STEPS = [
  { number: "01", title: "조건 입력", description: "센터가 필요한 조건을 입력합니다." },
  { number: "02", title: "역량 확인", description: "케이스 테스트와 인증 결과를 비교합니다." },
  { number: "03", title: "채용 제안", description: "조건이 맞는 후보에게 다음 대화를 제안합니다." },
];

function EvidencePanel() {
  return (
    <aside className="landingEvidence" aria-label="검증 근거">
      <div className="landingEvidenceHeader">
        <p className="landingEvidenceLabel">검증 근거</p>
        <span className="landingEvidenceStatus">인증 기준</span>
      </div>
      <strong className="landingEvidenceScore">80점 이상</strong>
      <p className="landingEvidenceNote">
        실무 케이스 기반으로 평가하고, 4개 영역의 결과를 한눈에 확인합니다.
      </p>
      <ul className="landingRubricList" aria-label="평가 영역">
        {RUBRIC_ITEMS.map((item) => (
          <li className="landingRubric" key={item}>
            <span>{item}</span>
            <small>평가 영역</small>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default function Home() {
  const navigate = useNavigate();

  const handleRecruiterStart = () => {
    login("recruiter");
    navigate("/onboarding");
  };

  const handleTrainerStart = () => {
    login("candidate");
    navigate("/trainer");
  };

  return (
    <div className="appShell">
      <ProductHeader title="검증된 트레이너 채용" contextLabel="FitProof" />
      <main className="mainSurface landingMain">
        <section className="landingHeroGrid" aria-labelledby="landing-title">
          <div className="landingHeroCopy">
            <p className="kicker">트레이너 검증·채용 플랫폼</p>
            <h1 id="landing-title">
              이력서 말고,
              <br />
              실력으로 뽑으세요.
            </h1>
            <p className="lead">
              케이스 테스트 결과와 실제 성과를 함께 확인하고, 센터에 맞는 후보와 다음 대화를 시작하세요.
            </p>
            <div className="landingActions">
              <button className="primaryButton" onClick={handleRecruiterStart} type="button">
                센터 대표로 시작하기
              </button>
              <button className="secondaryButton" onClick={handleTrainerStart} type="button">
                트레이너로 시작하기
              </button>
            </div>
          </div>
          <EvidencePanel />
        </section>

        <section className="landingProofStrip" aria-label="FitProof 핵심 근거">
          {PROOF_ITEMS.map((item) => (
            <article className="landingProofItem" key={item.number}>
              <span className="landingProofNumber">{item.number}</span>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </article>
          ))}
        </section>

        <section className="landingJourney" aria-labelledby="landing-journey-title">
          <div className="landingJourneyIntro">
            <p className="kicker">FitProof 흐름</p>
            <h2 id="landing-journey-title">검증에서 채용까지 한 흐름으로 이어집니다.</h2>
            <p>센터와 트레이너가 각자의 역할에서 필요한 정보만 확인하며 다음 단계로 이동합니다.</p>
          </div>
          <ol className="landingJourneyList">
            {JOURNEY_STEPS.map((step) => (
              <li className="landingJourneyStep" key={step.number}>
                <span className="landingStepNumber">{step.number}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>
    </div>
  );
}
