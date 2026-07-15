import Header from "../components/Header";

export default function RoleSelect() {
  return (
    <main className="min-h-screen bg-surface">
      <Header />
      <section className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="mb-10 text-2xl font-bold text-ink">어떤 역할로 시작하시나요?</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-[#d9dee7] bg-white p-8">
            <p className="mb-3 text-3xl">🏢</p>
            <p className="text-base font-semibold text-ink">센터 대표예요</p>
          </div>
          <div className="rounded-lg border border-[#d9dee7] bg-white p-8">
            <p className="mb-3 text-3xl">💪</p>
            <p className="text-base font-semibold text-ink">트레이너예요</p>
          </div>
        </div>
      </section>
    </main>
  );
}
