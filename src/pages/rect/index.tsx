import React, { useEffect } from "react";
import { scaleLinear, scaleBand, max, range, axisLeft, axisBottom } from "d3";
import { drawSvg, clearSvg } from "../../utils";
import {
  getTotal,
  getRectMaxHeight,
  getRectMaxWidth,
  DrawPanel,
} from "./helper";
import "./index.css";

const scores = [
  { math: 70, chn: 75, eng: 80 },
  { math: 120, chn: 135, eng: 130 },
  { math: 90, chn: 62, eng: 87 },
  { math: 130, chn: 95, eng: 80 },
  { math: 46, chn: 42, eng: 72 },
];

export type ScoreItem = typeof scores[number];
const scorePannel = new DrawPanel<ScoreItem>({ width: 100, height: 100 });

const WIDTH = 300;
const HEIGHT = 200;

const padding = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 30,
};

const x = Math.floor((WIDTH - padding.left - padding.right) / scores.length);

const defaultConfig = {
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
};
const axisXList = ["一", "二", "三", "四", "五"];

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
      // console.log(e, data);
      scorePannel.draw(data, { x: e.clientX + 2, y: e.clientY + 2 });
    })
    .on("mouseleave", () => scorePannel.off())
    // 设置rect 的x,y坐标起点
    .attr(
      "x",
      (_, idx) =>
        idx * rectConfig.x +
        (rectConfig.x - rectConfig.width) / 2 +
        svgConfig.padding.left
    )
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
        svgConfig.padding.left
    )
    .attr("y", (data) => {
      return scaleY(getTotal(data)) + svgConfig.padding.top;
    })
    .attr("width", rectConfig.width)
    .attr("height", (data) => {
      return getRectMaxHeight(svgConfig) - scaleY(getTotal(data));
    })
    .attr("class", "rect-text")
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

  return <div id="rect-demo"></div>;
};
