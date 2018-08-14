import React, { Component } from 'react';
import _ from "lodash";

const startYear = 2013;
const numYears = 5;

class App extends Component {
  state = {
    movies: [],
    filteredMovies: [],
  };

  componentDidMount() {
    fetch(`${process.env.PUBLIC_URL || ''}/movies.json`)
      .then(resp => resp.json())
      .then(movies => {
        movies = _.chain(movies)
          .map(d => Object.assign(d, {date: new Date(d.date)}))
          .filter(d => d.boxOffice && d.year >= startYear)
          .value();
        this.setState({movies});
      });
  }

  render() {
    return (
      <div>

      </div>
    )
  }
}

export default App;
