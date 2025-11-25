export default function ProfilePage() {
  return (
    <div className="grid" style={{ gap: 16 }}>
      <header className="card" style={{ display: "grid", gap: 6 }}>
        <div className="pill" style={{ width: "fit-content" }}>
          프로필
        </div>
        <h1 style={{ margin: 0 }}>내 정보</h1>
        <p style={{ margin: 0, color: "var(--muted)" }}>
          계정, 포인트, 고객센터로 이동합니다.
        </p>
      </header>

      <section className="card" style={{ display: "grid", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #2f8c66, #193842)",
              display: "grid",
              placeItems: "center",
              fontWeight: 800
            }}
          >
            N
          </div>
          <div>
            <div style={{ fontWeight: 700 }}>nabun_user</div>
            <div style={{ color: "var(--muted)", fontSize: 14 }}>
              eco@nabun.app
            </div>
          </div>
        </div>
        <div className="grid" style={{ gap: 10 }}>
          {[
            { title: "포인트 히스토리", desc: "적립 내역 확인" },
            { title: "설정", desc: "알림/권한/개인정보" },
            { title: "고객센터", desc: "FAQ·문의 연결" }
          ].map((item) => (
            <div
              key={item.title}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                alignItems: "center",
                padding: "10px 0",
                borderBottom: "1px solid var(--border)"
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>{item.title}</div>
                <div style={{ color: "var(--muted)", fontSize: 14 }}>
                  {item.desc}
                </div>
              </div>
              <span style={{ color: "var(--muted)" }}>›</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
