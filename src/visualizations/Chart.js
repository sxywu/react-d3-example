import React, { Component } from 'react';
import * as d3 from 'd3';
import chroma from 'chroma-js';

const width = 650;
const height = 400;
const margin = {top: 20, right: 5, bottom: 20, left: 35};
const red = '#eb6a5b';
const green = '#b6e86f';
const blue = '#52b6ca';
const colors = chroma.scale([blue, green, red]);

class Chart extends Component {
  state = {
    slices: [],
    bars: [],
    xAxis: null,
    yAxis: null,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const {data} = nextProps;
    if (!data) return {};

    const colorScale = d3.scaleLinear();
    // define scales and axes for bar chart
    const xScale = d3.scaleTime().range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear().range([height - margin.bottom, margin.top]);
    const xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.timeFormat('%b'));
    const yAxis = d3.axisLeft().scale(yScale).tickFormat(d => `${d}℉`);
    // scales and arc generator for radial chart
    const radiusScale = d3.scaleLinear().range([0, width / 2]);
    const arcGenerator = d3.arc();

    // START HERE
    // data: each date has high, avg, low
    // for a bar chart, need to set up x, y, height, color
    // for a radial chart, need start/end angle and inner/outer radius
  }

  render() {
    return (
      <svg width={width} height={height}>
        <g>
          <g ref='xAxis' transform={`translate(0, ${height - margin.bottom})`} />
          <g ref='yAxis' transform={`translate(${margin.left}, 0)`} />
        </g>
      </svg>
    );
  }
}

export default Chart;
