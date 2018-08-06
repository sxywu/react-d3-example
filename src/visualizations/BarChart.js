import React, { Component } from "react";
import * as d3 from "d3";

const width = 650;
const height = 400;
const margin = { top: 20, right: 5, bottom: 20, left: 35 };

class BarChart extends Component {
  state = {
    bars: [] // array of rects
  };

  xAxis = d3.axisBottom().tickFormat(d3.timeFormat("%b"));
  yAxis = d3.axisLeft().tickFormat(d => `${d}℉`);

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data, range } = nextProps;
    if (!data) return {};
    // 1. map date to x-position
    // get min and max of date
    const extent = d3.extent(data, d => d.date);
    const xScale = d3
      .scaleTime()
      .domain(extent)
      .range([margin.left, width - margin.right]);

    // 2. map high temp to y-position
    // get min/max of high temp
    const [min, max] = d3.extent(data, d => d.high);
    const yScale = d3
      .scaleLinear()
      .domain([Math.min(min, 0), max])
      .range([height - margin.bottom, margin.top]);

    // 3. map avg temp to color
    // get min/max of avg
    const colorExtent = d3.extent(data, d => d.avg).reverse();
    const colorScale = d3
      .scaleSequential()
      .domain(colorExtent)
      .interpolator(d3.interpolateRdYlBu);

    // array of objects: x, y, height
    const bars = data.map(d => {
      // slice should be colored if there's no time range
      // or if the slice is within the time range
      // slice should be colored if there's no time range
      // or if the slice is within the time range
      const isColored =
        !range.length || (range[0] <= d.date && d.date <= range[1]);
      return {
        x: xScale(d.date),
        y: yScale(d.high),
        height: yScale(d.low) - yScale(d.high),
        fill: isColored ? colorScale(d.avg) : "#ccc"
      };
    });

    return { bars, xScale, yScale };
  }

  componentDidMount() {
    this.brush = d3
      .brushX()
      .extent([
        [margin.left, margin.top],
        [width - margin.right, height - margin.bottom]
      ])
      .on("end", this.brushEnd);
    d3.select(this.refs.brush).call(this.brush);
  }

  componentDidUpdate() {
    this.xAxis.scale(this.state.xScale);
    d3.select(this.refs.xAxis).call(this.xAxis);
    this.yAxis.scale(this.state.yScale);
    d3.select(this.refs.yAxis).call(this.yAxis);
  }

  brushEnd = () => {
    if (!d3.event.selection) {
      this.props.updateRange([]);
      return;
    }
    const [x1, x2] = d3.event.selection;
    const range = [this.state.xScale.invert(x1), this.state.xScale.invert(x2)];

    this.props.updateRange(range);
  };

  render() {
    return (
      <svg width={width} height={height}>
        {this.state.bars.map((d, i) => (
          <rect
            key={i}
            x={d.x}
            y={d.y}
            width="2"
            height={d.height}
            fill={d.fill}
          />
        ))}
        <g>
          <g
            ref="xAxis"
            transform={`translate(0, ${height - margin.bottom})`}
          />
          <g ref="yAxis" transform={`translate(${margin.left}, 0)`} />
          <g ref="brush" />
        </g>
      </svg>
    );
  }
}

export default BarChart;
