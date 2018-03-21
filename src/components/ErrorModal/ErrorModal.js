import React, { Component } from 'react';

import './style.css';

class ErrorModal extends Component {
  render() {
    return (
      <div className="error-modal" onClick={this.props.onClick}>
        <div>
          {this.props.errorMessage.map((m, i)=>{
            return <p key={i}>{m.path} is invalid, try a different one</p>
          })}
        </div>
      </div>
    )
  }
}

export default ErrorModal;