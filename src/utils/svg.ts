import { select } from "d3";

let _id = 0;

export interface DrawSvgOptions {
  selector?: string;
  id?: string;
  width: number;
  height: number;
}

/** 绘制一个空的svg画布 */
export const drawSvg = (options: DrawSvgOptions) => {
  const { selector = "body", id, width = 0, height = 0 } = options;

  const finalId = id ?? `svg_${++_id}`;

  const dom = select(selector);
  dom
    .append("svg")
    .attr("id", finalId)
    .attr("width", width)
    .attr("height", height);

  return dom.select(`#${finalId}`);
};

/** 清除指定节点下面的所有svg画布 */
export const clearSvg = (selector: string) => {
  if (!selector) {
    return;
  }
  select(selector).selectAll("svg").remove();
};
