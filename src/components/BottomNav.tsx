"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "홈", icon: "🏠" },
  { href: "/scan", label: "스캔", icon: "📷" },
  { href: "/profile", label: "프로필", icon: "👤" }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav style={navStyle}>
      {links.map((item) => {
        const active = pathname === item.href;
        return (
          <Link key={item.href} href={item.href} style={linkStyle(active)}>
            <span style={{ fontSize: "18px" }}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

const navStyle: React.CSSProperties = {
  position: "fixed",
  bottom: 12,
  left: "50%",
  transform: "translateX(-50%)",
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  alignItems: "center",
  gap: "8px",
  background: "#0f1f27",
  border: "1px solid #1f343e",
  borderRadius: 18,
  padding: "8px 12px",
  width: "min(480px, 92%)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.35)"
};

const linkStyle = (active: boolean): React.CSSProperties => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 4,
  padding: "10px 8px",
  color: active ? "var(--text)" : "var(--muted)",
  background: active ? "#122b35" : "transparent",
  borderRadius: 12,
  fontWeight: 600,
  border: active ? "1px solid var(--border)" : "1px solid transparent"
});
