import Header from "../components/Header";

export default function Login() {
  return (
    <main className="min-h-screen bg-surface">
      <Header />
      <section className="mx-auto max-w-md px-6 py-16 text-center">
        <h1 className="mb-8 text-2xl font-bold text-ink">로그인 / 회원가입</h1>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="rounded border border-[#d9dee7] bg-white px-6 py-3 text-sm font-semibold text-ink"
          >
            카카오로 시작하기
          </button>
          <button
            type="button"
            className="rounded border border-[#d9dee7] bg-white px-6 py-3 text-sm font-semibold text-ink"
          >
            네이버로 시작하기
          </button>
          <p className="my-2 text-xs text-[#52606d]">OR</p>
          <button
            type="button"
            className="rounded bg-primary px-6 py-3 text-sm font-semibold text-white"
          >
            이메일로 시작하기
          </button>
        </div>
      </section>
    </main>
  );
}
