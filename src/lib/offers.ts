export type OfferStatus = "pending" | "confirmed" | "rejected";
export type EmploymentType = "정직원" | "프리랜서";

export interface Offer {
  id: string;
  centerName: string;
  trainerName: string;
  employmentType: EmploymentType;
  salary: string;
  startDate: string;
  message: string;
  status: OfferStatus;
  contactRevealed: boolean;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "offers";

export function loadOffers(): Offer[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function saveOffers(list: Offer[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function createOffer(input: {
  centerName: string;
  trainerName: string;
  employmentType: EmploymentType;
  salary: string;
  startDate: string;
  message: string;
}): { ok: true; offer: Offer } | { ok: false; error: string } {
  const list = loadOffers();
  const duplicate = list.some(
    (o) => o.trainerName === input.trainerName && o.status === "pending"
  );
  if (duplicate) {
    return { ok: false, error: "대기 중인 제안이 이미 있는 트레이너입니다." };
  }
  const now = new Date().toISOString();
  const offer: Offer = {
    id: `offer-${now}-${Math.random().toString(36).slice(2, 8)}`,
    ...input,
    status: "pending",
    contactRevealed: false,
    createdAt: now,
    updatedAt: now
  };
  saveOffers([offer, ...list]);
  return { ok: true, offer };
}

export function updateOfferStatus(
  id: string,
  next: Extract<OfferStatus, "confirmed" | "rejected">
): Offer | null {
  const list = loadOffers();
  const idx = list.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  if (list[idx].status !== "pending") return null;
  const updated: Offer = {
    ...list[idx],
    status: next,
    contactRevealed: next === "confirmed",
    updatedAt: new Date().toISOString()
  };
  list[idx] = updated;
  saveOffers(list);
  return updated;
}

export function getOffer(id: string): Offer | null {
  return loadOffers().find((o) => o.id === id) ?? null;
}
