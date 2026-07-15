import { Link } from "react-router-dom";
import ProductHeader from "../components/ProductHeader";

export default function RecruiterHome() {
  return (
    <div className="appShell">
      <ProductHeader title="채용 현황" contextLabel="센터 대표" />
      <main className="mainSurface recruiterMain">
        <section className="flowCard homeHero">
          <div>
            <p className="kicker">센터 대표 · recruiter</p>
            <h1>검증된 트레이너를 찾아보세요</h1>
            <p className="lead">
              센터 조건에 맞는 후보를 비교하고, 검증 결과를 확인한 뒤 채용 제안을 보낼 수 있어요.
            </p>
          </div>
          <div className="homeStatus" role="status">
            <span aria-hidden="true" className="statusDot" />
            <div>
              <strong>채용 탐색을 시작할 준비가 됐어요</strong>
              <span>센터 정보를 입력하면 맞춤 추천을 보여드릴게요.</span>
            </div>
          </div>
          <div className="homeActions">
            <Link className="primaryButton" to="/onboarding">
              채용 조건 설정
            </Link>
            <Link className="secondaryButton" to="/trainers">
              트레이너 목록 보기
            </Link>
          </div>
        </section>

        <section className="homeQuickLinks" aria-label="빠른 이동">
          <Link className="quickLink" to="/onboarding">
            <span>01</span>
            <strong>채용 조건 설정</strong>
            <small>센터와 원하는 조건 입력</small>
          </Link>
          <Link className="quickLink" to="/trainers">
            <span>02</span>
            <strong>트레이너 탐색</strong>
            <small>추천 후보 비교</small>
          </Link>
        </section>
      </main>
    </div>
  );
}
