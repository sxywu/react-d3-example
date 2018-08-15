import React, { Component } from 'react';
import * as d3 from "d3";
import _ from "lodash";

import AreaChart from './visualizations/AreaChart';
import Histogram from './visualizations/Histogram';

const startYear = 2008;
const numYears = 10;

class App extends Component {
  state = {
    movies: [],
    filtered: [],
    colors: d3.scaleSequential(d3.interpolateViridis),
  };

  componentDidMount() {
    fetch(`${process.env.PUBLIC_URL || ''}/movies.json`)
      .then(resp => resp.json())
      .then(movies => {
        movies = _.chain(movies)
          .map(d => Object.assign(d, {date: new Date(d.date)}))
          .filter(d => d.boxOffice && d.year >= startYear)
          .value();
          console.log(movies)

        const colorDomain = d3.extent(movies, d => d.score);
        this.state.colors.domain(colorDomain).nice();

        this.setState({movies});
      });
  }

  render() {
    return (
      <div>

        <div>
          <div style={{position: 'absolute', left: '65px'}}>
            <strong>$ over/under median box office</strong>
          </div>
          <AreaChart {...this.state} />
        </div>

        <div style={{display: 'inline-block'}}>
          <Histogram {...this.state} attr='score' />
          <div style={{textAlign: 'center'}}>
            <strong>metascores</strong>
          </div>
        </div>

        <div style={{display: 'inline-block'}}>
          <Histogram {...this.state} attr='boxOffice'
            format={d => `$${parseInt(d/ 1000000)}M`} />
          <div style={{textAlign: 'center'}}>
            <strong>box office figures</strong>
          </div>
        </div>
        
      </div>
    )
  }
}

export default App;
