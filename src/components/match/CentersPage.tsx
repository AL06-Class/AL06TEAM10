import MatchLayout from "./MatchLayout";

const CURATED_CENTERS = [
  { name: "강남 코어짐 센터", area: "서울 강남", tags: "정직원 · PT 전문" },
  { name: "마곡 무브먼트랩", area: "서울 마곡", tags: "프리랜서 · 재활 특화" },
  { name: "서초 스트롱스튜디오", area: "서울 서초", tags: "정직원 · 퍼포먼스" }
];

export default function CentersPage() {
  return (
    <MatchLayout role="candidate" title="센터 탐색" backTo="/trainer/certified" backLabel="인증 완료">
      <p className="matchEyebrow">트레이너 · 센터 탐색</p>
      <h1 className="matchTitle">나에게 맞는 센터 찾기</h1>
      <p className="matchLead">MVP에서 제공하는 센터 목록을 살펴볼 수 있어요.</p>
      <ul className="matchCenterList spacedList">
        {CURATED_CENTERS.map((center) => (
          <li className="matchCenterCard" key={center.name}>
            <div className="matchCenterTop">
              <strong>{center.name}</strong>
              <span className="matchVerifiedBadge">검토된 센터</span>
            </div>
            <p className="matchCenterMeta">{center.area} · {center.tags}</p>
          </li>
        ))}
      </ul>
    </MatchLayout>
  );
}
