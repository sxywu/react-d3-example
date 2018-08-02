import React, { Component } from "react";
import * as d3 from "d3";

const width = 650;
const height = 400;
const margin = { top: 20, right: 5, bottom: 20, left: 35 };

class BarChart extends Component {
  state = {
    bars: [] // array of rects
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.data) return null; // data hasn't been loaded yet so do nothing
    const { data } = nextProps;
    const xScale = d3.scaleTime().range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear().range([height - margin.bottom, margin.top]);
    const colorScale = d3.scaleSequential(d3.interpolateRdYlBu);

    // data has changed, so recalculate scale domains
    const timeDomain = d3.extent(data, d => d.date);
    const tempMax = d3.max(data, d => d.high);
    const colorDomain = d3.extent(data, d => d.avg).reverse();
    xScale.domain(timeDomain);
    yScale.domain([0, tempMax]);
    colorScale.domain(colorDomain);

    // calculate x and y for each rectangle
    const bars = data.map(d => {
      const y1 = yScale(d.high);
      const y2 = yScale(d.low);
      return {
        x: xScale(d.date),
        y: y1,
        height: y2 - y1,
        fill: colorScale(d.avg)
      };
    });

    return { bars };
  }

  componentDidMount() {
    this.ctx = this.refs.canvas.getContext("2d");
    this.drawBars();
  }

  componentDidUpdate() {
    this.drawBars();
  }

  drawBars() {
    this.state.bars.forEach(bar => {
      this.ctx.fillStyle = bar.fill;
      this.ctx.fillRect(bar.x, bar.y, 2, bar.height);
    });
  }

  render() {
    return (
      <canvas
        ref="canvas"
        width={width}
        height={height}
        style={{
          width: `${width}px`,
          height: `${height}px`
        }}
      />
    );
  }
}

export default BarChart;
