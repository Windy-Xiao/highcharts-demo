// @ts-nocheck
/* eslint-disable */
import Highcharts, { extend, WrapProceedFunction } from "highcharts";

// rewrite highcharts methods for tooltip show
export const rewriteHide = () =>
  Highcharts.wrap(Highcharts.Tooltip.prototype, "hide", function (proceed) {});

export const rewriteRefresh = () =>
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

// rewrite highcharts methods for tooltip anchor
export const rewriteUpdatePosition = () =>
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

export const rewriteMove = () =>
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
