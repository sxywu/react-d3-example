import React, { Component } from "react";
import * as d3 from "d3";
import chroma from "chroma-js";

const width = 650;
const height = 400;
const margin = { top: 20, right: 5, bottom: 20, left: 35 };

class Chart extends Component {
  state = {};

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data } = nextProps;
    if (!data) return {};

    return {};
  }

  render() {
    return <svg width={width} height={height} />;
  }
}

export default Chart;
