import { drawSvg, DrawSvgOptions } from "./";

export interface DrawRectOptions extends DrawSvgOptions {
  dataSet: Array<any>;
  rect: {};
}

export const drawRect = (options: DrawRectOptions) => {};
