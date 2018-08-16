import React, { Component } from 'react';
import * as d3 from "d3";

const width = 500;
const height = 120;
const margin = {top: 20, right: 20, bottom: 20, left: 20};

class Histogram extends Component {
  state = {
    bars: [],
  }

  xAxis = d3.axisBottom();

  static getDerivedStateFromProps(nextProps) {
    const {movies, filtered, colors, attr} = nextProps;
    if (!movies.length) return {};

    // x is the attribute
    const xDomain = d3.extent(movies, d => d[attr]);
    const xScale = d3.scaleLinear()
      .domain(xDomain).nice().range([margin.left, width - margin.right]);

    // get the bins
    const histogram = d3.histogram()
      .domain(xScale.domain())
      .thresholds(xScale.ticks(50))
      .value(d => d[attr]);
    let bins = histogram(movies);

    // calculate y from the bins
    const yMax = d3.max(bins, d => d.length);
    const yScale = d3.scaleLinear()
      .domain([0, yMax]).range([height - margin.bottom, margin.top]);

    // calculate rect bar for each bin
    const bars = bins.map(d => {
      const {x0, x1} = d;
      const x = xScale(x0);
      const y = yScale(d.length);
      const median = d3.median(d, d => d.score) || 0;

      return {
        x,
        width: xScale(x1) - x,
        y,
        height: height - margin.bottom - y,
        fill: colors(median),
      }
    });

    return {bars, xScale};
  }

  componentDidMount() {
    this.brush = d3.brushX().extent([
      [margin.left, margin.top],
      [width - margin.right, height - margin.bottom]
    ]).on('end', this.brushEnd);

    // call brush on SVG group element
  }

  componentDidUpdate() {
    this.xAxis.scale(this.state.xScale).tickFormat(this.props.format);
    d3.select(this.refs.xAxis).call(this.xAxis);
  }

  brushEnd = () => {
    // call updateFilters with bounds of brush
    // (make sure to account for no bounds)
  }

  render() {
    return (
      <svg width={width} height={height}>
        <g className='bars'>
          {
            this.state.bars.map((d, i) =>
              <rect key={i} x={d.x} width={d.width}
                y={d.y} height={d.height}
                fill={d.fill} stroke={d.fill} />)
          }
        </g>
        <g ref='xAxis' className='xAxis' transform={`translate(0, ${height - margin.bottom})`} />
        <g ref='brush' className='brush' />
      </svg>
    )
  }
}

export default Histogram;
