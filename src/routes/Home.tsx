import { useNavigate } from "react-router-dom";
import { login } from "../auth/session";
import ProductHeader from "../components/ProductHeader";

const FEATURE_CARDS = [
  {
    title: "케이스 테스트",
    description: "실무 시나리오 기반 케이스 테스트로 트레이너의 실력을 검증합니다.",
  },
  {
    title: "AI 채점 리포트",
    description: "AI가 케이스 테스트 결과를 분석해 객관적인 채점 리포트를 제공합니다.",
  },
  {
    title: "매칭 추천",
    description: "센터 조건에 맞는 트레이너를 추천 순위로 정리해 보여줍니다.",
  },
];

const METRICS = [
  { label: "인증 트레이너", value: "100+명" },
  { label: "등록 센터", value: "30+개" },
  { label: "채용 성사율", value: "92%" },
];

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
        <section className="landingHero">
          <p className="kicker">트레이너 검증·채용 플랫폼</p>
          <h1>이력서 말고, 실력으로 뽑으세요.</h1>
          <p className="lead">검증된 트레이너를 케이스 테스트 결과로 확인하고 채용하세요.</p>
          <div className="landingActions">
            <button className="primaryButton" onClick={handleRecruiterStart} type="button">
              센터 대표로 시작하기
            </button>
            <button className="secondaryButton" onClick={handleTrainerStart} type="button">
              트레이너로 시작하기
            </button>
          </div>
        </section>

        <section className="landingSection" aria-labelledby="landing-features-title">
          <h2 id="landing-features-title" className="sectionTitle">FitProof가 제공하는 근거</h2>
          <div className="landingFeatureGrid">
            {FEATURE_CARDS.map((card, index) => (
              <article className="landingFeature" key={card.title}>
                <span className="landingFeatureNumber">{String(index + 1).padStart(2, "0")}</span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landingMetrics" aria-label="서비스 현황">
          {METRICS.map((metric) => (
            <div key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
