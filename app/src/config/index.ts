import type {
  ColorMode,
  ModeConfig,
  InitialConfig,
  BeltAcceleration,
} from "../types/config";

export const defaultBeltAcceleration: BeltAcceleration = {
  fix1: 10,
  fix2: 20,
  fix3: 30,
  table: 40,
};

const redConfig: ModeConfig = {
  stage: {
    size: { width: 5850, height: 10800 },
    margin: {
      left: 300,
      right: 150,
      top: 150,
      bottom: 150,
    },
  },
  field: {
    size: { width: 5400, height: 10500 },
    imagePath: "/fieldRedImage.png",
  },
  robot: {
    originPosition: { x: 1500, y: 10500 - 500 },
    offset: { x: 500, y: 500 },
    size: { width: 1000, height: 1000 },
    direction: 0,
  },
  obstacles: [
    {
      shape: "rect",
      position: { x: 3000, y: 5000 },
      size: { width: 500, height: 500 },
      direction: 0,
      label: "学習椅子",
    },
    {
      shape: "circle",
      position: { x: 5000, y: 7000 },
      radius: 300,
      label: "カラーコーン",
    },
  ],
  targetPositions: [
    { x: 0, y: 0, direction: 0, label: "赤スタート" },

    // { x: 0, y: 1500, direction: 0, label: "Pos1経由" },
    { x: 900, y: 2721, direction: 90, label: "Pos1" },

    // { x: 900, y: 4266, direction: 90, label: "Pos2経由" },
    { x: 900, y: 3766, direction: 90, label: "Pos2" },

    // { x: 900, y: 4266, direction: 90, label: "Pos3経由" },
    { x: 0, y: 5586, direction: 90, label: "Pos3" },

    // { x: 900, y: 4266, direction: 90, label: "Pos4経由" },
    { x: 900, y: 7406, direction: 90, label: "Pos4" },

    // { x: 900, y: 4266, direction: 90, label: "Pos5経由" },
    { x: 900, y: 8431, direction: 90, label: "Pos5" },
  ],

  firstActionPosition: {
    x: 1000,
    y: 1000,
    direction: 0,
  },
};

const blueConfig: ModeConfig = {
  stage: {
    size: { width: 5850, height: 10800 },
    margin: {
      left: 150,
      right: 300,
      top: 150,
      bottom: 150,
    },
  },
  field: {
    size: { width: 5400, height: 10500 },
    imagePath: "/fieldBlueImage.png",
  },
  robot: {
    originPosition: { x: 3900, y: 10500 - 500 },
    offset: { x: 500, y: 500 },
    size: { width: 1000, height: 1000 },
    direction: 0,
  },
  obstacles: [
    {
      shape: "rect",
      position: { x: 3000, y: 5000 },
      size: { width: 500, height: 500 },
      direction: 0,
      label: "学習椅子",
    },
    {
      shape: "circle",
      position: { x: 1000, y: 7000 },
      radius: 300,
      label: "カラーコーン",
    },
  ],
  targetPositions: [
    { x: 0, y: 0, direction: 0, label: "青スタート" },

    // { x: 0, y: 1500, direction: 0, label: "Pos1経由" },
    { x: -900, y: 2721, direction: -90, label: "Pos1" },

    // { x: 900, y: 4266, direction: 90, label: "Pos2経由" },
    { x: -900, y: 3766, direction: -90, label: "Pos2" },

    // { x: 900, y: 4266, direction: 90, label: "Pos3経由" },
    { x: 0, y: 5586, direction: -90, label: "Pos3" },

    // { x: 900, y: 4266, direction: 90, label: "Pos4経由" },
    { x: -900, y: 7406, direction: -90, label: "Pos4" },

    // { x: 900, y: 4266, direction: 90, label: "Pos5経由" },
    { x: -900, y: 8431, direction: -90, label: "Pos5" },
  ],

  firstActionPosition: {
    x: 1000,
    y: -1000,
    direction: 0,
  },
};

export const Config: InitialConfig = {
  red: redConfig,
  blue: blueConfig,
};

export function getConfig(mode: ColorMode): ModeConfig {
  return Config[mode];
}
