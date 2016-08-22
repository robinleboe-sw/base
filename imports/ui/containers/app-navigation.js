/**
 * Higher Order Container for AppNavigation component
 * Adds Meteor.user() properties for the current user to AppNavigation component props if available
 * @props currentUser added to AppNavigation
 */

import { Meteor } from 'meteor/meteor'
import { composeWithTracker } from 'react-komposer'
// import AppNavigation component that will receive currentUser data
import { AppNavigation } from '../components/app-navigation'

const composer = (props, onData) => {
  // create Error object to display if something goes wrong
  onData(new Error('AppNavigation error. Please report this error to the Sessionwire support team.'))
  // clear error if everything is ok...
  onData(null, { currentUser: Meteor.user() })
}

// make reactive currentUser props available to AppNavigation component
export default composeWithTracker(composer)(AppNavigation)
