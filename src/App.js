import React, { Component } from 'react';
import _ from "lodash";
import inflation from "us-inflation";

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
          .map(d => {
            const year = +d.Year;
            const date = new Date(d.Released);
            const boxOffice = parseInt(d.BoxOffice.replace(/[\$\,]/g, ""));
            return {
              title: d.Title,
              date,
              boxOffice: boxOffice && inflation({ year, amount: boxOffice }),
              score: +d.Metascore,
              year
            };
          }).filter(d => d.boxOffice && d.year >= startYear)
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
