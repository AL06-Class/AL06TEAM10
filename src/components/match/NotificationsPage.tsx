import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppNotification, loadNotifications, markAllRead } from "../../lib/notifications";
import { pageStyles as s } from "./matchStyles";

const TYPE_LABEL: Record<string, string> = {
  offer_received: "채용 제안 수신",
  offer_accepted: "제안 확정",
  offer_confirmed: "채용 확정"
};

export default function NotificationsPage() {
  const [items, setItems] = useState<AppNotification[]>([]);

  useEffect(() => {
    setItems(loadNotifications());
    markAllRead();
  }, []);

  return (
    <div style={s.page}>
      <div style={s.card}>
        <p style={s.kicker}>알림</p>
        <h1 style={s.title}>알림 목록</h1>
        {items.length === 0 ? (
          <p style={s.desc}>알림이 없습니다.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
            {items.map((n) => (
              <div key={n.id} style={{ ...s.listItem, backgroundColor: n.read ? "#fff" : "#f0f7f8" }}>
                <p style={s.listItemTitle}>{TYPE_LABEL[n.type] ?? n.type}</p>
                <p style={s.listItemMeta}>{n.message}</p>
                <p style={{ ...s.listItemMeta, fontSize: 12 }}>
                  {new Date(n.createdAt).toLocaleString("ko-KR")}
                </p>
              </div>
            ))}
          </div>
        )}
        <div style={s.actions}>
          <Link to="/trainer/offers" style={s.secondaryLink}>
            제안 목록으로
          </Link>
        </div>
      </div>
    </div>
  );
}
