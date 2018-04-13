import React, { Component } from 'react';
import * as d3 from 'd3';
import chroma from 'chroma-js';

const width = 650;
const height = 650;
const margin = {top: 20, right: 5, bottom: 20, left: 35};
const red = '#eb6a5b';
const green = '#b6e86f';
const blue = '#52b6ca';
const colors = chroma.scale([blue, green, red]);

class Chart extends Component {
  state = {
    highs: null,
    lows: null,
  };

  xScale = d3.scaleTime().range([margin.left, width - margin.right]);
  yScale = d3.scaleLinear().range([0, width / 2]);

  xAxis = d3.axisBottom().scale(this.xScale)
    .tickFormat(d3.timeFormat('%b'));
  yAxis = d3.axisLeft().scale(this.yScale)
    .tickFormat(d => `${d}℉`);

  render() {
    return (
      <svg width={width} height={height}>
      </svg>
    );
  }
}

export default Chart;
