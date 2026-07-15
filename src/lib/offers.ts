import { pushNotification } from "./notifications.ts";
import { createDemoOffers } from "../trainerFlow.ts";

export type OfferStatus = "pending" | "accepted" | "declined" | "cancelled";
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
const REVIEW_STORAGE_KEY = "offers.review";

function getStorageKey(reviewMode = false) {
  return reviewMode ? REVIEW_STORAGE_KEY : STORAGE_KEY;
}

function normalizeStatus(status: unknown): OfferStatus {
  if (status === "confirmed") return "accepted";
  if (status === "rejected") return "declined";
  if (status === "accepted" || status === "declined" || status === "cancelled") {
    return status;
  }
  return "pending";
}

export function getOfferStatusLabel(status: OfferStatus): string {
  return {
    pending: "검토 중",
    accepted: "수락",
    declined: "거절",
    cancelled: "취소"
  }[status];
}

export function loadOffers(reviewMode = false): Offer[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(getStorageKey(reviewMode));
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list)
      ? list.map((offer) => ({ ...offer, status: normalizeStatus(offer.status) }))
      : [];
  } catch {
    return [];
  }
}

function saveOffers(list: Offer[], reviewMode = false) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(getStorageKey(reviewMode), JSON.stringify(list));
}

export function ensureReviewOffers(): Offer[] {
  const existing = loadOffers(true);
  if (existing.length > 0) return existing;

  const now = new Date().toISOString();
  const seeded = createDemoOffers().map((offer) => ({
    id: offer.id,
    centerName: offer.center,
    trainerName: "한민서",
    employmentType: offer.employmentType === "정직원" ? "정직원" : "프리랜서",
    salary: offer.salary,
    startDate: offer.startDate,
    message: offer.message,
    status: offer.status,
    contactRevealed: offer.status === "accepted",
    createdAt: new Date(`${offer.offeredAt.replace(/\./g, "-")}T09:00:00+09:00`).toISOString(),
    updatedAt: now
  } satisfies Offer));
  saveOffers(seeded, true);
  return seeded;
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
  pushNotification("offer_received", `${offer.centerName}에서 ${offer.trainerName}에게 채용 제안을 보냈습니다.`);
  return { ok: true, offer };
}

export function updateOfferStatus(
  id: string,
  next: Extract<OfferStatus, "accepted" | "declined">,
  reviewMode = false
): Offer | null {
  const list = loadOffers(reviewMode);
  const idx = list.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  if (list[idx].status !== "pending") return null;
  const updated: Offer = {
    ...list[idx],
    status: next,
    contactRevealed: next === "accepted",
    updatedAt: new Date().toISOString()
  };
  list[idx] = updated;
  saveOffers(list, reviewMode);
  if (next === "accepted") {
    pushNotification("offer_accepted", `${updated.centerName}의 채용 제안을 수락했습니다.`);
    pushNotification("offer_confirmed", `${updated.centerName} 채용이 확정되었습니다.`);
  }
  return updated;
}

export function getOffer(id: string, reviewMode = false): Offer | null {
  return loadOffers(reviewMode).find((o) => o.id === id) ?? null;
}
