import React from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { handleRecoverPassword } from '../../modules/recover-password';

export class RecoverPassword extends React.Component {
  componentDidMount() {
    handleRecoverPassword({ component: this });
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
          <form ref="recoverPassword" className="recover-password" onSubmit={ this.handleSubmit }>
            <FormGroup>
              <FormControl
                type="email"
                ref="emailAddress"
                name="emailAddress"
                placeholder="Email Address"
              />
            </FormGroup>
            <Button type="submit" bsStyle="primary" className="block full-width m-b">Recover Password</Button>
          </form>
          <p className="m-t"> <small>Sessionwire Studio - Live Recording on the Web © 2016</small> </p>
        </div>
      </div>
    )
  }
}
