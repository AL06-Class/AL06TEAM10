import type { CSSProperties } from "react";

export const pageStyles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f7f8",
    display: "flex",
    justifyContent: "center",
    padding: "48px 16px"
  },
  card: {
    width: "100%",
    maxWidth: 560,
    backgroundColor: "#fff",
    borderRadius: 12,
    border: "1px solid #e3e8ea",
    padding: 36,
    height: "fit-content"
  },
  emoji: { fontSize: 56, textAlign: "center" },
  kicker: { color: "#1d6f7a", fontWeight: 700, fontSize: 13, margin: 0 },
  title: { fontSize: 26, margin: "8px 0 8px" },
  badge: {
    display: "inline-block",
    backgroundColor: "#e6f4ea",
    color: "#1e7e34",
    fontWeight: 700,
    borderRadius: 999,
    padding: "8px 18px",
    fontSize: 14,
    margin: "8px 0"
  },
  desc: { color: "#546e7a", lineHeight: 1.7 },
  actions: { display: "flex", flexDirection: "column", gap: 10, marginTop: 24 },
  primaryLink: {
    backgroundColor: "#1d6f7a",
    color: "#fff",
    borderRadius: 8,
    padding: "14px 20px",
    fontSize: 15,
    fontWeight: 700,
    textDecoration: "none",
    textAlign: "center"
  },
  secondaryLink: {
    color: "#1d6f7a",
    border: "1px solid #1d6f7a",
    borderRadius: 8,
    padding: "13px 20px",
    fontSize: 15,
    fontWeight: 700,
    textDecoration: "none",
    textAlign: "center"
  },
  primaryBtn: {
    backgroundColor: "#1d6f7a",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "14px 20px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    width: "100%",
    marginTop: 12
  },
  label: { display: "block", fontWeight: 700, fontSize: 14, margin: "12px 0 4px" },
  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #cfd8dc",
    borderRadius: 8,
    padding: "12px 14px",
    fontSize: 15
  },
  notice: {
    color: "#8a6d1a",
    backgroundColor: "#fdf6e3",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    marginTop: 16
  },
  feedbackMsg: { fontWeight: 700, fontSize: 14, marginTop: 12 },
  listItem: { border: "1px solid #e3e8ea", borderRadius: 10, padding: 16 },
  listItemTitle: { margin: 0, fontWeight: 700, fontSize: 16 },
  listItemMeta: { margin: "4px 0 0", color: "#6b7a80", fontSize: 14 }
};
