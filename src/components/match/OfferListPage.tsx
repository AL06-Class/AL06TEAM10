import { useMemo } from "react";
import { Link } from "react-router-dom";
import { loadOffers } from "../../lib/offers";
import { pageStyles as s } from "./matchStyles";

export default function OfferListPage() {
  const offers = useMemo(() => loadOffers(), []);
  const pending = offers.filter((o) => o.status === "pending");
  const past = offers.filter((o) => o.status !== "pending");

  return (
    <div style={s.page}>
      <div style={s.card}>
        <p style={s.kicker}>트레이너 · 받은 제안</p>
        <h1 style={s.title}>채용 제안 목록</h1>

        {pending.length === 0 ? (
          <p style={s.desc}>대기 중인 제안이 없습니다. 제안이 오면 이곳에 표시됩니다.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
            {pending.map((o) => (
              <Link
                key={o.id}
                to={`/trainer/offers/${o.id}`}
                style={{ ...s.listItem, textDecoration: "none", color: "inherit", display: "block" }}
              >
                <p style={s.listItemTitle}>🏢 {o.centerName}</p>
                <p style={s.listItemMeta}>
                  {o.employmentType} · {o.salary || "미정"}
                </p>
                <p style={{ ...s.listItemMeta, color: "#1d6f7a", fontWeight: 700 }}>
                  자세히 보기 →
                </p>
              </Link>
            ))}
          </div>
        )}

        {past.length > 0 && (
          <>
            <h2 style={{ fontSize: 15, color: "#6b7a80", marginTop: 28 }}>처리 완료</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {past.map((o) => (
                <div key={o.id} style={{ ...s.listItem, opacity: 0.7 }}>
                  <p style={s.listItemTitle}>🏢 {o.centerName}</p>
                  <p style={s.listItemMeta}>
                    {o.employmentType} · {o.status === "confirmed" ? "채용 확정" : "거절됨"}
                  </p>
                  {o.status === "confirmed" && (
                    <Link to={`/trainer/offers/${o.id}/confirmed`} style={{ fontSize: 13, color: "#1d6f7a" }}>
                      확정 내역 보기
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        <div style={s.actions}>
          <Link to="/trainer/certified" style={s.secondaryLink}>
            뒤로가기
          </Link>
        </div>
      </div>
    </div>
  );
}
