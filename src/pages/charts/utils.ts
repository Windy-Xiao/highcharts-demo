// @ts-nocheck
/* eslint-disable */
import Highcharts, { Series } from "highcharts";

interface Colors {
  active: string;
  inactive: string;
}

const changeColor = (
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
