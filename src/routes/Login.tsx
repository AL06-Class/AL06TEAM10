import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import { login, type Role } from "../auth/session";

const ROLE_DESTINATION: Record<Role, string> = {
  recruiter: "/onboarding",
  trainer: "/trainer",
};

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");

  const roleParam = searchParams.get("role");
  const role: Role = roleParam === "trainer" ? "trainer" : "recruiter";

  const handleMockLogin = () => {
    login(role, email || undefined);
    navigate(ROLE_DESTINATION[role]);
  };

  return (
    <main className="min-h-screen bg-surface">
      <Header />
      <section className="mx-auto max-w-md px-6 py-16 text-center">
        <h1 className="mb-8 text-2xl font-bold text-ink">로그인 / 회원가입</h1>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleMockLogin}
            className="rounded border border-[#d9dee7] bg-white px-6 py-3 text-sm font-semibold text-ink"
          >
            카카오로 시작하기
          </button>
          <button
            type="button"
            onClick={handleMockLogin}
            className="rounded border border-[#d9dee7] bg-white px-6 py-3 text-sm font-semibold text-ink"
          >
            네이버로 시작하기
          </button>
          <p className="my-2 text-xs text-[#52606d]">OR</p>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="이메일"
            className="rounded border border-[#d9dee7] px-4 py-3 text-sm"
          />
          <button
            type="button"
            onClick={handleMockLogin}
            className="rounded bg-primary px-6 py-3 text-sm font-semibold text-white"
          >
            이메일로 시작하기
          </button>
          <p className="mt-4 text-sm text-[#52606d]">
            이미 계정이 있으신가요?{" "}
            <button type="button" onClick={handleMockLogin} className="font-semibold text-primary">
              로그인
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}
