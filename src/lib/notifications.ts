export type NotificationType =
  | "offer_received"
  | "offer_accepted"
  | "offer_confirmed";

export interface AppNotification {
  id: string;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: string;
}

const STORAGE_KEY = "match-notifications";

export function loadNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function pushNotification(type: NotificationType, message: string) {
  const list = loadNotifications();
  const item: AppNotification = {
    id: `noti-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    message,
    read: false,
    createdAt: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([item, ...list]));
}

export function markAllRead() {
  const list = loadNotifications().map((n) => ({ ...n, read: true }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function unreadCount(): number {
  return loadNotifications().filter((n) => !n.read).length;
}
