import React, { Component } from "react";
import axios from "axios";

const ErrorsList = ({ errors = [] }) => (
  <div>{errors.map(msg => <div style={{ color: "red" }}>{msg}</div>)}</div>
);

class CreateAccountForm extends Component {
  state = {
    values: {
      username: "",
      password: "",
      email: ""
    },
    errors: {
      login: null,
      password: null,
      email: null
    }
  };

  validators = {
    login: [
      {
        type: "allowNull",
        args: false
      },
      {
        type: "minLength",
        args: 8
      }
    ],
    password: [
      {
        type: "allowNull",
        args: false
      }
    ],
    email: [
      {
        type: "allowNull",
        args: false
      },
      {
        type: "isEmail"
      }
    ]
  };

  onFieldChange = e => {
    let { name, value } = e.target;
    this.setState({
      values: {
        ...this.state.values,
        [name]: value
      }
    });
  };

  validateFieldValues = () => {
    let isValid = true;
    let errors = {};

    Object.keys(this.state.values).forEach(field => {
      errors[field] = [];
      const value = this.state.values[field];

      const validators = this.validators[field] || [];

      validators.forEach(({ type, args }) => {
        if (type === "allowNull") {
          if (value.trim() === "") {
            errors[field].push("Required");
            isValid = false;
          }
        }

        if (type === "minLength" && args !== undefined) {
          if (value.length < args) {
            errors[field].push(`Should be at least ${args} long`);
            isValid = false;
          }
        }

        if (type === "isEmail") {
          var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (!re.test(value.toLowerCase())) {
            errors[field].push(`Invalid Email`);
            isValid = false;
          }
        }
      });
    });

    if (isValid) {
      this.setState({ errors: {} });
      return isValid;
    } else {
      this.setState({ errors });
      return isValid;
    }
  };

  onSubmit = e => {
    e.preventDefault();
    let values = { ...this.state.values };
    let formIsValid = this.validateFieldValues();
    console.log(formIsValid);

    if (formIsValid) {
      axios
        .post("http://localhost:8888/auth/signup/", values)
        .then(res => {
          if (res.data.success) {
            console.log(res.data);
          } else {
            let dbErrors = {};
            res.data.e.map(err => {
              dbErrors[err.path] = [err.message];
              console.log(dbErrors[err.path]);
            });
            this.setState({ errors: dbErrors });
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      console.log("Invalid form data");
      console.log(this.state.errors);
    }
  };

  render() {
    const { values, errors } = this.state;
    const { username, password, email } = values;

    return (
      <form onSubmit={this.onSubmit}>
        <h2>Create a New Account</h2>
        <div>
          Username:
          <input
            name="username"
            value={username}
            onChange={this.onFieldChange}
          />
          <br />
          {errors.username && <ErrorsList errors={errors.username} />}
        </div>
        <div>
          Password:
          <input
            name="password"
            value={password}
            onChange={this.onFieldChange}
          />
          <br />
          {errors.password && <ErrorsList errors={errors.password} />}
        </div>
        <div>
          E-mail:
          <input name="email" value={email} onChange={this.onFieldChange} />
          <br />
          {errors.email && <ErrorsList errors={errors.email} />}
        </div>
        <button type="submit">Sign Up</button>
      </form>
    );
  }
}

export default CreateAccountForm;
