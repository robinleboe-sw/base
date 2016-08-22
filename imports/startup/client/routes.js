/**
 * Client routing for Sessionwire Studio app
 *
 * TODO: add admin routes and authorization
 */

//import from packages
import { Meteor } from 'meteor/meteor'
import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

//import containers
import Index from '../../ui/containers/app-index'

//import components
import { App } from '../../ui/layouts/app'
import { Documents } from '../../ui/pages/documents'
import { Login } from '../../ui/pages/login'
import { Lounge } from '../../ui/pages/lounge'
import { NotFound } from '../../ui/pages/not-found'
import { RecoverPassword } from '../../ui/pages/recover-password'
import { ResetPassword } from '../../ui/pages/reset-password'
import { Signup } from '../../ui/pages/signup'


// check for login status and send to login instead of requested route if user is not authenticated
const requireAuth = (nextState, replace) => {
  if (!Meteor.loggingIn() && !Meteor.userId()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname },
    })
  }
}

Meteor.startup(() => {
  render(
    <Router history={ browserHistory }>
      <Route path="/" component={ App }>
        <IndexRoute name="index" component={ Index } />
        <Route name="documents" path="/documents" component={ Documents } onEnter={ requireAuth } />
        <Route name="lounge" path="/lounge" component={ Lounge } onEnter={ requireAuth } />
        <Route name="login" path="/login" component={ Login } />
        <Route name="recover-password" path="/recover-password" component={ RecoverPassword } />
        <Route name="reset-password" path="/reset-password/:token" component={ ResetPassword } />
        <Route name="signup" path="/signup" component={ Signup } />
        <Route path="*" component={ NotFound } />
      </Route>
    </Router>,
    document.getElementById('react-root')
  )
})
