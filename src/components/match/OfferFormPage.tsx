import { useState } from "react";
import { createOffer, EmploymentType } from "../../lib/offers";
import { pageStyles as s } from "./matchStyles";

export default function OfferFormPage() {
  const [trainerName, setTrainerName] = useState("김민지");
  const [centerName, setCenterName] = useState("강남 코어짐 센터");
  const [employmentType, setEmploymentType] = useState<EmploymentType>("정직원");
  const [salary, setSalary] = useState("");
  const [startDate, setStartDate] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = () => {
    if (!salary.trim() || !startDate.trim()) {
      setFeedback({ ok: false, text: "급여조건과 시작일은 필수 입력입니다." });
      return;
    }

    const result = createOffer({
      trainerName,
      centerName,
      employmentType,
      salary,
      startDate,
      message
    });

    if (result.ok) {
      setFeedback({ ok: true, text: `${trainerName}에게 제안이 저장되었습니다.` });
      setSalary("");
      setStartDate("");
      setMessage("");
    } else {
      setFeedback({ ok: false, text: result.error });
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <p style={s.kicker}>트레이너 · 채용 제안 보내기</p>
        <h1 style={s.title}>채용 제안</h1>

        <label style={s.label}>받는사람 (트레이너)</label>
        <input style={s.input} value={trainerName} onChange={(e) => setTrainerName(e.target.value)} />

        <label style={s.label}>센터명</label>
        <input style={s.input} value={centerName} onChange={(e) => setCenterName(e.target.value)} />

        <label style={s.label}>고용형태</label>
        <div style={{ display: "flex", gap: 16, margin: "4px 0 12px" }}>
          {(["정직원", "프리랜서"] as EmploymentType[]).map((t) => (
            <label key={t} style={{ fontSize: 15 }}>
              <input
                type="radio"
                checked={employmentType === t}
                onChange={() => setEmploymentType(t)}
              />{" "}
              {t}
            </label>
          ))}
        </div>

        <label style={s.label}>급여조건 *</label>
        <input
          style={s.input}
          placeholder="예: 월 270만원"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
        />

        <label style={s.label}>시작일 *</label>
        <input style={s.input} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

        <label style={s.label}>메시지</label>
        <textarea
          style={{ ...s.input, minHeight: 90, resize: "vertical" }}
          placeholder="센터 운영 방향, 근무 조건 등을 남겨주세요."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <p style={s.notice}>제안이 저장되면 트레이너가 확인할 수 있습니다.</p>

        {feedback && (
          <p style={{ ...s.feedbackMsg, color: feedback.ok ? "#1e7e34" : "#c0392b" }}>
            {feedback.text}
          </p>
        )}

        <button style={s.primaryBtn} onClick={submit} type="button">
          제안 보내기
        </button>
      </div>
    </div>
  );
}
