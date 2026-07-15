import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../auth/session";
import ProductHeader from "../components/ProductHeader";
import { isMvpDemoMode } from "../demoMode";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(isMvpDemoMode() ? "demo@fitproof.example" : "");

  const handleMockLogin = () => {
    login(null, email || "게스트");
    navigate("/");
  };

  return (
    <div className="appShell">
      <ProductHeader title="로그인 / 회원가입" contextLabel="FitProof" />
      <main className="mainSurface authMain">
        <section className="authPanel">
          <p className="kicker">FitProof 시작하기</p>
          <h1>로그인 / 회원가입</h1>
          <p className="lead">목업 로그인 후 역할별 화면을 확인할 수 있습니다.</p>
          <div className="authForm">
            <button className="secondaryButton" onClick={handleMockLogin} type="button">
              카카오로 시작하기
            </button>
            <button className="secondaryButton" onClick={handleMockLogin} type="button">
              네이버로 시작하기
            </button>
            <div className="authDivider"><span>또는 이메일로 시작하기</span></div>
            <label className="field" htmlFor="login-email">
              이메일
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
              />
            </label>
            <button className="primaryButton" onClick={handleMockLogin} type="button">
              이메일로 시작하기
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
