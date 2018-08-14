import React, { Component } from 'react';

class App extends Component {
  state = {
  };

  componentDidMount() {
    Promise.all([
      // fetch(`${process.env.PUBLIC_URL}/sf.json`),
      // fetch(`${process.env.PUBLIC_URL}/ny.json`),
      // fetch(`${process.env.PUBLIC_URL}/am.json`),
    ]).then(responses => Promise.all(responses.map(resp => resp.json())))
    .then(([]) => {
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
