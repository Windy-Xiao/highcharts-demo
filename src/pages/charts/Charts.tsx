// @ts-nocheck
/* eslint-disable */
import React, { useEffect } from "react";
import Highcharts, { extend, Options, WrapProceedFunction } from "highcharts";
import HC from "highcharts-rounded-corners";
HC(Highcharts);

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
    labels: {},
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
      // borderRadius: 4,
      color: "#eee",
      data: [1, 2, 3, 4, 5, { y: 6, color: "#38d200" }],
      showInLegend: false,
    },
    {
      type: "column",
      name: "Money out",
      // borderRadius: 4,
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
            this.series.chart.series[0].data.map((item, index) =>
              e.point.index === index
                ? (item.color = "#38d200")
                : (item.color = "#eee")
            );
            this.series.chart.series[0].render();
            this.series.chart.series[1].data.map((item, index) =>
              e.point.index === index
                ? (item.color = "#0f7aed")
                : (item.color = "#dfdfdf")
            );
            this.series.chart.series[1].render();
            this.series.chart.tooltip.refresh(
              [
                this.series.chart.series[0].points[e.point.index],
                this.series.chart.series[1].points[e.point.index],
              ],
              e,
              true
            );
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
  // rewrite highcharts methods for tooltip show
  Highcharts.wrap(Highcharts.Tooltip.prototype, "hide", function (proceed) {});
  Highcharts.wrap(Highcharts.Tooltip.prototype, "refresh", function (
    proceed,
    point,
    event,
    click
  ) {
    if (click) {
      proceed.apply(this, Array.prototype.slice.call(arguments, 1));
    }
  } as WrapProceedFunction);
  Highcharts.wrap(
    Highcharts.Tooltip.prototype,
    "updatePosition",
    function (proceed, point) {
      proceed.apply(this, Array.prototype.slice.call(arguments, 1));

      this.label.attr({
        anchorY: point.plotY + this.chart.plotTop,
        anchorX: point.plotX + this.chart.plotLeft + 8,
      });
    }
  );
  // rewrite highcharts methods for tooltip anchor
  Highcharts.wrap(Highcharts.Tooltip.prototype, "move", function (
    proceed,
    x,
    y,
    anchorX,
    anchorY
  ) {
    var tooltip = this,
      now = tooltip.now,
      animate =
        tooltip.options.animation !== false &&
        !tooltip.isHidden &&
        // When we get close to the target position, abort animation and
        // land on the right place (#3056)
        (Math.abs(x - now.x) > 1 || Math.abs(y - now.y) > 1),
      skipAnchor = false; //tooltip.followPointer || tooltip.len > 1;

    // Get intermediate values for animation
    extend(now, {
      x: animate ? (2 * now.x + x) / 3 : x,
      y: animate ? (now.y + y) / 2 : y,
      anchorX: skipAnchor
        ? undefined
        : animate
        ? (2 * now.anchorX + anchorX) / 3
        : anchorX,
      anchorY: skipAnchor
        ? undefined
        : animate
        ? (now.anchorY + anchorY) / 2
        : anchorY,
    });
    // Move to the intermediate value
    tooltip.getLabel().attr(now);

    // Run on next tick of the mouse tracker
    if (animate) {
      // Never allow two timeouts
      clearTimeout(this.tooltipTimeout);

      // Set the fixed interval ticking for the smooth tooltip
      this.tooltipTimeout = setTimeout(function () {
        // The interval function may still be running during destroy,
        // so check that the chart is really there before calling.
        if (tooltip) {
          tooltip.move(x, y, anchorX, anchorY);
        }
      }, 32);
    }
  } as WrapProceedFunction);

  useEffect(() => {
    const chart = Highcharts.chart(options);
    chart.xAxis[0].labelGroup.element.childNodes.forEach(function (
      label,
      index
    ) {
      label.style.cursor = "pointer";
      label.onclick = () => {
        chart.tooltip.refresh(
          [chart.series[0].points[index], chart.series[1].points[index]],
          label,
          true
        );
      };
    });
  });
  return (
    <div id={"container"} style={{ width: "300px", height: "240px" }}></div>
  );
};
export default Charts;
