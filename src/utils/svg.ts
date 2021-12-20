import { select } from "d3";

let _id = 0;

export type DrawSvgOptions = {
  selector?: string;
  id?: string;
  width: number;
  height: number;
};

/** 柱状图 */
export const drawSvg = (options: DrawSvgOptions) => {
  const { selector = "#body", id, width = 0, height = 0 } = options;

  const finalId = id ?? `svg_${++_id}`;

  const dom = select(selector);
  dom
    .append("svg")
    .attr("id", finalId)
    .attr("width", width)
    .attr("height", height);

  return dom.select(`#${finalId}`);
};

export const clearSvg = (selector: string) => {
  if (!selector) {
    return;
  }
  select(selector).selectAll("svg").remove();
};
