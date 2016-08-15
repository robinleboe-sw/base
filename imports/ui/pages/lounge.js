/**
 * A/V chat between authenticated Sessionwire Studio users
 */

import React from 'react';
import { Button, ButtonToolbar, Glyphicon, Alert, Col, Row } from 'react-bootstrap';

// import modal windows
import { ConnectModal } from '/imports/ui/components/avatar/connect-modal'
import SettingsModal from '/imports/ui/containers/settings-data' // default export
import { HelpModal } from '/imports/ui/components/avatar/help-modal'

// import HOC data container
import AvatarView from '/imports/ui/containers/avatar'

export class Lounge extends React.Component {
  constructor(props) {
    super(props);
    // set visibility state for modals and alerts
    this.state = {
      helpShow: false,
      settingsShow: false,
      connectShow: false,
      alertVisible: true
    };
    // pre-bind methods to instance
    this.helpShow = this.helpShow.bind(this);
    this.helpClose = this.helpClose.bind(this);
    this.settingsShow = this.settingsShow.bind(this);
    this.settingsClose = this.settingsClose.bind(this);
    this.connectShow = this.connectShow.bind(this);
    this.connectClose = this.connectClose.bind(this);
    this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
  }

  // class methods
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

  handleAlertDismiss() {
    this.setState({ alertVisible: false });
  }

  render() {
    return (
      <div>
        <Row>
            <Col xs={12}>
              {this.state.alertVisible ?
                <Alert bsStyle="info" onDismiss={this.handleAlertDismiss}>
                    <h3>AVATAR Talkback Overview</h3>
                    <p>AVATAR Talkback let's you communicate using video, voice and streaming music channels. It's easy to get connected:</p>
                    <ul>
                      <li>Click the connect  <Glyphicon glyph="earphone" />  button to initiate an AVATAR Talkback video chat session with another Sessionwire member.</li>
                      <li>You can view and change call settings by clicking on the settings  <Glyphicon glyph="cog" />  button.</li>
                      <li>If you need help you can access it by clicking on the help <Glyphicon glyph="question-sign" /> button.</li>
                    </ul>
                    <p className="text-right">
                      <Button onClick={this.handleAlertDismiss}>Got it!</Button>
                    </p>
                </Alert> : null}
            </Col>
        </Row>
        <Row>
        <Col xs={12}>
          <ButtonToolbar className="pull-left">
            <Button bsStyle="danger" onClick={this.connectShow}>
              AVATAR Talkback  &nbsp;<Glyphicon glyph="earphone" />
            </Button>
          </ButtonToolbar>
          <ButtonToolbar className="pull-right">
            <Button bsStyle="primary" onClick={this.settingsShow}>
              <Glyphicon glyph="cog" />
            </Button>
            <Button bsStyle="info" onClick={this.helpShow}>
              <Glyphicon glyph="question-sign" />
            </Button>
          </ButtonToolbar>
        </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <AvatarView/>
          </Col>
        </Row>
        <HelpModal show={this.state.helpShow} onHide={this.helpClose} />
        <SettingsModal show={this.state.settingsShow} onHide={this.settingsClose} />
        <ConnectModal show={this.state.connectShow} onHide={this.connectClose} />
      </div>
    )
  }
};
