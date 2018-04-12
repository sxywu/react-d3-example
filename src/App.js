import React, { Component } from 'react';
import {timeParse} from 'd3';
import './App.css';
import LineChart from './visualizations/LineChart';
import BarChart from './visualizations/BarChart';

class App extends Component {
  state = {
    temps: {},
    city: 'am', // city whose temperatures to show
  };

  componentDidMount() {
    Promise.all([
      fetch(`${process.env.PUBLIC_URL}/sf.json`),
      fetch(`${process.env.PUBLIC_URL}/ny.json`),
      fetch(`${process.env.PUBLIC_URL}/am.json`),
    ]).then(responses => Promise.all(responses.map(resp => resp.json())))
    .then(([sf, ny, am]) => {
      sf.forEach(day => day.date = new Date(day.date));
      ny.forEach(day => day.date = new Date(day.date));
      am.forEach(day => day.date = new Date(day.date));

      this.setState({temps: {sf, ny, am}});
    });
  }

  updateCity = (e) => {
    this.setState({city: e.target.value});
  }

  render() {
    const data = this.state.temps[this.state.city];

    return (
      <div className="App">
        <h1>
          2017 temperatures for
          <select name='city' onChange={this.updateCity}>
            {
              [
                {label: 'Amsterdam', value: 'am'},
                {label: 'San Francisco', value: 'sf'},
                {label: 'New York', value: 'ny'},
              ].map(option => {
                return (<option key={option.value} value={option.value}>{option.label}</option>);
              })
            }
          </select>
        </h1>
        <p>
          *warning: these are <em>not</em> meant to be good examples of data visualizations,<br />
          but just to show the possibility of using D3 and React*
        </p>
        <BarChart data={data} />
        <LineChart data={data} />
      </div>
    );
  }
}

export default App;
