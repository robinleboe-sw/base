/**
 * AdminNavigation component renders 'admin-only' navigation for users who have been added to the admin role.
 */

// import from packages
import { Meteor } from 'meteor/meteor'
import React from 'react'
import { browserHistory } from 'react-router'
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap'
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'

// send users to the login screen on logout
const handleLogout = () => Meteor.logout(() => browserHistory.push('/login'))

// concatenate user name for display
const userName = (props) => {
  const user = props.currentUser
  const name = user && user.profile ? user.profile.name : ''
  return user ? `${name.first} ${name.last}` : ''
}

export const AdminNavigation = (props) => (
  <div>
    <Nav>
      <IndexLinkContainer to="/">
        <NavItem eventKey={ 1 } href="/">Admin Index</NavItem>
      </IndexLinkContainer>
      <LinkContainer to="/documents">
        <NavItem eventKey={ 2 } href="/documents">Admin Documents</NavItem>
      </LinkContainer>
    </Nav>
    <Nav pullRight>
      <NavDropdown eventKey={ 3 } title={ userName(props) } id="basic-nav-dropdown">
        <MenuItem eventKey={ 3.1 } onClick={ handleLogout }>Logout</MenuItem>
      </NavDropdown>
    </Nav>
  </div>
)

AdminNavigation.propTypes = {
  currentUser: React.PropTypes.object
}
