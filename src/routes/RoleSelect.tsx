import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import type { Role } from "../auth/session";

const ROLE_CARDS: { role: Role; icon: string; label: string }[] = [
  { role: "recruiter", icon: "🏢", label: "센터 대표예요" },
  { role: "trainer", icon: "💪", label: "트레이너예요" },
];

export default function RoleSelect() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-surface">
      <Header />
      <section className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="mb-10 text-2xl font-bold text-ink">어떤 역할로 시작하시나요?</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ROLE_CARDS.map((card) => (
            <button
              key={card.role}
              type="button"
              onClick={() => navigate(`/login?role=${card.role}`)}
              className="rounded-lg border border-[#d9dee7] bg-white p-8 text-center hover:border-primary"
            >
              <p className="mb-3 text-3xl">{card.icon}</p>
              <p className="text-base font-semibold text-ink">{card.label}</p>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
