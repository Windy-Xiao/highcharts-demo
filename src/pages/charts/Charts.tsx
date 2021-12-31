// @ts-nocheck
/* eslint-disable */
import React, { useEffect } from "react";
import Highcharts, { Series } from "highcharts";
import HC from "highcharts-rounded-corners";
import {
  rewriteHide,
  rewriteMove,
  rewriteRefresh,
  rewriteUpdatePosition,
} from "./highchartsRewrite";
import { options } from "./options";
HC(Highcharts);

interface Colors {
  active: string;
  inactive: string;
}
export const changeColor = (
  currentSeries: Series,
  currentIndex: number,
  colors: Colors
): void => {
  currentSeries.data.map((item, index) =>
    currentIndex === index
      ? (item.color = colors.active)
      : (item.color = colors.inactive)
  );
  currentSeries.render();
};

export const handleClick = (
  chart: Highcharts.Chart,
  currentIndex: number,
  event: Highcharts.PointClickEventObject
): void => {
  const series = chart.series;
  const tooltip = chart.tooltip;

  changeColor(series[0], currentIndex, { active: "#38d200", inactive: "#eee" });
  changeColor(series[1], currentIndex, {
    active: "#0f7aed",
    inactive: "#dfdfdf",
  });

  tooltip.refresh(
    [series[0].points[currentIndex], series[1].points[currentIndex]],
    event,
    true
  );
};

const Charts = () => {
  rewriteHide();
  rewriteRefresh();
  rewriteUpdatePosition();
  rewriteMove();

  useEffect(() => {
    const chart = Highcharts.chart(options);
    chart.xAxis[0].labelGroup.element.childNodes.forEach(function (
      label,
      index
    ) {
      label.style.cursor = "pointer";
      label.onclick = () => handleClick(chart, index, label);
    });
  });
  return (
    <div id={"container"} style={{ width: "300px", height: "240px" }}></div>
  );
};
export default Charts;
