import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOffer } from "../../lib/offers";
import { pageStyles as s } from "./matchStyles";

type Role = "trainer" | "owner";

export default function ConfirmedPage() {
  const { offerId } = useParams();
  const [role, setRole] = useState<Role>("trainer");
  const offer = useMemo(() => (offerId ? getOffer(offerId) : null), [offerId]);

  if (!offer || offer.status !== "confirmed") {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <h1 style={s.title}>확정된 제안이 아닙니다</h1>
          <div style={s.actions}>
            <Link to="/trainer/offers" style={s.secondaryLink}>
              제안 목록으로
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {(["trainer", "owner"] as Role[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              style={{
                border: "1px solid #cfd8dc",
                borderRadius: 999,
                padding: "6px 14px",
                fontSize: 13,
                cursor: "pointer",
                backgroundColor: role === r ? "#1d6f7a" : "#fff",
                color: role === r ? "#fff" : "#546e7a",
                fontWeight: 700
              }}
            >
              {r === "trainer" ? "트레이너 화면" : "센터 화면"}
            </button>
          ))}
        </div>

        <div style={s.emoji}>🏆</div>

        {role === "owner" ? (
          <>
            <h1 style={{ ...s.title, textAlign: "center" }}>채용 완료</h1>
            <p style={{ ...s.desc, textAlign: "center", fontWeight: 700 }}>
              {offer.trainerName} · {offer.employmentType} · {offer.startDate} 시작
            </p>
            <p style={s.notice}>해당 담당자에게 3일 내 연락 예정입니다. (결제 연동 처리)</p>
            <div style={s.actions}>
              <button type="button" style={s.primaryBtn} onClick={() => alert("메시지 기능은 v2에서 지원합니다")}>
                트레이너에게 메시지
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 style={{ ...s.title, textAlign: "center" }}>채용 확정</h1>
            <p style={{ ...s.desc, textAlign: "center", fontWeight: 700 }}>
              {offer.centerName} · {offer.employmentType}
            </p>
            {offer.contactRevealed && (
              <div
                style={{
                  backgroundColor: "#e6f4ea",
                  borderRadius: 8,
                  padding: 16,
                  marginTop: 12,
                  textAlign: "center"
                }}
              >
                <p style={{ margin: 0, fontWeight: 700, color: "#1e7e34" }}>담당자 연락처 공개</p>
                <p style={{ margin: "4px 0 0", color: "#37474f" }}>담당자 김OO · 010-1234-5678 (샘플)</p>
              </div>
            )}
            <p style={s.notice}>채용 확정과 동시에 담당자와 연락할 수 있습니다.</p>
            <div style={s.actions}>
              <button type="button" style={s.primaryBtn} onClick={() => alert("메시지 기능은 v2에서 지원합니다")}>
                센터에 메시지
              </button>
            </div>
          </>
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
