/**
 * AppNavigation component renders navigation conditionally based on authentication status and role.
 * The three possible navigation components are Public, Authenticated and Admin. The currentUser
 * prop is used to check authentication status and the Roles package is used to check for an admin credential.
 */

// import from packages
import React from 'react'
import { Navbar, Row } from 'react-bootstrap'
import { Link } from 'react-router'
import { Roles } from 'meteor/alanning:roles'

// import components
import { PublicNavigation } from './public-navigation'
import { AuthenticatedNavigation } from './authenticated-navigation'
import { AdminNavigation } from './admin-navigation'

export class AppNavigation extends React.Component {

  renderNavigation(currentUser) {
    // if there is a user and they belong to the admin role render admin navigation
    if(!!currentUser && Roles.userIsInRole(currentUser,['admin'])) {
      return <AdminNavigation currentUser={currentUser} />
    } else {
      // user is not in admin so render navigation based on login status
      return currentUser ? <AuthenticatedNavigation currentUser={currentUser} /> : <PublicNavigation />
    }
  }

  render() {

    return <Row className="border-bottom white-bg">
      <Navbar staticTop fluid>
      <Navbar.Header>
        <Navbar.Brand>
          <Link to="/"><img src="/app/logo-nav.png" /> <span className="sw-nav-logo">sessionwire.studio</span></Link>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
          {/* conditionally render navigation components */}
          { this.renderNavigation(this.props.currentUser) }
      </Navbar.Collapse>
    </Navbar></Row>
  }
}

AppNavigation.propTypes = {
  currentUser: React.PropTypes.object,
}
