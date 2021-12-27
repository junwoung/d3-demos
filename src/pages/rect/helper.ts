import { Selection, BaseType } from "d3";
import { drawSvg } from "../../utils";
import { ScoreItem } from "./config";

/** 获取各项之和 */
export const getTotal = (item: any) => {
  return Object.values(item).reduce(
    (prev, cur) => (prev as number) + (cur as any),
    0
  ) as number;
};

/** rect可绘制的最大高度 */
export const getRectMaxHeight = (svgConfig: any) => {
  const { height, padding } = svgConfig;
  return height - padding.top - padding.bottom;
};

/** rect可绘制的最大宽度 */
export const getRectMaxWidth = (svgConfig: any) => {
  const { width, padding } = svgConfig;
  return width - padding.left - padding.right;
};

const SubjectMaps = {
  math: "数学",
  eng: "英语",
  chn: "语文",
};

export type PanelPosition = {
  x: number;
  y: number;
};
export interface DrawPanelProps {
  width: number;
  height: number;
}

/**
 * 封装绘制&更新具体分数modal能力
 */
export class DrawPanel<T = {}> {
  panel: Selection<BaseType, unknown, HTMLElement, any> | null;
  width: number;
  height: number;

  constructor(props: DrawPanelProps) {
    this.panel = null;
    this.width = props.width;
    this.height = props.height;
  }

  draw(data: T, position: PanelPosition, key?: keyof typeof SubjectMaps) {
    const { x, y } = position;

    if (!this.panel) {
      const panel = drawSvg({
        selector: "body",
        width: this.width,
        height: this.height,
      });

      panel
        .attr("class", "score-panel")
        .attr("style", `top:${y}px;left:${x}px;`);

      this.panel = panel;
    } else {
      this.updatePanelPosition(position);
    }
    this.updateContent(data, key);
  }

  updatePanelPosition(position: PanelPosition) {
    const { x, y } = position;
    this.panel!.attr("style", `top:${y}px;left:${x}px;`);
  }

  updateContent(data: T, key?: keyof typeof SubjectMaps) {
    if (this.panel) {
      this.panel.selectAll("text").remove();

      if (!key) {
        Object.keys(data).forEach((item, idx) => {
          const text = `${SubjectMaps[item as keyof typeof SubjectMaps]}：${
            (data as any)[item]
          }`;

          this.panel!.insert("text")
            .attr("x", 15)
            .attr("y", 20 + 30 * idx)
            .text(text)
            .attr("fill", "white");
        });
      } else {
        this.panel
          .insert("text")
          .attr("x", 15)
          .attr("y", 20)
          .text(`${SubjectMaps[key]}：${(data as any)[key]}`)
          .attr("fill", "white");

        this.panel.attr("height", 30);
      }
    }
  }

  off() {
    this.panel?.remove();
    this.panel = null;
  }
}

/** 下载svg成png */
export const downloadSvg = (svg: SVGElement) => {
  const serializer = new XMLSerializer();
  const source = `<?xml version="1.0" standalone="no"?>\r\n${serializer.serializeToString(
    svg
  )}`;

  const imgSrc = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    source
  )}`;
  const canvas = document.createElement("canvas");
  canvas.width = Number(svg.clientWidth);
  canvas.height = Number(svg.clientHeight);

  const ctx = canvas!.getContext("2d");
  const image = new Image();
  image.src = imgSrc;

  image.onload = () => {
    ctx?.drawImage(image, 0, 0);
    const canvasData = canvas?.toDataURL("image/png")!;

    const a = document.createElement("a");
    a.download = "d3_svg下载.png";
    a.href = canvasData;
    document.body.appendChild(a);
    a.click();
  };
};

/** 处理分段柱状图 各部分数据高度、定位等数据 */
export const formatPartRectData = (rawData: ScoreItem, totalHeight: number) => {
  const total = getTotal(rawData);

  return Object.keys(rawData).reduce(
    (prev, cur) => {
      const key = cur as keyof ScoreItem;
      const rate = rawData[key] / total;
      const y = prev.reduce((p, c) => p + c.height, 0);

      const item = {
        key,
        height: rate * totalHeight,
        y,
      };
      return [...prev, item];
    },
    [] as {
      key: keyof ScoreItem;
      height: number;
      y: number;
    }[]
  );
};
