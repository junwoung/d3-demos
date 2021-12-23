import { Selection, BaseType } from "d3";
import { drawSvg } from "../../utils";

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

export class DrawPanel<T = {}> {
  panel: Selection<BaseType, unknown, HTMLElement, any> | null;
  width: number;
  height: number;

  constructor(props: DrawPanelProps) {
    this.panel = null;
    this.width = props.width;
    this.height = props.height;
  }

  draw(data: T, position: PanelPosition) {
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
    this.updateContent(data);
  }

  updatePanelPosition(position: PanelPosition) {
    const { x, y } = position;
    this.panel!.attr("style", `top:${y}px;left:${x}px;`);
  }

  updateContent(data: T) {
    if (this.panel) {
      this.panel.selectAll("text").remove();

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
    }
  }

  off() {
    this.panel?.remove();
    this.panel = null;
  }
}
