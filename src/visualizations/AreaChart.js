import React, { Component } from 'react';
import * as d3 from "d3";
import _ from "lodash";

const width = 1000;
const height = 300;
const margin = {top: 0, right: 20, bottom: 20, left: 20};

const monthsWidth = 2; // width of the areas

class AreaChart extends Component {
  state = {
    arcs: [],
  }

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
      .curve(d3.curveCatmullRom);

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

    return {arcs}
  }

  render() {
    return (
      <svg width={width} height={height}>
        {
          this.state.arcs.map(d =>
            <path d={d.path} fill={d.fill} stroke='#fff' />)
        }
      </svg>
    )
  }
}

export default AreaChart;
