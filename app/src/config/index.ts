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
};

export const Config: InitialConfig = {
  red: redConfig,
  blue: blueConfig,
};

export function getConfig(mode: ColorMode): ModeConfig {
  return Config[mode];
}
