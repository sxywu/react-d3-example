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
    texts: [],
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

    // calculate x, y, and color scale

    // create area generator

    // calculate arcs
    // (area generator assumes [x, y1])

    return {}
  }

  componentDidUpdate() {
    // set scales on axes, and call them on SVG group elements
  }

  render() {
    return (
      <svg width={width} height={height}>
        <g className='arcs'>

        </g>

        <g ref='xAxis' className='xAxis' transform={`translate(0, ${this.state.yScale(0)})`} />
        <g ref='yAxis' className='yAxis' transform={`translate(${margin.left}, 0)`} />
      </svg>
    )
  }
}

export default AreaChart;
