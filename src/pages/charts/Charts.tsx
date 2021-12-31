// @ts-nocheck
/* eslint-disable */
import React, { useEffect } from "react";
import Highcharts, {
  extend,
  Options,
  Series,
  WrapProceedFunction,
} from "highcharts";
import HC from "highcharts-rounded-corners";
import {
  rewriteHide,
  rewriteMove,
  rewriteRefresh,
  rewriteUpdatePosition,
} from "./highchartsRewrite";
HC(Highcharts);

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

const handleClick = (
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

const options: Options = {
  title: {
    text: "Showing",
    align: "left",
    margin: 50,
    style: {
      color: "#717478",
    },
    x: 15,
  },
  xAxis: {
    title: {
      text: null,
    },
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    type: "category",
  },
  yAxis: {
    title: {
      text: null,
    },
    labels: {
      enabled: false,
    },
  },
  chart: {
    renderTo: "container",
    events: {
      load: function (e) {
        this.tooltip.refresh(
          [this.series[0].points[5], this.series[1].points[5]],
          e,
          true
        );
      },
    },
  },
  series: [
    {
      type: "column",
      name: "Money in",
      color: "#eee",
      data: [1, 2, 3, 4, 5, { y: 6, color: "#38d200" }],
      showInLegend: false,
    },
    {
      type: "column",
      name: "Money out",
      color: "#dfdfdf",
      data: [3, 5, 6, 1, 6, { y: 9, color: "#0f7aed" }],
      showInLegend: false,
    },
  ],
  tooltip: {
    backgroundColor: "#fff",
    borderColor: "#fff",
    borderRadius: 8,
    style: {
      color: "grey",
    },
    headerFormat: undefined,
    pointFormatter: function () {
      return (
        '<span style="color: ' +
        this.color +
        '">\u25CF</span> ' +
        this.series.name +
        ': <b style="color:black"> S$' +
        this.y +
        "</b><br/>"
      );
    },
    shared: true,
    positioner: function (labelWidth, labelHeight, point) {
      const formatX = () => {
        const result = point.plotX - 60 / 2;
        return result < 0 ? 0 : result > 180 ? 180 : result;
      };
      return {
        x: formatX(),
        y: point.plotY,
      };
    },
  },
  legend: {},
  exporting: {},
  plotOptions: {
    series: {
      borderRadiusTopLeft: "50%",
      borderRadiusTopRight: "50%",
      states: {
        hover: {
          enabled: false,
        },
      },
      stickyTracking: false,
      point: {
        events: {
          click: function (e) {
            handleClick(this.series.chart, e.point.index, e);
          },
        },
      },
    },
  },
  credits: {
    enabled: false,
  },
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
