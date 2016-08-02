import React from 'react';
import { Link } from 'react-router';
import { Row, Col, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
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

    <div className="loginColumns animated fadeInDown">
      <div className="row">

        <div className="col-md-6">
          <h2 className="font-bold">Welcome to Sessionwire Studio</h2>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et orci mollis nibh placerat venenatis. Proin sollicitudin ac dui et accumsan. Sed vel justo odio.
          </p>

          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
          </p>

          <p>
            When an unknown printer took a galley of type and scrambled it to make a type specimen book.
          </p>

        </div>
        <div className="col-md-6">
          <div className="ibox-content">
            <form ref="login" className="login" onSubmit={ this.handleSubmit }>
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
                />
                <ControlLabel>
                  <Link className="pull-right" to="/recover-password">Forgot Password?</Link>
                </ControlLabel>
              </FormGroup>
              <Button type="submit" bsStyle="btn btn-primary block full-width m-b">Login</Button>
            </form>
            <p className="m-t">
              <small>Sessionwire Studio - Live recording on the Web © 2016</small>
            </p>
          </div>
        </div>
      </div>
      <hr/>
        <div className="row">
          <div className="col-md-6">
            Copyright Sessionwire Communications Inc.
          </div>
          <div className="col-md-6 text-right">
            <small>© 2013-2016</small>
          </div>
        </div>
    </div>
  )
  }
}
