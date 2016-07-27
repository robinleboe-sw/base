import React from 'react';
import { render } from 'react-dom';
import { Button, ButtonToolbar, ControlLabel } from 'react-bootstrap';
import { HelpModal } from '/imports/ui/components/avatar/help-modal'
import { SettingsModal } from '/imports/ui/components/avatar/settings-modal'
import { ConnectModal } from '/imports/ui/components/avatar/connect-modal'
import { AddIP } from '/imports/api/mesh/addIP'
import { GetIP } from '/imports/api/mesh/getIP'

import { Mesh } from '../../api/mesh/mesh';

const subscription = Meteor.subscribe('mesh');

export class Lounge extends React.Component {
  constructor(props) {
    super(props);
    this.state = { helpShow: false, settingsShow: false, connectShow: false };
    this.helpShow = this.helpShow.bind(this);
    this.helpClose = this.helpClose.bind(this);
    this.settingsShow = this.settingsShow.bind(this);
    this.settingsClose = this.settingsClose.bind(this);
    this.connectShow = this.connectShow.bind(this);
    this.connectClose = this.connectClose.bind(this);
  }

  helpShow() {
    this.setState({ helpShow: true });
  }

  helpClose() {
    this.setState({ helpShow: false });
  }

  settingsShow() {
    this.setState({ settingsShow: true });
  }

  settingsClose() {
    this.setState({ settingsShow: false });
  }

  connectShow() {
    this.setState({ connectShow: true });
  }

  connectClose() {
    this.setState({ connectShow: false });
  }

  render() {
    return (
      <div>
        <h1>Studio Lounge</h1>
        <p>Use AVATAR Talkback to connect with other Sessionwire members.</p>
        <hr/>
        <ControlLabel>AVATAR Talkback</ControlLabel>
        <ButtonToolbar>
          <Button bsStyle="success" onClick={this.connectShow}>
            Connect
          </Button>
          <Button bsStyle="primary" onClick={this.settingsShow}>
            Settings
          </Button>
          <Button bsStyle="info" onClick={this.helpShow}>
            Need Help?
          </Button>
          <HelpModal show={this.state.helpShow} onHide={this.helpClose} />
          <SettingsModal show={this.state.settingsShow} onHide={this.settingsClose} />
          <ConnectModal show={this.state.connectShow} onHide={this.connectClose} />

        </ButtonToolbar>
      </div>
    )
  }
};
