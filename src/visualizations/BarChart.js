import React, { Component } from 'react';
import * as d3 from 'd3';
import chroma from 'chroma-js';

const width = 650;
const height = 400;
const margin = {top: 20, right: 5, bottom: 20, left: 35};
const red = '#eb6a5b';
const green = '#b6e86f';
const blue = '#52b6ca';
const colors = chroma.scale([blue, green, red]).mode('hsl');

class BarChart extends Component {
  state = {
    bars: [], // array of rects
    // d3 helpers
    xScale: d3.scaleTime().range([margin.left, width - margin.right]),
    yScale: d3.scaleLinear().range([height - margin.bottom, margin.top]),
    colorScale: d3.scaleLinear(),
  };

  xAxis = d3.axisBottom().scale(this.state.xScale)
    .tickFormat(d3.timeFormat('%b'));
  yAxis = d3.axisLeft().scale(this.state.yScale)
    .tickFormat(d => `${d}℉`);

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.data) return null; // data hasn't been loaded yet so do nothing
    const {data, range} = nextProps;
    const {xScale, yScale, colorScale} = prevState;

    // data has changed, so recalculate scale domains
    const timeDomain = d3.extent(data, d => d.date);
    const tempMax = d3.max(data, d => d.high);
    const colorDomain = d3.extent(data, d => d.avg);
    xScale.domain(timeDomain);
    yScale.domain([0, tempMax]);
    colorScale.domain(colorDomain);

    // calculate x and y for each rectangle
    const bars = data.map(d => {
      const y1 = yScale(d.high);
      const y2 = yScale(d.low);
      // bar should be colored if there's no time range
      // or if the bar is within the time range
      const isColored = !range.length || (range[0] <= d.date && d.date <= range[1]);
      return {
        x: xScale(d.date),
        y: y1,
        height: y2 - y1,
        fill: isColored ? colors(colorScale(d.avg)) : '#ccc',
      }
    });

    return {bars};
  }

  componentDidMount() {
    this.brush = d3.brushX()
      .extent([[margin.left, margin.top], [width - margin.right,height - margin.bottom]])
      .on('end', this.brushEnd);
    d3.select(this.refs.brush).call(this.brush);
  }

  componentDidUpdate() {
    d3.select(this.refs.xAxis).call(this.xAxis);
    d3.select(this.refs.yAxis).call(this.yAxis);
  }

  brushEnd = () => {
    if (!d3.event.selection) {
      this.props.updateRange([]);
      return;
    }
    const [x1, x2] = d3.event.selection;
    const range = [
      this.state.xScale.invert(x1),
      this.state.xScale.invert(x2)
    ];

    this.props.updateRange(range);
  }

  render() {

    return (
      <svg width={width} height={height}>
        {this.state.bars.map((d, i) =>
          (<rect key={i} x={d.x} y={d.y} width='2' height={d.height} fill={d.fill} />))}
        <g>
          <g ref='xAxis' transform={`translate(0, ${height - margin.bottom})`} />
          <g ref='yAxis' transform={`translate(${margin.left}, 0)`} />
          <g ref='brush' />
        </g>
      </svg>
    );
  }
}

export default BarChart;
