import React, { Component } from 'react';
import * as d3 from "d3";
import _ from "lodash";

const width = 1000;
const height = 300;
const margin = {top: 0, right: 0, bottom: 20, left: 60};

const monthsWidth = 2; // width of the areas
const curve = d3.curveCatmullRom;

class AreaChart extends Component {
  state = {
    arcs: [],
    xScale: () => 0,
    yScale: () => 0,
  }

  xAxis = d3.axisBottom().tickSizeOuter(0)
  yAxis = d3.axisLeft().tickSizeOuter(0)
    .tickFormat(d => `${d3.format('$')(parseInt(d / 1000000))}M`)

  static getDerivedStateFromProps(nextProps) {
    const {movies, filtered, colors} = nextProps;
    if (!movies.length) return {};

    // calculate median box office
    const medianBox = d3.median(movies, d => d.boxOffice);

    // x scale with dates
    const [minDate, maxDate] = d3.extent(movies, d => d.date);
    const xScale = d3.scaleTime()
      .domain([
        d3.timeMonth.offset(minDate, -2),
        d3.timeMonth.offset(maxDate, 2),
      ]).range([margin.left, width - margin.right]);

    // y scale with boxOffice - medianBox
    const yExtent = d3.extent(movies, d => d.boxOffice - medianBox);
    const yScale = d3.scaleLinear()
      .domain(yExtent).range([height - margin.bottom, margin.top]);

    // need area generater
    const areaGen = d3.area()
      .y0(yScale(0))
      .curve(curve);

    // calculate arcs from the movies
    const arcs = _.chain(movies)
      // put biggest arcs in the background
      .sortBy(d => -Math.abs(d.boxOffice - medianBox))
      .map(d => {
        // for each arc, just need d & fill
        return {
          path: areaGen([
            [xScale(d3.timeMonth.offset(d.date, -2)), yScale(0)],
            [xScale(d.date), yScale(d.boxOffice - medianBox)],
            [xScale(d3.timeMonth.offset(d.date, 2)), yScale(0)],
          ]),
          fill: colors(d.score),
        }
      }).value();

    return {arcs, xScale, yScale}
  }

  componentDidUpdate() {
    this.xAxis.scale(this.state.xScale);
    this.yAxis.scale(this.state.yScale);

    d3.select(this.refs.xAxis).call(this.xAxis);
    d3.select(this.refs.yAxis).call(this.yAxis)
      .select('.domain').remove();
  }

  render() {
    return (
      <svg width={width} height={height}>
        <g className='arcs'>
          {
            this.state.arcs.map(d =>
              <path d={d.path} fill={d.fill} stroke='#fff' />)
          }
        </g>
        <g ref='xAxis' className='xAxis' transform={`translate(0, ${this.state.yScale(0)})`} />
        <g ref='yAxis' className='yAxis' transform={`translate(${margin.left}, 0)`} />
      </svg>
    )
  }
}

export default AreaChart;
