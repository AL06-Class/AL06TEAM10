import { Link, useNavigate } from "react-router-dom";
import { getSession, logout } from "../auth/session";

interface HeaderProps {
  title?: string;
}

export default function Header({ title }: HeaderProps) {
  const navigate = useNavigate();
  const session = getSession();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-10 border-b border-[#d9dee7] bg-white/90 backdrop-blur">
      <div className="mx-auto grid max-w-5xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-4">
        <Link to="/" className="flex items-center gap-[9px] text-[16px] font-[750] text-ink">
          <span
            className="h-[11px] w-[11px] rounded-full bg-primary shadow-[inset_0_0_0_3px_#dcecff]"
            aria-hidden="true"
          />
          FitProof
        </Link>
        <span className="truncate text-sm font-semibold text-[#52606d]">{title}</span>
        <div className="flex items-center justify-end gap-3">
          {session ? (
            <>
              <span className="text-sm font-semibold text-ink">{session.name}님</span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm font-semibold text-[#52606d]"
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded bg-primary px-4 py-2 text-sm font-semibold text-white!"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
