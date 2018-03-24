import React, { Component } from "react";
import { Link } from 'react-router-dom';

class StartScreen extends Component {
  state = {};

  render() {
    return (
      <div className="main-screen">
        <Link to={'/signup'}>
          SIGN UP
        </Link>
      </div>
    )
  }
}

export default StartScreen;
