import React, { Component } from 'react';
import TextView from '../../utils/FormValidation/TextView.js';
import update from 'immutability-helper';
import { run, ruleRunner } from '../../utils/FormValidation/ruleRunner.js'
import { required, mustMatch, minLength } from '../../utils/FormValidation/rules.js';
import $ from 'jquery';
import axios from 'axios';

const fieldValidations = [
  ruleRunner("username", "First Name", required),
  ruleRunner("login", "Email Address", required),
  ruleRunner("password1", "Password", required, minLength(8)),
  ruleRunner("password2", "Password Confirmation", mustMatch("password1", "Password"))
];

class CreateAccountForm extends Component {

  constructor(props) {
    super(props);
    this.handleFieldChanged = this.handleFieldChanged.bind(this);
    this.handleSubmitClicked = this.handleSubmitClicked.bind(this);
    this.errorFor = this.errorFor.bind(this);
    this.state = {
      showErrors: false,
      validationErrors: { },
    }
  }

  componentWillMount() {
    // Run validations on initial state
    this.setState({validationErrors: run(this.state, fieldValidations)});
  }

  errorFor(field) {
    return this.state.validationErrors[field] || "";
  }

  handleFieldChanged(field) {
    return (e) => {
      // update() is provided by React Immutability Helpers
      // https://facebook.github.io/react/docs/update.html
      let newState = update(this.state, {
        [field]: {$set: e.target.value}
      });
      newState.validationErrors = run(newState, fieldValidations);
      this.setState(newState);
    };
  }

  onCreateAccount(data) {
    console.log(data)
    axios.post('http://localhost:8888/auth/signup/', data)
    .then(function (res) {
      console.log(res);
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  handleSubmitClicked() {
    this.setState({showErrors: true});
    if($.isEmptyObject(this.state.validationErrors) === false) return null;
    //TODO send data to the server
    return this.onCreateAccount(this.state);
  }

  render() {
    return (
      <div className="CreateAccount">
        <h2>Create a New Account</h2>

        <TextView placeholder="username" showError={this.state.showErrors}
                text={this.props.username} onFieldChanged={this.handleFieldChanged("username")}
                errorText={this.errorFor("username")} /> 

        <TextView placeholder="login" showError={this.state.showErrors}
                text={this.props.login} onFieldChanged={this.handleFieldChanged("login")}
                errorText={this.errorFor("login")} /> 

        <TextView placeholder="Password" showError={this.state.showErrors} type="password"
                  text={this.props.password1} onFieldChanged={this.handleFieldChanged("password1")}
                  errorText={this.errorFor("password1")} />

        <TextView placeholder="Confirm Password" showError={this.state.showErrors} type="password"
                  text={this.props.password2} onFieldChanged={this.handleFieldChanged("password2")}
                  errorText={this.errorFor("password2")} />
        <input id="CreateAccountButton" type='submit' value="Create Account" onClick={this.handleSubmitClicked} ></input>
      </div>
    );
  }
}

export default CreateAccountForm;