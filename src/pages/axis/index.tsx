import React, { useEffect } from "react";
import { axisBottom, scaleLinear } from "d3";
import { drawSvg, clearSvg } from "../../utils";

const selector = "#axis-demo";
const domain1 = [0, 1000];
const domain2 = [234, 778];

const renderAxis = (ticksNum = 10, tickSize = 6) => {
  const svg = drawSvg({ selector, width: 350, height: 80 });

  const scaleX = scaleLinear().domain(domain1).range([0, 300]);

  const axisX = axisBottom(scaleX).ticks(ticksNum).tickSize(tickSize);
  svg.append("g").call(axisX).attr("transform", "translate(30, 40)");
};

const renderAxis2 = () => {
  const svg = drawSvg({ selector, width: 350, height: 80 });

  const scaleX = scaleLinear().domain(domain1).range([0, 300]);

  const axisX = axisBottom(scaleX).ticks(10).tickSizeOuter(15).tickPadding(10);
  svg.append("g").call(axisX).attr("transform", "translate(30, 40)");
};

export const Axis: React.FC = () => {
  useEffect(() => {
    clearSvg(selector);
    // renderAxis(0);
    // renderAxis(1);
    // renderAxis(2);
    // renderAxis(3);
    // renderAxis(4);
    // renderAxis(5);
    // renderAxis(6);
    // renderAxis(7);
    // renderAxis(8);
    // renderAxis(9);
    // renderAxis(10);
    renderAxis(10);

    renderAxis2();
  }, []);

  return (
    <div>
      <div id="axis-demo"></div>
    </div>
  );
};
