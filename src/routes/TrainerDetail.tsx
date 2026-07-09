import { Link, useParams } from "react-router-dom";

export default function TrainerDetail() {
  const { trainerId } = useParams<{ trainerId: string }>();

  return (
    <main style={{ padding: "24px", fontFamily: "system-ui, sans-serif" }}>
      <p>
        <Link to="/trainers">트레이너 목록으로 돌아가기</Link>
      </p>
      <h1>트레이너 상세 (placeholder)</h1>
      <p>트레이너 ID: {trainerId}</p>
      <p>
        프로필, 인증 여부, 케이스 테스트 결과, 추천 이유를 보여주는
        화면입니다. 실제 데이터 연동은 후속 브랜치에서 구현합니다.
      </p>
    </main>
  );
}
