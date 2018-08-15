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
    filters: {},
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

        const colorDomain = d3.extent(movies, d => d.score);
        this.state.colors.domain(colorDomain).nice();

        this.setState({movies, filtered: movies});
      });
  }

  updateFilters = (filter) => {
    // update filters, and then filter movies by the new filters
  }

  render() {
    return (
      <div style={{width: 1000, margin: 'auto'}}>

        <Histogram {...this.state} attr='score' updateFilters={this.updateFilters} />
        
        <Histogram {...this.state} attr='boxOffice'
          format={d => `$${parseInt(d/ 1000000)}M`} updateFilters={this.updateFilters} />
      </div>
    )
  }
}

export default App;
