import { getTreeStage, rewardTable, treeStages } from "@/lib/reward";

const labelName: Record<string, string> = {
  plastic: "플라스틱",
  paper: "종이",
  metal: "금속",
  glass: "유리",
  box: "박스",
  trash: "일반"
};

const recentScans = [
  { label: "plastic", reward: rewardTable.plastic, note: "헹궈서 투명봉투", when: "오늘 14:20" },
  { label: "paper", reward: rewardTable.paper, note: "테이프 제거 후 배출", when: "오늘 10:02" },
  { label: "metal", reward: rewardTable.metal, note: "내용물 비우고 배출", when: "어제" }
];

export default function HomePage() {
  const points = 72;
  const stage = getTreeStage(points);
  const nextStage = treeStages.find((s) => s.min > stage.min) ?? null;
  const rangeStart = stage.min;
  const rangeEnd =
    nextStage?.min ?? (stage.max ? stage.max + 30 : points + 50);
  const progress = Math.max(
    0,
    Math.min(1, (points - rangeStart) / Math.max(1, rangeEnd - rangeStart))
  );

  return (
    <>
      <section className="card" style={{ display: "grid", gap: 14 }}>
        <div className="pill" style={{ width: "fit-content" }}>
          NABUN · 실시간 분리배출
        </div>
        <div style={{ display: "grid", gap: 12, justifyItems: "center" }}>
          <div
            style={{
              width: "min(88vw, 320px)",
              height: "min(88vw, 320px)",
              borderRadius: 16,
              background:
                "radial-gradient(circle at 28% 18%, rgba(58,210,159,0.28), transparent 45%), radial-gradient(circle at 70% 75%, rgba(12,27,31,0.9), #0b171c)",
              border: "1px solid rgba(31,52,62,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "min(22vw, 80px)",
              boxShadow: "0 12px 28px rgba(0,0,0,0.32)"
            }}
            aria-label="성장 나무"
          >
            🌳
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              alignItems: "center",
              gap: 12,
              width: "100%",
              background:
                "linear-gradient(135deg, rgba(58,210,159,0.16), rgba(17,32,38,0.7))",
              border: "1px solid rgba(31,52,62,0.5)",
              borderRadius: 14,
              padding: 14
            }}
          >
            <div
              style={{
                width: 18,
                height: 160,
                background: "#0f1f27",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.05)",
                position: "relative",
                overflow: "hidden"
              }}
              aria-label="성장 진행도"
            >
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: `${(progress * 100).toFixed(1)}%`,
                  background:
                    "linear-gradient(180deg, rgba(58,210,159,0.9), rgba(43,178,132,0.7))"
                }}
              />
            </div>
            <div style={{ display: "grid", gap: 6 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>
                성장 진행 · {stage.name}
              </div>
              <div style={{ color: "var(--muted)", fontSize: 14 }}>
                {nextStage
                  ? `다음 단계 ${nextStage.name}까지 ${Math.max(
                      0,
                      Math.ceil(rangeEnd - points)
                    )}p 남음`
                  : "최종 단계"}
              </div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>
                {points}p / 목표 {rangeEnd}p
              </div>
            </div>
          </div>
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(58,210,159,0.18), rgba(58,210,159,0.05))",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: 14,
              display: "grid",
              gap: 8,
              width: "100%"
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 16, textAlign: "center" }}>
              {stage.name}
            </div>
            <div style={{ color: "var(--muted)", fontSize: 14, textAlign: "center" }}>
              {stage.description}
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginTop: 20 }} className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12
          }}
        >
          <h2 style={{ margin: 0 }}>최근 스캔</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              className="pill"
              style={{
                background: "#0f1f27",
                color: "var(--text)",
                borderColor: "var(--border)"
              }}
            >
              포인트 {points}p
            </div>
            <span style={{ color: "var(--muted)", fontSize: 14 }}>자동 저장</span>
          </div>
        </div>
        <div className="grid">
          {recentScans.map((item) => (
            <div
              key={item.when + item.label}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                alignItems: "center",
                gap: 8,
                padding: "12px 0",
                borderBottom: "1px solid var(--border)"
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>
                  {labelName[item.label] ?? item.label}
                </div>
                <div style={{ color: "var(--muted)", fontSize: 14 }}>
                  {item.note}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 18, color: "var(--accent)" }}>
                  +{item.reward}p
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>
                  {item.when}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 16 }} className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10
          }}
        >
          <h2 style={{ margin: 0 }}>점수</h2>
          <span style={{ color: "var(--muted)", fontSize: 14 }}>라벨별 적립</span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: 10
          }}
        >
          {Object.entries(rewardTable).map(([key, value]) => (
            <div
              key={key}
              className="card"
              style={{
                padding: 12,
                borderRadius: 12,
                background: "#0f1f27",
                border: "1px dashed var(--border)"
              }}
            >
              <div style={{ fontSize: 12, color: "var(--muted)" }}>
                {labelName[key] ?? key}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>
                +{value}p
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 10,
            background: "#0f1f27",
            border: "1px dashed var(--border)",
            borderRadius: 12,
            padding: 12,
            color: "var(--muted)",
            fontSize: 14,
            lineHeight: 1.5
          }}
        >
          <div style={{ fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
            점수 안내
          </div>
          스캔 결과 라벨에 따라 포인트가 차등 적립됩니다. 포인트가 쌓이면 성장 단계를 올려
          나무를 키울 수 있어요. 내역은 최근 스캔과 프로필에서 확인할 수 있습니다.
        </div>
      </section>
    </>
  );
}
