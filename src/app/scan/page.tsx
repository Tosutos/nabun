"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as tmImage from "@teachablemachine/image";
import { LabelKey, rewardForLabel } from "@/lib/reward";

type TmModel = tmImage.CustomMobileNet | null;

type HistoryItem = { label: LabelKey; probability: number };

const MODEL_URL = "/models/model.json";
const METADATA_URL = "/models/metadata.json";
const HISTORY_SIZE = 10;
const LOCK_THRESHOLD = 0.9;
const LOCK_DURATION_MS = 3000;
const LABEL_LIST: LabelKey[] = [
  "box",
  "glass",
  "metal",
  "paper",
  "plastic",
  "trash"
];

const friendlyLabel: Record<LabelKey, string> = {
  box: "박스",
  glass: "유리",
  metal: "금속",
  paper: "종이",
  plastic: "플라스틱",
  trash: "일반"
};

export default function ScanPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const modelRef = useRef<TmModel>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const stableLabelRef = useRef<LabelKey | null>(null);
  const stableStartRef = useRef<number | null>(null);
  const statusRef = useRef<
    "idle" | "loading-model" | "loading-camera" | "running" | "locked" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [latestConfidence, setLatestConfidence] = useState<
    { label: string; probability: number }[]
  >([]);
  const [status, setStatus] = useState<
    "idle" | "loading-model" | "loading-camera" | "running" | "locked" | "error"
  >("idle");
  const [lockedResult, setLockedResult] = useState<{
    label: LabelKey;
    confidence: number;
  } | null>(null);
  const [frozenFrame, setFrozenFrame] = useState<string | null>(null);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    let mounted = true;
    const setup = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("이 브라우저에서는 카메라 접근이 지원되지 않아요.");
        setStatus("error");
        return;
      }

      try {
        setStatus("loading-model");
        const loadedModel = await tmImage.load(MODEL_URL, METADATA_URL);
        if (!mounted) return;
        modelRef.current = loadedModel;
        await startCamera(loadedModel);
      } catch (err) {
        console.error(err);
        setError("카메라 또는 모델을 불러오지 못했어요.");
        setStatus("error");
      }
    };

    setup();

    return () => {
      mounted = false;
      stopLoop();
      stopStream();
    };
  }, []);

  const startCamera = async (loadedModel: tmImage.CustomMobileNet) => {
    setStatus("loading-camera");
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    });
    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }
    resetLock();
    loopPredictions(loadedModel);
  };

  const loopPredictions = (loadedModel: tmImage.CustomMobileNet) => {
    setStatus("running");
    statusRef.current = "running";

    const loop = async () => {
      if (statusRef.current === "locked") return;
      if (!videoRef.current) return;

      const predictions = await loadedModel.predict(videoRef.current);
      setLatestConfidence(
        predictions
          .map((p) => ({
            label: p.className,
            probability: p.probability
          }))
          .sort((a, b) => b.probability - a.probability)
      );

      const top = predictions.reduce((best, current) =>
        current.probability > best.probability ? current : best
      );

      if (isLabelKey(top.className)) {
        const label = top.className;
        setHistory((prev) =>
          [{ label, probability: top.probability }, ...prev].slice(
            0,
            HISTORY_SIZE
          )
        );

        const now = performance.now();
        if (
          top.probability >= LOCK_THRESHOLD &&
          stableLabelRef.current === label
        ) {
          if (stableStartRef.current && now - stableStartRef.current >= LOCK_DURATION_MS) {
            lockResult(label, top.probability);
            return;
          }
        } else if (top.probability >= LOCK_THRESHOLD) {
          stableLabelRef.current = label;
          stableStartRef.current = now;
        } else {
          stableLabelRef.current = null;
          stableStartRef.current = null;
        }
      }

      timerRef.current = window.setTimeout(loop, 220);
    };

    loop();
  };

  const lockResult = (label: LabelKey, confidence: number) => {
    const frame = captureFrame(videoRef.current);
    if (frame) {
      setFrozenFrame(frame);
    }
    setLockedResult({ label, confidence });
    setStatus("locked");
    statusRef.current = "locked";
    stopLoop();
    stopStream();
  };

  const stopLoop = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const resetLock = () => {
    setLockedResult(null);
    stableLabelRef.current = null;
    stableStartRef.current = null;
  };

  const handleRetake = async () => {
    resetLock();
    setHistory([]);
    setLatestConfidence([]);
    setFrozenFrame(null);
    if (modelRef.current) {
      try {
        await startCamera(modelRef.current);
      } catch (err) {
        setError("카메라를 다시 켜지 못했어요.");
        setStatus("error");
      }
    }
  };

  const handleNext = () => {
    if (!lockedResult) return;
    const query = new URLSearchParams({
      label: lockedResult.label,
      conf: lockedResult.confidence.toFixed(2)
    });
    router.push(`/scan/result?${query.toString()}`);
  };

  const stable = useMemo(() => {
    if (!history.length) return null;
    const tally = new Map<LabelKey, number>();
    history.forEach((item) => {
      tally.set(item.label, (tally.get(item.label) ?? 0) + item.probability);
    });
    const [label, score] =
      [...tally.entries()].sort((a, b) => b[1] - a[1])[0] ?? [];
    if (!label) return null;
    const confidence = Math.min(1, score / history.length);
    return { label, confidence };
  }, [history]);

  const reward = stable ? rewardForLabel(stable.label) : 0;
  const display = lockedResult ?? stable;

  return (
    <div className="grid" style={{ gap: 16 }}>
      <header className="card" style={{ display: "grid", gap: 10 }}>
        <div className="pill" style={{ width: "fit-content" }}>
          실시간 스캔 · TM 모델
        </div>
        <h1 style={{ margin: 0 }}>카메라로 분류하기</h1>
        <p style={{ color: "var(--muted)", margin: 0 }}>
          카메라를 재활용품에 비추면 라벨을 인식하고 포인트를 계산합니다.
          원치 않을 때는 브라우저에서 카메라 권한을 꺼주세요.
        </p>
      </header>

      <section
        className="card"
        style={{
          display: "grid",
          gap: 12,
          position: "relative"
        }}
      >
        <div
          style={{
            background: "#0b1418",
            borderRadius: 14,
            border: "1px solid var(--border)",
            overflow: "hidden",
            position: "relative"
          }}
        >
          {frozenFrame ? (
            <img
              src={frozenFrame}
              alt="촬영된 프레임"
              style={{ width: "100%", display: "block", maxHeight: 360, objectFit: "cover" }}
            />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ width: "100%", display: "block", maxHeight: 360 }}
            />
          )}
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              background: "rgba(0,0,0,0.4)",
              borderRadius: 10,
              padding: "8px 12px",
              border: "1px solid var(--border)",
              backdropFilter: "blur(6px)"
            }}
          >
            <div style={{ fontWeight: 700 }}>
              {display ? friendlyLabel[display.label] : "대기 중"}
            </div>
            <div style={{ color: "var(--muted)", fontSize: 12 }}>
              {statusLabel(status)}
            </div>
          </div>
        </div>
        {display ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 8,
              alignItems: "center"
            }}
          >
            <div>
              <div style={{ fontSize: 14, color: "var(--muted)" }}>예상 결과</div>
              <div style={{ fontSize: 26, fontWeight: 800 }}>
                {friendlyLabel[display.label]} · {(display.confidence * 100).toFixed(1)}%
              </div>
              <div style={{ color: "var(--muted)", fontSize: 14 }}>
                이 라벨로 분류되면 +{rewardForLabel(display.label)} 포인트
              </div>
            </div>
            {lockedResult ? (
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={handleNext}
                  className="pill"
                  style={{
                    background: "var(--accent)",
                    color: "#0c1b1f",
                    border: "none",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  다음으로
                </button>
                <button
                  onClick={handleRetake}
                  className="pill"
                  style={{
                    background: "#0f1f27",
                    borderColor: "var(--border)",
                    color: "var(--text)",
                    cursor: "pointer"
                  }}
                >
                  다시 촬영
                </button>
              </div>
            ) : (
              <div className="pill" style={{ justifySelf: "end" }}>
                90% 이상 3초 유지 시 자동 확정
              </div>
            )}
          </div>
        ) : (
          <div style={{ color: "var(--muted)" }}>
            카메라가 켜지면 자동으로 추론을 시작해요.
          </div>
        )}
      </section>

      <section className="card" style={{ display: "grid", gap: 8 }}>
        <div style={{ fontWeight: 700 }}>실시간 확률</div>
        <div className="grid" style={{ gap: 8 }}>
          {latestConfidence.map((item) => (
            <div
              key={item.label}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                alignItems: "center",
                padding: "8px 0",
                borderBottom: "1px solid var(--border)"
              }}
            >
              <div style={{ fontWeight: 600 }}>
                {friendlyLabel[item.label as LabelKey] ?? item.label}
              </div>
              <div style={{ color: "var(--muted)" }}>
                {(item.probability * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
        {error && (
          <div
            style={{
              marginTop: 8,
              padding: "10px 12px",
              borderRadius: 10,
              background: "#2a0f0f",
              border: "1px solid #3a1919",
              color: "#ffb3b3"
            }}
          >
            {error}
          </div>
        )}
      </section>
    </div>
  );
}

function isLabelKey(value: string): value is LabelKey {
  return LABEL_LIST.includes(value as LabelKey);
}

function statusLabel(
  status: "idle" | "loading-model" | "loading-camera" | "running" | "locked" | "error"
) {
  switch (status) {
    case "loading-model":
      return "모델 불러오는 중...";
    case "loading-camera":
      return "카메라 준비 중...";
    case "running":
      return "추론 중";
    case "locked":
      return "확정됨";
    case "error":
      return "오류";
    default:
      return "대기 중";
  }
}

function captureFrame(video?: HTMLVideoElement | null): string | null {
  if (!video || !video.videoWidth || !video.videoHeight) return null;
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.85);
}
