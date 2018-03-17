import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import CreateAccountForm from './components/CreateAccountForm/CreateAccountForm.js'

class App extends Component {
  render() {
    return (
      <div className="App">
        <CreateAccountForm />
      </div>
    );
  }
}

export default App;
