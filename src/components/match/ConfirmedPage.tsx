import { useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { getOffer } from "../../lib/offers";
import { isMvpDemoMode } from "../../demoMode";
import MatchLayout from "./MatchLayout";

const SAMPLE_CONTACT = {
  name: "김OO 대표",
  phone: "010-1234-5678",
  email: "manager@fitproof.example"
};

export default function ConfirmedPage() {
  const { offerId } = useParams();
  const [searchParams] = useSearchParams();
  const reviewSuffix = searchParams.get("review") === "1" ? "?review=1" : "";
  const reviewMode = reviewSuffix !== "";
  const storageMode = reviewMode || isMvpDemoMode();
  const offer = useMemo(() => (offerId ? getOffer(offerId, storageMode) : null), [offerId, storageMode]);

  if (!offer || offer.status !== "accepted") {
    return (
      <MatchLayout role="candidate" title="채용 확정" backTo={`/trainer/offers${reviewSuffix}`} backLabel="제안 목록">
        <div className="matchEmpty">
          <p>확정된 제안을 찾을 수 없습니다.</p>
        </div>
      </MatchLayout>
    );
  }

  return (
    <MatchLayout
      role="candidate"
      title="채용 확정"
      backTo={`/trainer/offers${reviewSuffix}`}
      backLabel="제안 목록"
    >
      <div className="matchHero">
        <div aria-hidden="true" className="matchHeroMark">PASS</div>
        <p className="matchEyebrow">트레이너 · 채용 확정</p>
        <h1 className="matchTitle">채용이 확정되었습니다</h1>
        <div className="matchProfileSummary">
          <div className="matchProfileIdentity">
            <strong>{offer.centerName}</strong>
            <span>{offer.employmentType} · 시작일 {offer.startDate || "협의"}</span>
          </div>
          <span className="matchVerifiedBadge">채용 확정</span>
        </div>
        <div className="matchContact">
          <strong>담당자 연락처</strong>
          <span>{SAMPLE_CONTACT.name}</span>
          <a href={`tel:${SAMPLE_CONTACT.phone.replace(/-/g, "")}`}>{SAMPLE_CONTACT.phone}</a>
          <a href={`mailto:${SAMPLE_CONTACT.email}`}>{SAMPLE_CONTACT.email}</a>
        </div>
        <p className="matchNotice">채용 확정과 동시에 담당자와 연락할 수 있습니다.</p>
        <div className="matchActions centered">
          <a className="primaryButton" href={`mailto:${SAMPLE_CONTACT.email}`}>
            담당자 이메일 확인
          </a>
          <Link className="secondaryButton" to={`/trainer${reviewSuffix}`}>
            내 프로필로 돌아가기
          </Link>
        </div>
      </div>
    </MatchLayout>
  );
}
