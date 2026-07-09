import { Link } from "react-router-dom";

const PLACEHOLDER_TRAINER_IDS = ["1", "2", "3"];

export default function Trainers() {
  return (
    <main style={{ padding: "24px", fontFamily: "system-ui, sans-serif" }}>
      <p>
        <Link to="/">홈으로 돌아가기</Link>
      </p>
      <h1>추천 트레이너 목록 (placeholder)</h1>
      <p>
        맞춤 추천 트레이너를 비교하는 화면입니다. 실제 프로필 카드는 후속
        브랜치에서 구현합니다.
      </p>
      <ul>
        {PLACEHOLDER_TRAINER_IDS.map((id) => (
          <li key={id}>
            <Link to={`/trainers/${id}`}>트레이너 {id} 상세 보기</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
