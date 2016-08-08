import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { handleSignup } from '../../modules/signup';

export class Signup extends React.Component {
  componentDidMount() {
    handleSignup({ component: this });
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
          <p>Register to experience the creative power of Live Recording on the Web™.
          </p>
          <form ref="signup" className="login m-t" onSubmit={ this.handleSubmit }>
            <FormGroup>
              <FormControl
                type="text"
                ref="firstName"
                name="firstName"
                placeholder="First Name*"
              />
            </FormGroup>
            <FormGroup>
            <FormControl
              type="text"
              ref="lastName"
              name="lastName"
              placeholder="Last Name*"
            />
            </FormGroup>
            <FormGroup>
              <FormControl
                type="email"
                ref="emailAddress"
                name="emailAddress"
                placeholder="Email Address*"
              />
            </FormGroup>
            <FormGroup>
              <FormControl
                type="password"
                ref="password"
                name="password"
                placeholder="Password*"
                autoComplete="new-password"
              />
            </FormGroup>
            <Button type="submit" bsStyle="btn btn-primary block full-width m-b">Sign Up</Button>
            <p className="text-muted text-center"><small>Already have an account?</small></p>
            <p>
              <LinkContainer to="/login">
                <Button bsStyle="btn btn-white block full-width m-b" href="/login" role="button">Login</Button>
              </LinkContainer>
            </p>
          </form>
          <p className="m-t"> <small>Sessionwire Studio - Live Recording on the Web © 2016</small> </p>
        </div>
      </div>
    )
  }

}
