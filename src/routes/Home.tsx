import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { login } from "../auth/session";

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
    login("trainer");
    navigate("/trainer");
  };

  return (
    <main className="min-h-screen bg-surface">
      <Header />

      <section className="mx-auto max-w-5xl px-6 py-20 text-center">
        <h1 className="mb-4 text-3xl font-bold leading-tight text-ink sm:text-4xl">
          이력서 말고, 실력으로 뽑으세요.
        </h1>
        <p className="mb-10 text-base text-[#52606d] sm:text-lg">
          검증된 트레이너를 케이스 테스트 결과로 확인하고 채용하세요
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleRecruiterStart}
            className="rounded bg-primary px-6 py-3 text-sm font-semibold text-white! sm:text-base"
          >
            센터 대표로 시작하기
          </button>
          <button
            type="button"
            onClick={handleTrainerStart}
            className="rounded border border-primary px-6 py-3 text-sm font-semibold text-primary sm:text-base"
          >
            트레이너로 시작하기
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <h2 className="mb-6 text-center text-xl font-bold text-ink">어떻게 다른가요?</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {FEATURE_CARDS.map((card, index) => (
            <div
              key={card.title}
              className="rounded-lg border border-[#d9dee7] bg-white p-6 text-center shadow-[0_10px_30px_rgba(23,32,42,0.06)]"
            >
              <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {index + 1}
              </span>
              <h3 className="mb-2 text-base font-bold text-ink">{card.title}</h3>
              <p className="text-sm text-[#52606d]">{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20 text-center">
        <div className="grid grid-cols-1 gap-6 rounded-lg border border-[#d9dee7] bg-white p-8 sm:grid-cols-3">
          {METRICS.map((metric) => (
            <div key={metric.label}>
              <p className="mb-1 text-2xl font-bold text-primary">{metric.value}</p>
              <p className="text-sm text-[#52606d]">{metric.label}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
