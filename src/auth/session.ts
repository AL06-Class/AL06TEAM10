const SESSION_KEY = "mvp.session";

export type Role = "recruiter" | "trainer";

export type Session = {
  role: Role;
  name: string;
  loginAt: string;
};

export function login(role: Role, name = "게스트"): Session {
  const session: Session = { role, name, loginAt: new Date().toISOString() };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession(): Session | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      (parsed.role === "recruiter" || parsed.role === "trainer") &&
      typeof parsed.name === "string" &&
      typeof parsed.loginAt === "string"
    ) {
      return parsed as Session;
    }
    return null;
  } catch {
    return null;
  }
}
