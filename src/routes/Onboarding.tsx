import { Link } from "react-router-dom";

export default function Onboarding() {
  return (
    <main style={{ padding: "24px", fontFamily: "system-ui, sans-serif" }}>
      <p>
        <Link to="/">홈으로 돌아가기</Link>
      </p>
      <h1>채용 조건 설정 (placeholder)</h1>
      <p>
        센터 대표가 채용 조건(전문 분야, 경력, 지역 등)을 설정하는 화면입니다.
        실제 입력 폼은 후속 브랜치에서 구현합니다.
      </p>
      <p>
        <Link to="/trainers">다음: 추천 트레이너 보기</Link>
      </p>
    </main>
  );
}
