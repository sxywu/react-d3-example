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
    hovered: null,
  }

  xAxis = d3.axisBottom().tickSizeOuter(0)
  yAxis = d3.axisLeft().tickSizeOuter(0)
    .tickFormat(d => `${d3.format('$')(parseInt(d / 1000000))}M`)

  static getDerivedStateFromProps(nextProps) {
    const {movies, filtered, holidays, colors} = nextProps;
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

    // calculate arcs from the filtered movies
    const arcs = _.chain(filtered)
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
          data: d,
        }
      }).value();

    const texts = _.map(holidays, (d, i) => {
      const [d1, d2] = d;
      const x1 = xScale(d1);
      const x2 = xScale(d2);
      return {
        x: (x1 + x2) / 2, width: x2 - x1, y: 36, height: 14,
        fill: i % 2 === 0 ? 'rgb(253, 174, 97)' : 'rgb(116, 173, 209)',
        text: i % 2 === 0 ? 'S' : 'W',
      };
    });

    return {arcs, texts, holidays, xScale, yScale}
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
      <div style={{display: 'inline-block', position: 'relative'}}>
        <svg width={width} height={height}>
          <g className='holidays'>
            {
              this.state.texts.map(d => {
                return (
                  <g transform={`translate(${d.x}, ${d.y})`}>
                    <rect x={-d.width / 2} y={-d.height / 2}
                      width={d.width} height={d.height} fill={d.fill} />
                    <text dy='.35em' textAnchor='middle' fill='#fff'>
                      {d.text}
                    </text>
                  </g>
                );

              })
            }
          </g>

          <g className='arcs'>
            {
              this.state.arcs.map(d =>
                <path d={d.path} fill={d.fill} stroke='#fff'
                  onMouseEnter={() => this.setState({hovered: d})}
                  onMouseLeave={() => this.setState({hovered: null})} />)
            }
          </g>

          <g ref='xAxis' className='xAxis' transform={`translate(0, ${this.state.yScale(0)})`} />
          <g ref='yAxis' className='yAxis' transform={`translate(${margin.left}, 0)`} />
        </svg>

        <div style={{
          display: this.state.hovered ? 'block' : 'none', position: 'absolute', top: 0, right: 0,
          margin: '10px', padding: '10px', width: '240px', background: 'rgba(255, 255, 255, 0.7)'}}>
          <strong>title</strong> { this.state.hovered && this.state.hovered.data.title }<br />
          <strong>date</strong> { this.state.hovered &&
            d3.timeFormat('%b %d, %Y')(this.state.hovered.data.date) }<br />
          <strong>metascore</strong> { this.state.hovered && this.state.hovered.data.score }<br />
          <strong>box office</strong> { this.state.hovered &&
            d3.format("$,.0f")(this.state.hovered.data.boxOffice) }<br />
        </div>

      </div>
    )
  }
}

export default AreaChart;
