import React, { Component } from 'react';
import $ from 'jquery';
import axios from 'axios';
import update from 'immutability-helper';

import ErrorModal from '../ErrorModal/ErrorModal';
import TextView from '../../utils/FormValidation/TextView.js';
import { run, ruleRunner } from '../../utils/FormValidation/ruleRunner.js'
import { required, mustMatch, minLength } from '../../utils/FormValidation/rules.js';

const fieldValidations = [
  ruleRunner("username", "First Name", required),
  ruleRunner("email", "Email Address", required),
  ruleRunner("password", "Password", required, minLength(8)),
  ruleRunner("password2", "Password Confirmation", mustMatch("password", "Password"))
];

class CreateAccountForm extends Component {

  constructor(props) {
    super(props);
    this.handleFieldChanged = this.handleFieldChanged.bind(this);
    this.handleSubmitClicked = this.handleSubmitClicked.bind(this);
    this.onCreateAccount = this.onCreateAccount.bind(this);
    this.onModalClick = this.onModalClick.bind(this);
    this.errorFor = this.errorFor.bind(this);
    this.state = {
      showErrors: false,
      validationErrors: {},
      serverErrors: []
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
    .then((res) => {
      if(res.data.success) {
        console.log(res.data);
      } else {
        this.setState({...this.state, serverErrors: res.data.e})
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

  onModalClick() {
    console.log('modal was clicked on')
    this.setState({...this.state, serverErrors: []})
  }

  handleSubmitClicked() {
    this.setState({showErrors: true});
    if($.isEmptyObject(this.state.validationErrors) === false) return null;
    return this.onCreateAccount(this.state);
  }

  render() {
    return (
      <div className="CreateAccount">
        <h2>Create a New Account</h2>

        <TextView placeholder="username" showError={this.state.showErrors}
                text={this.props.username} onFieldChanged={this.handleFieldChanged("username")}
                errorText={this.errorFor("username")} /> 

        <TextView placeholder="email" showError={this.state.showErrors}
                text={this.props.email} onFieldChanged={this.handleFieldChanged("email")}
                errorText={this.errorFor("email")} /> 

        <TextView placeholder="Password" showError={this.state.showErrors} type="password"
                  text={this.props.password1} onFieldChanged={this.handleFieldChanged("password")}
                  errorText={this.errorFor("password")} />

        <TextView placeholder="Confirm Password" showError={this.state.showErrors} type="password"
                  text={this.props.password2} onFieldChanged={this.handleFieldChanged("password2")}
                  errorText={this.errorFor("password2")} />
        <input id="CreateAccountButton" type='submit' value="Create Account" onClick={this.handleSubmitClicked} ></input>

        {(this.state.serverErrors.length != 0) && (
          <ErrorModal
            onClick={this.onModalClick}
            errorMessage={this.state.serverErrors}
          />
        )}
      </div>
    );
  }
}

export default CreateAccountForm;