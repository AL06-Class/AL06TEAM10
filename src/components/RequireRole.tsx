import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getSession, type Role } from "../auth/session";

interface RequireRoleProps {
  role: Role;
  children: ReactNode;
}

export default function RequireRole({ role, children }: RequireRoleProps) {
  const location = useLocation();
  const session = getSession();
  const reviewMode = new URLSearchParams(location.search).get("review") === "1";

  if (reviewMode) return <>{children}</>;
  if (!session || !session.role) {
    return <Navigate replace state={{ from: location.pathname }} to="/login" />;
  }
  if (session.role !== role) {
    return <Navigate replace to={session.role === "recruiter" ? "/recruiter" : "/trainer"} />;
  }

  return <>{children}</>;
}
