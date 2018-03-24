import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

import StartScreen from "./components/StartScreen/StartScreen.js";
import MainScreen from "./components/MainScreen/MainScreen.js";
import CreateAccountForm from "./components/CreateAccountForm/CreateAccountForm.js";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/" component={StartScreen}/>
          <Route exact path="/main" component={MainScreen}/>
          <Route path="/signup" component={CreateAccountForm}/>
        </div>
      </Router>
    );
  }
}

export default App;
