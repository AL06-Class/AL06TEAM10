import { Link } from "react-router-dom";
import { pageStyles as s } from "./matchStyles";

export default function CertifiedPage() {
  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.emoji}>🏅</div>
        <h1 style={s.title}>인증 완료</h1>
        <div style={s.badge}>검증된 트레이너 뱃지 획득</div>
        <p style={s.desc}>
          케이스 테스트를 통과했습니다. 이제 마스터의 채용 제안을 받을 수 있습니다.
        </p>
        <div style={s.actions}>
          <Link to="/trainer/offers" style={s.primaryLink}>
            채용 제안 확인
          </Link>
          <Link to="/trainer/centers" style={s.secondaryLink}>
            센터 찾기
          </Link>
        </div>
      </div>
    </div>
  );
}
