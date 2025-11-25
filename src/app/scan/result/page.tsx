import Link from "next/link";
import { notFound } from "next/navigation";
import { rewardForLabel, LabelKey } from "@/lib/reward";

const recycleGuide: Record<LabelKey, string[]> = {
  plastic: [
    "🧴 내용물을 깨끗이 헹구고 건조하기",
    "🏷️ 라벨·뚜껑은 분리해서 배출",
    "🥤 투명 페트병은 별도 전용 수거함에"
  ],
  paper: [
    "📦 테이프·스티커·코팅 제거 후 배출",
    "☕ 종이컵은 헹구고 말려서 전용 수거함",
    "🧃 종이팩(우유·두유)은 세척 후 말려 별도로 분리"
  ],
  metal: [
    "🥫 내용물을 비우고 헹군 뒤 배출",
    "🔪 날카로운 캔 뚜껑은 따로 안전하게",
    "📏 납작하게 눌러 부피 줄이면 좋아요"
  ],
  glass: [
    "🍾 내용물 세척 후 배출, 뚜껑 분리",
    "🧊 깨진 유리는 신문지로 감싸 일반 쓰레기",
    "🔥 내열 유리는 재활용 불가, 규격 마대 배출"
  ],
  box: [
    "📦 테이프·스티커 제거 후 펼쳐서 배출",
    "🧽 오염된 부분은 잘라내거나 깨끗이 닦기",
    "📑 종이류와 함께 분리배출"
  ],
  trash: [
    "🍗 동물이 못 먹는 음식물(뼈·껍데기 등)은 일반쓰레기",
    "🗑️ 지역 규정에 맞는 종량제 봉투 사용",
    "⚠️ 음식물·재활용 불가물 섞이지 않게 분리"
  ]
};

export default function ScanResultPage({
  searchParams
}: {
  searchParams: { label?: string; conf?: string };
}) {
  const label = searchParams.label as LabelKey | undefined;
  const conf = searchParams.conf ? Number(searchParams.conf) : undefined;

  if (!label || !isLabel(label) || Number.isNaN(conf)) {
    return notFound();
  }

  const reward = rewardForLabel(label);
  const confidence = conf ?? 0;

  return (
    <div className="grid" style={{ gap: 16 }}>
      <header className="card" style={{ display: "grid", gap: 8 }}>
        <div className="pill" style={{ width: "fit-content" }}>
          스캔 결과
        </div>
        <h1 style={{ margin: 0 }}>분류 완료</h1>
        <div style={{ color: "var(--muted)" }}>
          신뢰도 {(confidence * 100).toFixed(1)}%로 분류되었습니다.
        </div>
      </header>

      <section className="card" style={{ display: "grid", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 14, color: "var(--muted)" }}>분류 라벨</div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{friendlyLabel(label)}</div>
          </div>
          <div
            className="pill"
            style={{
              background: "var(--accent)",
              color: "#0c1b1f",
              border: "none",
              fontWeight: 700
            }}
          >
            +{reward} 포인트
          </div>
        </div>
        <div
          style={{
            background: "#0f1f27",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 12,
            lineHeight: 1.5
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 6 }}>분리배출 방법</div>
          <ul style={{ margin: 0, paddingLeft: 18, color: "var(--muted)" }}>
            {recycleGuide[label].map((item) => (
              <li key={item} style={{ marginBottom: 6 }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <Tips label={label} />
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Link href="/scan" className="pill" style={{ borderColor: "var(--border)" }}>
            다시 스캔
          </Link>
          <Link
            href="/"
            className="pill"
            style={{ background: "var(--accent)", color: "#0c1b1f", border: "none", fontWeight: 700 }}
          >
            홈으로
          </Link>
        </div>
      </section>
    </div>
  );
}

function isLabel(value: string): value is LabelKey {
  return ["plastic", "paper", "metal", "glass", "box", "trash"].includes(value);
}

function friendlyLabel(label: LabelKey) {
  switch (label) {
    case "plastic":
      return "플라스틱";
    case "paper":
      return "종이";
    case "metal":
      return "금속";
    case "glass":
      return "유리";
    case "box":
      return "박스";
    case "trash":
      return "일반";
    default:
      return label;
  }
}

function Tips({ label }: { label: LabelKey }) {
  const tips: Record<LabelKey, string[]> = {
    plastic: [
      "♻️ 라벨·뚜껑 분리하면 재활용 효율 UP",
      "🚿 헹굴수록 분류 정확도와 재활용 품질이 올라가요"
    ],
    paper: [
      "✂️ 테이프·코팅 제거가 재활용 핵심",
      "☀️ 완전히 말려서 배출하면 품질이 좋아요"
    ],
    metal: [
      "🧤 날카로운 부분은 조심! 따로 처리",
      "📦 부피 줄여서 배출하면 수거 효율이 올라요"
    ],
    glass: [
      "🧴 내용물 비우기, 뚜껑 분리 필수",
      "🧊 깨진 유리는 신문지로 감싸 표시 후 일반 쓰레기"
    ],
    box: [
      "📏 펼쳐서 부피를 줄이고 테이프 제거",
      "🧼 오염 부분은 잘라내거나 닦아내기"
    ],
    trash: [
      "🗑️ 음식물/재활용 불가물은 섞이지 않게",
      "📜 종량제 규정에 맞춰 배출하기"
    ]
  };
  return (
    <div
      style={{
        background: "#0b1418",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: 12,
        color: "var(--muted)"
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 6 }}>추가 팁</div>
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        {tips[label].map((item) => (
          <li key={item} style={{ marginBottom: 6 }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
