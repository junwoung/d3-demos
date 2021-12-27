export const scores = [
  { math: 70, chn: 75, eng: 80 },
  { math: 120, chn: 135, eng: 130 },
  { math: 90, chn: 62, eng: 87 },
  { math: 130, chn: 95, eng: 80 },
  { math: 46, chn: 42, eng: 72 },
];

export type ScoreItem = typeof scores[number];

const WIDTH = 300;
const HEIGHT = 200;

const padding = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 30,
};

const x = Math.floor((WIDTH - padding.left - padding.right) / scores.length);

export const getDefaultConfig = () => ({
  selector: "#rect-demo",
  svgConfig: {
    height: HEIGHT,
    width: WIDTH,
    padding,
  },
  dataSet: scores,
  rectConfig: {
    x,
    width: x / 2,
    color: (item: any) => {
      return "steelblue";
    },
  },
});

/** 横坐标配置 */
export const axisXList = ["一", "二", "三", "四", "五"];

/** 颜色配置 */
export const colorsMap = {
  chn: "rgb(0, 180, 42)",
  eng: "rgb(247, 186, 30)",
  math: "rgb(245, 63, 63)",
};
