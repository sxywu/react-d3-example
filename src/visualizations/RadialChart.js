import React, { Component } from 'react';
import * as d3 from 'd3';
import chroma from 'chroma-js';

const width = 650;
const height = 650;
const margin = {top: 20, right: 10, bottom: 20, left: 25};
const red = '#eb6a5b';
const green = '#b6e86f';
const blue = '#52b6ca';
const colors = chroma.scale([blue, green, red]);

class RadialChart extends Component {
  state = {
    slices: [], // array of svg path commands, each representing a day
    tempAnnotations: [],
    // d3 helpers
    radiusScale: d3.scaleLinear().range([0, width / 2]),
    colorScale: d3.scaleLinear(),
    arcGenerator: d3.arc(),
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.data) return null; // data hasn't been loaded yet so do nothing
    const {data} = nextProps;
    const {radiusScale, colorScale, arcGenerator} = prevState;

    // data has changed, so recalculate scale domains
    const tempMax = d3.max(data, d => d.high);
    const colorDomain = d3.extent(data, d => d.avg);
    radiusScale.domain([0, tempMax]);
    colorScale.domain(colorDomain);

    // one arc per day, innerRadius is low temp, outerRadius is high temp
    const perSliceAngle = (2 * Math.PI) / data.length;
    const slices = data.map((d, i) => {
      const path = arcGenerator({
        startAngle: i * perSliceAngle,
        endAngle: (i + 1) * perSliceAngle,
        innerRadius: radiusScale(d.low),
        outerRadius: radiusScale(d.high),
      });

      return {path, fill: colors(colorScale(d.avg))};
    });

    const tempAnnotations = [5, 20, 40, 60, 80].map(temp => {
      return {
        r: radiusScale(temp),
        temp,
      }
    });

    return {slices, tempAnnotations};
  }

  render() {

    return (
      <svg width={width} height={height}>
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {this.state.slices.map(d => (<path d={d.path} fill={d.fill} />))}

          {this.state.tempAnnotations.map(d => (
            <g>
              <circle r={d.r} fill='none' stroke='#999' />
              <text y={-d.r - 2} textAnchor='middle'>{d.temp}℉</text>
            </g>
          ))}
        </g>
      </svg>
    );
  }
}

export default RadialChart;
