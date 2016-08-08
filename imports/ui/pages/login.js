/**
 * Login page for Sessionwire Studio
 */

import React from 'react';
import { Link } from 'react-router';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { handleLogin } from '../../modules/login';

export class Login extends React.Component {
  componentDidMount() {
    handleLogin({ component: this });
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
          <p>Login to experience the creative power of Live Recording on the Web™.
          </p>
          <form ref="login" className="login m-t" onSubmit={ this.handleSubmit }>
            <FormGroup>
              <FormControl
                type="email"
                ref="emailAddress"
                name="emailAddress"
                placeholder="Email Address"
              />
            </FormGroup>
            <FormGroup>
              <FormControl
                type="password"
                ref="password"
                name="password"
                placeholder="Password"
                autoComplete="new-password"
              />
            </FormGroup>
            <Button type="submit" bsStyle="primary" className="block full-width m-b">Login</Button>
            <p><Link className="" to="/recover-password"><small>Forgot Password?</small></Link></p>
            <p className="text-muted text-center"><small>Do not have an account?</small></p>
            <Link to="/signup">
              <button className="btn btn-sm btn-white btn-block" href="/signup">Sign Up Now!</button>
            </Link>
          </form>
          <p className="m-t"> <small>Sessionwire Studio - Live Recording on the Web © 2016</small> </p>
        </div>
      </div>
    )
  }
}
