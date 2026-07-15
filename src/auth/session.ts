const SESSION_KEY = "mvp.session";

export type Role = "recruiter" | "candidate";

export type Session = {
  role: Role | null;
  name: string;
  loginAt: string;
};

export function login(role: Role | null = null, name = "게스트"): Session {
  const session: Session = { role, name, loginAt: new Date().toISOString() };
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
  return session;
}

export function logout(): void {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function getSession(): Session | null {
  if (typeof localStorage === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    const role = parsed?.role === "trainer" ? "candidate" : parsed?.role;
    if (
      parsed &&
      (role === null || role === "recruiter" || role === "candidate") &&
      typeof parsed.name === "string" &&
      typeof parsed.loginAt === "string"
    ) {
      return { ...parsed, role } as Session;
    }
    return null;
  } catch {
    return null;
  }
}
