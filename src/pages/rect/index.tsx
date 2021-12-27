import React, { useEffect, useCallback } from "react";
import {
  select,
  scaleLinear,
  scaleBand,
  max,
  range,
  axisLeft,
  axisBottom,
} from "d3";
import { drawSvg, clearSvg } from "../../utils";
import {
  getTotal,
  getRectMaxHeight,
  getRectMaxWidth,
  DrawPanel,
  downloadSvg,
} from "./helper";
import { ScoreItem, getDefaultConfig, axisXList } from "./config";
import "./index.css";

const scorePannel = new DrawPanel<ScoreItem>({ width: 100, height: 100 });
const defaultConfig = getDefaultConfig();

/** 绘制柱状图 */
export const drawRect = (config = defaultConfig) => {
  const { svgConfig, selector, dataSet, rectConfig } = config;
  const svg = drawSvg({ selector, ...svgConfig });

  const domainMax = max([
    ...dataSet.map((item) => getTotal(item)),
    svgConfig.height,
  ]);
  // 设置Y比例尺
  const scaleY = scaleLinear()
    .domain([0, domainMax || 0])
    // svg画布的起点是左上角，range这里需要把0映射到Y轴的0（即画布可绘制的最远端）
    .range([getRectMaxHeight(svgConfig), 0]);
  // 设置坐标轴Y
  const axisY = axisLeft(scaleY).ticks(5);
  // 设置X轴，X轴不需要线性比例尺
  const scaleX = scaleBand()
    .domain(range(dataSet.length).map((item) => axisXList[item]))
    .range([0, getRectMaxWidth(svgConfig)]);
  const axisX = axisBottom(scaleX);

  svg
    .selectAll("rect")
    .data(dataSet)
    .enter()
    .append("rect")
    .on("mousemove", (e, data) => {
      scorePannel.draw(data, { x: e.clientX + 2, y: e.clientY + 2 });
    })
    .on("mouseleave", () => scorePannel.off())
    // 设置rect 的x,y坐标起点
    .attr("x", function (_, idx) {
      return (
        idx * rectConfig.x +
        (rectConfig.x - rectConfig.width) / 2 +
        svgConfig.padding.left
      );
    })
    .attr("y", (data) => {
      //
      return scaleY(getTotal(data)) + svgConfig.padding.top;
    })
    // 设置宽高
    .attr("width", rectConfig.width)
    .attr("height", 0)
    .transition()
    .delay(0)
    .duration(1500)
    .attr("height", (data) => {
      // 因为Y轴的坐标系定义是反方向的，所以需要拿可绘制的最大高度-缩放后留白区域的高度
      return getRectMaxHeight(svgConfig) - scaleY(getTotal(data));
    })
    .attr("fill", (data) => {
      return rectConfig.color(data);
    })
    .transition()
    .delay(100)
    .duration(500)
    .attr("fill", (data) => {
      return getTotal(data) > 250 ? "rgb(0,180,42)" : "rgb(245, 63, 63)";
    });

  // 显示具体高度数据
  svg
    .selectAll("rext")
    .data(dataSet)
    .enter()
    .append("text")
    .attr(
      "x",
      (_, idx) =>
        idx * rectConfig.x +
        (rectConfig.x - rectConfig.width) / 2 +
        svgConfig.padding.left +
        rectConfig.width / 2
    )
    .attr("text-anchor", "middle")
    .attr("y", (data) => {
      return scaleY(getTotal(data)) + svgConfig.padding.top;
    })
    .attr("width", rectConfig.width)
    .attr("height", (data) => {
      return getRectMaxHeight(svgConfig) - scaleY(getTotal(data));
    })
    .attr("fill", "red")
    .attr("font-size", "12")
    .attr("transform", "translate(0,-2)")
    .text((data) => {
      return getTotal(data);
    });

  // 添加坐标轴
  svg
    .append("g")
    .call(axisY)
    .attr(
      "transform",
      `translate(${svgConfig.padding.left}, ${svgConfig.padding.top})`
    );
  svg
    .append("g")
    .call(axisX)
    .attr(
      "transform",
      `translate(${svgConfig.padding.left}, ${
        svgConfig.height - svgConfig.padding.bottom
      })`
    );
};

export const Rect: React.FC = () => {
  useEffect(() => {
    clearSvg("#rect-demo");
    drawRect(defaultConfig);
    drawRect({
      ...defaultConfig,
      svgConfig: { ...defaultConfig.svgConfig, height: 400 },
    });
  });

  const handleDownload = useCallback(() => {
    const svg = select("svg").node();
    downloadSvg(svg as any);
  }, []);

  return (
    <div>
      <button onClick={handleDownload}>下载</button>
      <div id="rect-demo"></div>
    </div>
  );
};
