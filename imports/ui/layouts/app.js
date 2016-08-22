/**
 * Main application page for Sessionwire Studio. Application-wide navigation is rendered here and the App component's
 * children are rendered into a Bootstrap grid courtesy of React Bootstrap.
 */

import React from 'react'
import { Grid } from 'react-bootstrap'
import AppNavigation from '../containers/app-navigation'

export class App extends React.Component {
  constructor(props) {
    // call super to use 'this.'
    super(props)
  }

  render() {
    return(
      <div>
        <AppNavigation />
        <Grid>
          { this.props.children }
        </Grid>
      </div>
    )
  }
}

App.propTypes = {
  children: React.PropTypes.element.isRequired
}
