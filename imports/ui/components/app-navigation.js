import React from 'react';
import { Navbar, Row } from 'react-bootstrap';
import { Link } from 'react-router';
import { PublicNavigation } from './public-navigation';
import { AuthenticatedNavigation } from './authenticated-navigation';
import { AdminNavigation } from './admin-navigation';
import { Roles } from 'meteor/alanning:roles';


export class AppNavigation extends React.Component {
  renderNavigation(hasUser) {
    console.log(hasUser)
    if(!!hasUser && Roles.userIsInRole(hasUser,['admin'])) {
      return <AdminNavigation />
    } else {
      return hasUser ? <AuthenticatedNavigation /> : <PublicNavigation />;
    }
  }

  render() {

    return <Row className="border-bottom white-bg">
      <Navbar staticTop fluid>
      <Navbar.Header>
        <Navbar.Brand>
          <Link to="/"><img src="/app/logo-nav.png" /> sessionwire.studio</Link>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
          { this.renderNavigation(this.props.hasUser) }
      </Navbar.Collapse>
    </Navbar></Row>;
  }
}

AppNavigation.propTypes = {
  hasUser: React.PropTypes.object,
};
