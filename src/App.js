import React, { Component } from 'react';
import {timeParse} from 'd3';
import './App.css';
import LineChart from './visualizations/LineChart';

class App extends Component {
  state = {
    temps: {},
    city: 'sf', // city whose temperatures to show
  };

  componentDidMount() {
    Promise.all([
      fetch(`${process.env.PUBLIC_URL}/sf.json`),
      fetch(`${process.env.PUBLIC_URL}/ny.json`),
    ]).then(responses => Promise.all(responses.map(resp => resp.json())))
    .then(([sf, ny]) => {
      sf.forEach(day => day.date = new Date(day.date));
      ny.forEach(day => day.date = new Date(day.date));

      this.setState({temps: {sf, ny}});
    });
  }

  updateCity = (e) => {
    this.setState({city: e.target.value});
  }

  render() {
    const data = this.state.temps[this.state.city];

    return (
      <div className="App">
        <select name='city' onChange={this.updateCity}>
          {
            [{label: 'San Francisco', value: 'sf'}, {label: 'New York', value: 'ny'}].map(option => {
              return (<option key={option.value} value={option.value}>{option.label}</option>);
            })
          }
        </select>
        <LineChart data={data} />
      </div>
    );
  }
}

export default App;
