import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { loadNotifications, markAllRead, type AppNotification } from "../../lib/notifications";
import MatchLayout from "./MatchLayout";

const TYPE_LABEL: Record<string, string> = {
  offer_received: "채용 제안 수신",
  offer_accepted: "제안 수락",
  offer_confirmed: "채용 확정"
};

export default function NotificationsPage() {
  const [searchParams] = useSearchParams();
  const reviewSuffix = searchParams.get("review") === "1" ? "?review=1" : "";
  const [items, setItems] = useState<AppNotification[]>([]);

  useEffect(() => {
    const nextItems = loadNotifications();
    setItems(nextItems);
    markAllRead();
  }, []);

  return (
    <MatchLayout role="candidate" title="알림" backTo={`/trainer/offers${reviewSuffix}`} backLabel="제안 목록">
      <p className="matchEyebrow">트레이너 · 알림</p>
      <h1 className="matchTitle">알림 목록</h1>
      <p className="matchLead">채용 제안과 확정 상태를 확인할 수 있어요.</p>

      {items.length === 0 ? (
        <div className="matchEmpty spaced">
          <p>알림이 없습니다.</p>
        </div>
      ) : (
        <ul className="matchOfferList spacedList">
          {items.map((item) => (
            <li className="matchOfferCard" key={item.id}>
              <div className="matchOfferTop">
                <strong>{TYPE_LABEL[item.type] ?? item.type}</strong>
                <span className="matchStatusBadge accepted">MVP 샘플</span>
              </div>
              <p className="matchOfferMeta">{item.message}</p>
              <p className="matchOfferMeta">
                {new Date(item.createdAt).toLocaleString("ko-KR")}
              </p>
            </li>
          ))}
        </ul>
      )}

      <p className="matchNotice spaced">현재 알림은 Firebase 연결 전 로컬 MVP 상태로 저장됩니다.</p>
      <Link className="secondaryButton matchBlockButton" to={`/trainer/offers${reviewSuffix}`}>
        제안 목록으로 돌아가기
      </Link>
    </MatchLayout>
  );
}
