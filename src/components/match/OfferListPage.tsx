import { Link, useSearchParams } from "react-router-dom";
import { ensureReviewOffers, loadOffers, getOfferStatusLabel, type Offer } from "../../lib/offers";
import MatchLayout from "./MatchLayout";

function OfferCard({ offer, reviewSuffix }: { offer: Offer; reviewSuffix: string }) {
  const createdDate = new Date(offer.createdAt).toLocaleDateString("ko-KR");

  return (
    <li className="matchOfferCard">
      <div className="matchOfferTop">
        <strong>{offer.centerName}</strong>
        <span className={`matchStatusBadge ${offer.status}`}>
          {getOfferStatusLabel(offer.status)}
        </span>
      </div>
      <p className="matchOfferMeta">
        {offer.employmentType} · {offer.salary || "급여 협의"} · {offer.startDate || "시작일 협의"}
      </p>
      <p className="matchOfferMeta">제안일 {createdDate}</p>
      {offer.message ? <p className="matchOfferMessage">“{offer.message}”</p> : null}
      <div className="matchOfferFooter">
        <span className="matchOfferMeta">받는 사람 · {offer.trainerName}</span>
        <Link className="matchDetailLink" to={`/trainer/offers/${offer.id}${reviewSuffix}`}>
          제안 상세 보기 →
        </Link>
      </div>
    </li>
  );
}

export default function OfferListPage() {
  const [searchParams] = useSearchParams();
  const reviewMode = searchParams.get("review") === "1";
  const reviewSuffix = reviewMode ? "?review=1" : "";
  const offers = reviewMode ? ensureReviewOffers() : loadOffers();
  const pending = offers.filter((offer) => offer.status === "pending");
  const past = offers.filter((offer) => offer.status !== "pending");

  return (
    <MatchLayout
      role="candidate"
      title="채용 제안"
      backTo={`/trainer/certified${reviewSuffix}`}
      backLabel="인증 완료"
    >
      <p className="matchEyebrow">트레이너 · 받은 제안</p>
      <h1 className="matchTitle">채용 제안 목록</h1>
      <p className="matchLead">센터 대표가 보낸 제안을 확인하고 조건을 검토할 수 있어요.</p>
      <p className="matchUtilityRow">
        <Link className="matchDetailLink" to={`/notifications${reviewSuffix}`}>알림 목록 보기 →</Link>
      </p>

      {pending.length === 0 ? (
        <div className="matchEmpty spaced">
          <p>아직 받은 채용 제안이 없습니다.</p>
          <p>인증과 프로필 완성도가 높을수록 센터 대표에게 더 잘 노출됩니다.</p>
        </div>
      ) : (
        <>
          <h2 className="matchSectionTitle">대기 중인 제안 {pending.length}건</h2>
          <ul className="matchOfferList">
            {pending.map((offer) => <OfferCard key={offer.id} offer={offer} reviewSuffix={reviewSuffix} />)}
          </ul>
        </>
      )}

      {past.length > 0 ? (
        <>
          <h2 className="matchSectionTitle">처리한 제안</h2>
          <ul className="matchOfferList">
            {past.map((offer) => <OfferCard key={offer.id} offer={offer} reviewSuffix={reviewSuffix} />)}
          </ul>
        </>
      ) : null}
    </MatchLayout>
  );
}
