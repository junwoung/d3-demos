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
