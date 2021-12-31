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
import { handleClick } from "./utils";
HC(Highcharts);

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
