import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getOffer, updateOfferStatus } from "../../lib/offers";
import { pageStyles as s } from "./matchStyles";

export default function OfferDetailPage() {
  const { offerId } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const offer = useMemo(() => (offerId ? getOffer(offerId) : null), [offerId]);

  if (!offer) {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <h1 style={s.title}>제안을 찾을 수 없습니다</h1>
          <div style={s.actions}>
            <Link to="/trainer/offers" style={s.secondaryLink}>
              제안 목록으로
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const decide = (next: "confirmed" | "rejected") => {
    const updated = updateOfferStatus(offer.id, next);
    if (!updated) {
      setError("이미 처리된 제안입니다.");
      return;
    }
    if (next === "confirmed") {
      navigate(`/trainer/offers/${offer.id}/confirmed`);
    } else {
      navigate("/trainer/offers");
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <p style={s.kicker}>트레이너 · 제안 확인</p>
        <h1 style={s.title}>🏢 {offer.centerName}</h1>
        <p style={{ ...s.desc, fontWeight: 700, fontSize: 17, margin: "4px 0" }}>
          {offer.employmentType} · {offer.salary || "미정"} · {offer.startDate} 시작
        </p>

        {offer.message && (
          <div
            style={{
              backgroundColor: "#f8fafb",
              border: "1px solid #e3e8ea",
              borderRadius: 8,
              padding: 16,
              marginTop: 12
            }}
          >
            <p style={{ margin: 0, lineHeight: 1.7, color: "#37474f" }}>"{offer.message}"</p>
          </div>
        )}

        {offer.status !== "pending" && (
          <p style={{ ...s.feedbackMsg, color: "#6b7a80" }}>
            이 제안은 이미 {offer.status === "confirmed" ? "확정" : "거절"} 처리되었습니다.
          </p>
        )}
        {error && <p style={{ ...s.feedbackMsg, color: "#c0392b" }}>{error}</p>}

        {offer.status === "pending" && (
          <div style={s.actions}>
            <button style={s.primaryBtn} onClick={() => decide("confirmed")} type="button">
              확정하기
            </button>
            <button
              style={{ ...s.primaryBtn, backgroundColor: "#fff", color: "#c0392b", border: "1px solid #c0392b" }}
              onClick={() => decide("rejected")}
              type="button"
            >
              거절하기
            </button>
          </div>
        )}

        <div style={{ marginTop: 16, textAlign: "center" }}>
          <Link to="/trainer/offers" style={{ color: "#6b7a80", fontSize: 14 }}>
            제안 목록으로
          </Link>
        </div>
      </div>
    </div>
  );
}
