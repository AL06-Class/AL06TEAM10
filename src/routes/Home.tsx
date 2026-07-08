import { Link } from "react-router-dom";

export default function Home() {
  const statusText = "실행 완료";
  const titleText =
    "Docker 기반 React 개발 환경이 정상적으로 준비되었습니다.";
  const descriptionText =
    "Node 22 컨테이너에서 Vite 개발 서버가 실행될 수 있는 상태입니다. 이제 이 화면을 기준으로 프론트엔드 작업을 시작하면 됩니다.";

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background: "#f6f7f9",
        color: "#17202a",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      }}
    >
      <section className="w-full max-w-[520px] rounded-lg border border-[#d9dee7] bg-white p-8 shadow-[0_10px_30px_rgba(23,32,42,0.08)]">
        <p className="mb-3 text-sm font-bold text-[#18794e]">{statusText}</p>
        <h1 className="mb-4 text-[28px] leading-tight">{titleText}</h1>
        <p className="mb-6 text-base leading-[1.6] text-[#52606d]">{descriptionText}</p>
        <p className="mb-3 text-sm text-[#52606d]">
          현재 역할: recruiter (센터 대표) — 다른 역할 분기는 후속 작업
        </p>
        <nav className="flex gap-3">
          <Link to="/onboarding" className="text-[#0066cc]">
            채용 조건 설정으로 이동
          </Link>
          <Link to="/trainers" className="text-[#0066cc]">
            트레이너 목록으로 이동
          </Link>
        </nav>
      </section>
    </main>
  );
}
