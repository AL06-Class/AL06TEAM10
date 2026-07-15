import { Link } from "react-router-dom";
import { getSession } from "../auth/session";

export default function Header() {
  const session = getSession();

  return (
    <header className="border-b border-[#d9dee7] bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-bold text-ink">
          LOGO
        </Link>
        {session ? (
          <span className="text-sm font-semibold text-ink">{session.name}님</span>
        ) : (
          <Link
            to="/login"
            className="rounded bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}
