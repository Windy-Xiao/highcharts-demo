// @ts-nocheck
/* eslint-disable */
import { Options } from "highcharts";
import { handleClick } from "./Charts";

export const options: Options = {
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
