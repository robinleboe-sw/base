import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Button } from 'react-bootstrap';
import { ReactiveVar } from 'meteor/reactive-var'

export class Index extends React.Component {
  renderLogin(hasUser) {
    if(!!hasUser) {
      return
    } else {
      return (
        <LinkContainer to="/login">
          <Button bsStyle="primary" className="m-b" href="/login" role="button">Login</Button>
        </LinkContainer>
      )
    }
  }

  render() {
    return (
      <div className="text-center">
        <h2>Sessionwire Studio - Live Recording on the Web</h2>
        <p>Login for the new collaboration experience.</p>
        <p>
          { this.renderLogin(this.props.hasUser) }
        </p>
        <p style={ {fontSize: '16px', color: '#aaa'} }>Currently at v0.1.0-alpha</p>
      </div>
    )
  }
};
