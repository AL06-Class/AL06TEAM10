import { Link } from "react-router-dom";
import { pageStyles as s } from "./matchStyles";

const CURATED_CENTERS = [
  { name: "강남 코어짐 센터", area: "서울 강남", tags: "정직원 · PT 전문" },
  { name: "마곡 무브먼트랩", area: "서울 마곡", tags: "프리랜서 · 재활 특화" },
  { name: "서초 스트롱스튜디오", area: "서울 서초", tags: "정직원 · 퍼포먼스" }
];

export default function CentersPage() {
  return (
    <div style={s.page}>
      <div style={s.card}>
        <h1 style={s.title}>센터 탐색</h1>
        <p style={s.desc}>MVP에서 제공하는 엄선된 센터 목록입니다.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
          {CURATED_CENTERS.map((c) => (
            <div key={c.name} style={s.listItem}>
              <p style={s.listItemTitle}>🏢 {c.name}</p>
              <p style={s.listItemMeta}>
                {c.area} · {c.tags}
              </p>
            </div>
          ))}
        </div>
        <div style={s.actions}>
          <Link to="/trainer/certified" style={s.secondaryLink}>
            돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
