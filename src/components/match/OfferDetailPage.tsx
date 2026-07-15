import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getOffer, getOfferStatusLabel, updateOfferStatus } from "../../lib/offers";
import MatchLayout from "./MatchLayout";

export default function OfferDetailPage() {
  const { offerId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reviewSuffix = searchParams.get("review") === "1" ? "?review=1" : "";
  const reviewMode = reviewSuffix !== "";
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!showDeclineModal || !modalRef.current) return undefined;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusable = Array.from(
      modalRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
    focusable[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowDeclineModal(false);
        return;
      }
      if (event.key !== "Tab" || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [showDeclineModal]);

  const offer = useMemo(() => (offerId ? getOffer(offerId, reviewMode) : null), [offerId, reviewMode]);

  if (!offer) {
    return (
      <MatchLayout role="candidate" title="제안 상세" backTo={`/trainer/offers${reviewSuffix}`} backLabel="제안 목록">
        <div className="matchEmpty">
          <p>제안을 찾을 수 없습니다.</p>
        </div>
      </MatchLayout>
    );
  }

  const decide = (next: "accepted" | "declined") => {
    const updated = updateOfferStatus(offer.id, next, reviewMode);
    if (!updated) {
      setError("이미 처리된 제안입니다.");
      return;
    }
    if (next === "accepted") {
      navigate(`/trainer/offers/${offer.id}/confirmed${reviewSuffix}`);
    } else {
      navigate(`/trainer/offers${reviewSuffix}`);
    }
  };

  return (
    <MatchLayout role="candidate" title="제안 상세" backTo={`/trainer/offers${reviewSuffix}`} backLabel="제안 목록">
      <p className="matchEyebrow">트레이너 · 채용 제안</p>
      <h1 className="matchTitle">{offer.centerName}</h1>
      <dl className="matchDetailList">
        <div><dt>고용 형태</dt><dd>{offer.employmentType}</dd></div>
        <div><dt>급여 조건</dt><dd>{offer.salary || "협의"}</dd></div>
        <div><dt>시작일</dt><dd>{offer.startDate || "협의"}</dd></div>
        <div><dt>상태</dt><dd>{getOfferStatusLabel(offer.status)}</dd></div>
      </dl>

      {offer.message ? (
        <section className="matchSectionBlock">
          <h2 className="matchSectionTitle">센터 메시지</h2>
          <p className="matchOfferMessage">“{offer.message}”</p>
        </section>
      ) : null}

      {offer.status === "pending" ? (
        <>
          <p className="matchNotice">수락하면 센터 대표에게 알림이 발송되고 채용 확정 화면으로 이동합니다.</p>
          {error ? <p className="matchFeedback error">{error}</p> : null}
          <div className="matchActions">
            <button className="primaryButton" onClick={() => decide("accepted")} type="button">
              수락하기
            </button>
            <button className="dangerButton" onClick={() => setShowDeclineModal(true)} type="button">
              거절하기
            </button>
          </div>
        </>
      ) : (
        <p className="matchNotice">이 제안은 이미 처리되었습니다.</p>
      )}

      <Link className="matchDetailLink" to={`/trainer/offers${reviewSuffix}`}>
        제안 목록으로 돌아가기
      </Link>

      {showDeclineModal ? (
        <div className="matchModalBackdrop" onClick={() => setShowDeclineModal(false)} role="presentation">
          <section
            aria-labelledby="decline-title"
            aria-modal="true"
            className="matchModal"
            onClick={(event) => event.stopPropagation()}
            ref={modalRef}
            role="dialog"
          >
            <h2 id="decline-title">제안을 거절할까요?</h2>
            <p>거절하면 이 제안은 다시 검토할 수 없습니다.</p>
            <div className="matchModalActions">
              <button className="secondaryButton" onClick={() => setShowDeclineModal(false)} type="button">
                취소
              </button>
              <button className="dangerButton" onClick={() => decide("declined")} type="button">
                거절하기
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </MatchLayout>
  );
}
