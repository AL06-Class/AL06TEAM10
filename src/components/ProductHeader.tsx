import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSession, logout } from "../auth/session";

interface ProductHeaderProps {
  title: string;
  contextLabel?: string;
  actions?: ReactNode;
}

export default function ProductHeader({ title, contextLabel = "센터 대표", actions }: ProductHeaderProps) {
  const navigate = useNavigate();
  const session = getSession();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="topBar">
      <Link aria-label="FitProof 홈" className="brandMark" to="/">
        <span aria-hidden="true" className="brandDot" />
        FitProof
      </Link>
      <span className="topTitle">{contextLabel} · {title}</span>
      <div className="topActions">
        {actions}
        {session ? (
          <>
            <span className="sessionName">{session.name}님</span>
            <button className="ghostButton muted" onClick={handleLogout} type="button">
              로그아웃
            </button>
          </>
        ) : (
          <Link className="ghostButton" to="/login">
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}
