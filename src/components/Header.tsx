import { Link, useNavigate } from "react-router-dom";
import { getSession, logout } from "../auth/session";

export default function Header() {
  const navigate = useNavigate();
  const session = getSession();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="border-b border-[#d9dee7] bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-bold text-ink">
          LOGO
        </Link>
        {session ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-ink">{session.name}님</span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm font-semibold text-[#52606d]"
            >
              로그아웃
            </button>
          </div>
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
