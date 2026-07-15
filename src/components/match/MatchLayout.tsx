import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import ProductHeader from "../ProductHeader";

type MatchRole = "candidate" | "recruiter";

interface MatchLayoutProps {
  title: string;
  role: MatchRole;
  children: ReactNode;
  backTo?: string;
  backLabel?: string;
}

export default function MatchLayout({
  title,
  role,
  children,
  backTo,
  backLabel
}: MatchLayoutProps) {
  const isCandidate = role === "candidate";

  return (
    <div className="appShell">
      <ProductHeader
        contextLabel={isCandidate ? "트레이너" : "센터 대표"}
        title={title}
      />
      <main className="mainSurface matchMain">
        <section className="matchPanel">
          {backTo && backLabel ? (
            <p className="matchBackRow">
              <Link className="backLink" to={backTo}>
                ← {backLabel}
              </Link>
            </p>
          ) : null}
          {children}
        </section>
      </main>
    </div>
  );
}
