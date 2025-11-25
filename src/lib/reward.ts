export const rewardTable = {
  plastic: 5,
  paper: 4,
  metal: 4,
  glass: 4,
  box: 3,
  trash: 1
} as const;

export type LabelKey = keyof typeof rewardTable;

export function rewardForLabel(label: LabelKey) {
  return rewardTable[label] ?? 0;
}

export type TreeStage = {
  name: string;
  min: number;
  max?: number;
  description: string;
};

export const treeStages: TreeStage[] = [
  { name: "씨앗", min: 0, max: 20, description: "첫 분리배출을 시작했어요." },
  { name: "새싹", min: 21, max: 50, description: "꾸준히 성장 중!" },
  { name: "어린 나무", min: 51, max: 100, description: "습관이 자리잡고 있어요." },
  { name: "상록", min: 101, description: "환경 수호자 등급 달성!" }
];

export function getTreeStage(points: number): TreeStage {
  return (
    treeStages.find(
      (stage) =>
        points >= stage.min && (stage.max === undefined || points <= stage.max)
    ) ?? treeStages[0]
  );
}
