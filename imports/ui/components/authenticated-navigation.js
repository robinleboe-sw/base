/**
 * AuthenticatedNavigation component renders navigation for users who have been authenticated.
 */

// import from packages
import { Meteor } from 'meteor/meteor'
import React from 'react'
import { browserHistory } from 'react-router'
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap'
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'

const handleLogout = () => Meteor.logout(() => browserHistory.push('/login'))

const userName = (props) => {
  const user =props.currentUser
  const name = user && user.profile ? user.profile.name : ''
  return user ? `${name.first} ${name.last}` : ''
}

export const AuthenticatedNavigation = (props) => (
  <div>
    <Nav>
      <IndexLinkContainer to="/">
        <NavItem eventKey={ 1 } href="/">Studio</NavItem>
      </IndexLinkContainer>
      {/*<LinkContainer to="/documents">*/}
        {/*<NavItem eventKey={ 2 } href="/documents">Sessions</NavItem>*/}
      {/*</LinkContainer>*/}
      <LinkContainer to="/lounge">
        <NavItem eventKey={ 3 } href="/lounge">Lounge</NavItem>
      </LinkContainer>
    </Nav>
    <Nav pullRight>
      <NavDropdown eventKey={ 4 } title={ userName(props) } id="basic-nav-dropdown">
        <MenuItem eventKey={ 4.1 } onClick={ handleLogout }>Logout</MenuItem>
      </NavDropdown>
    </Nav>
  </div>
)
