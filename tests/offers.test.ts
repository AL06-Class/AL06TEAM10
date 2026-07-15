import assert from "node:assert/strict";
import test from "node:test";
import {
  createOffer,
  ensureReviewOffers,
  loadOffers,
  updateOfferStatus
} from "../src/lib/offers.ts";
import { loadNotifications } from "../src/lib/notifications.ts";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return Array.from(this.values.keys())[index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

const storage = new MemoryStorage();
Object.defineProperty(globalThis, "localStorage", { configurable: true, value: storage });

test.beforeEach(() => storage.clear());

const offerInput = {
  centerName: "강남 코어짐 센터",
  trainerName: "김민지",
  employmentType: "정직원" as const,
  salary: "월 270만원",
  startDate: "2026-08-01",
  message: "재활 전문 트레이너를 찾고 있습니다."
};

test("제안 생성은 pending 상태와 수신 알림을 만든다", () => {
  const result = createOffer(offerInput);

  assert.equal(result.ok, true);
  assert.equal(loadOffers()[0]?.status, "pending");
  assert.equal(loadNotifications()[0]?.type, "offer_received");
});

test("제안 수락은 accepted 상태와 확정 알림을 만든다", () => {
  const result = createOffer(offerInput);
  if (!result.ok) throw new Error(result.error);

  const accepted = updateOfferStatus(result.offer.id, "accepted");

  assert.equal(accepted?.status, "accepted");
  assert.equal(accepted?.contactRevealed, true);
  assert.deepEqual(
    loadNotifications().map((notification) => notification.type),
    ["offer_confirmed", "offer_accepted", "offer_received"]
  );
});

test("기존 목업 상태값은 PRD 상태값으로 읽을 때 변환된다", () => {
  storage.setItem(
    "offers",
    JSON.stringify([
      { ...offerInput, id: "legacy-accepted", status: "confirmed" },
      { ...offerInput, id: "legacy-rejected", status: "rejected" }
    ])
  );

  assert.deepEqual(loadOffers().map((offer) => offer.status), ["accepted", "declined"]);
});

test("리뷰용 제안은 일반 사용자 제안 저장소와 분리된다", () => {
  const reviewOffers = ensureReviewOffers();

  assert.equal(reviewOffers.length, 3);
  assert.equal(loadOffers().length, 0);
});
