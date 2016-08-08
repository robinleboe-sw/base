/**
 * Reset password page for Sessionwire Studio
 */

import React from 'react';
import { Row, Col, Alert, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import { handleResetPassword } from '../../modules/reset-password';

export class ResetPassword extends React.Component {
  componentDidMount() {
    handleResetPassword({
      component: this,
      token: this.props.params.token,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return (
      <div className="middle-box text-center loginscreen animated fadeInDown">
        <div>
          <div>

            <h1 className="logo-name"><img src="/app/sessionwire-login-logo.png" alt="Sessionwire Studio logo"/></h1>

          </div>
          <hr/>
          <p>Enter your email address below to receive a link to reset your password.
          </p>
            <form ref="resetPassword" className="reset-password" onSubmit={ this.handleSubmit }>
              <FormGroup>
                <ControlLabel>New Password</ControlLabel>
                <FormControl
                  type="password"
                  ref="newPassword"
                  name="newPassword"
                  placeholder="New Password"
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Repeat New Password</ControlLabel>
                <FormControl
                  type="password"
                  ref="repeatNewPassword"
                  name="repeatNewPassword"
                  placeholder="Repeat New Password"
                />
              </FormGroup>
              <Button type="submit" bsStyle="primary" className="block full-width m-b">Reset Password &amp; Login</Button>
            </form>
            <p className="m-t"> <small>Sessionwire Studio - Live Recording on the Web © 2016</small> </p>
        </div>
      </div>
    )
  }
}

ResetPassword.propTypes = {
  params: React.PropTypes.object,
};
