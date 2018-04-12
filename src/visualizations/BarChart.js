import React, { Component } from 'react';
import * as d3 from 'd3';
import chroma from 'chroma-js';

const width = 650;
const height = 400;
const margin = {top: 20, right: 10, bottom: 20, left: 25};
const red = '#eb6a5b';
const blue = '#52b6ca';

class LineChart extends Component {
  state = {
    highs: [], // array of rects for high temps
    lows: [], // array of rects for low temps
    // d3 helpers
    xScale: d3.scaleTime().range([margin.left, width - margin.right]),
    yScale: d3.scaleLinear().range([height - margin.bottom, margin.top]),
  };

  xAxis = d3.axisBottom().scale(this.state.xScale)
    .tickFormat(d3.timeFormat('%b'));
  yAxis = d3.axisLeft().scale(this.state.yScale);

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.data) return null; // data hasn't been loaded yet so do nothing
    const {data} = nextProps;
    const {xScale, yScale, colorScale} = prevState;

    // data has changed, so recalculate scale domains
    const timeDomain = d3.extent(data, d => d.date);
    const tempMax = d3.max(data, d => d.high);
    xScale.domain(timeDomain);
    yScale.domain([0, tempMax]);

    // calculate x and y for each rectangle
    const highs = data.map(d => {
      const y = yScale(d.high);
      return {
        x: xScale(d.date),
        y, height: height - margin.bottom - y,
      }
    });
    const lows = data.map(d => {
      const y = yScale(d.low);
      return {
        x: xScale(d.date),
        y, height: height - margin.bottom - y,
      }
    });

    return {lows, highs};
  }

  componentDidUpdate() {
    d3.select(this.refs.xAxis).call(this.xAxis);
    d3.select(this.refs.yAxis).call(this.yAxis);
  }

  render() {

    return (
      <svg width={width} height={height}>
        {this.state.highs.map(d =>
          (<rect x={d.x} y={d.y} width='2' height={d.height} fill={red} />))}
        {this.state.lows.map(d =>
          (<rect x={d.x} y={d.y} width='2' height={d.height} fill={blue} />))}
        <g>
          <g ref='xAxis' transform={`translate(0, ${height - margin.bottom})`} />
          <g ref='yAxis' transform={`translate(${margin.left}, 0)`} />
        </g>
      </svg>
    );
  }
}

export default LineChart;
