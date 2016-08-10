import React from 'react';
import { render } from 'react-dom';
import { Button, ButtonToolbar, ControlLabel, Glyphicon, Alert, Col, Row } from 'react-bootstrap';
import { HelpModal } from '/imports/ui/components/avatar/help-modal'
import SettingsList from '/imports/ui/containers/settings-data'
import { ConnectModal } from '/imports/ui/components/avatar/connect-modal'
import { LocalVideo } from '/imports/ui/components/avatar/local-video'
import { RemoteVideo } from '/imports/ui/components/avatar/remote-video'
import Avatar from '/imports/ui/containers/avatar'

import { Meteor } from 'meteor/meteor'


import '/imports/modules/js/jquery-ui.min.js'
import '/imports/modules/js/socket.io.min.js'
import '/imports/modules/js/sw_easyrtc_1.0.17.js'
import '/imports/modules/js/sw_easyrtc_rates.js'
import '/imports/modules/js/easyrtc_ft.js'
import '/imports/modules/js/vumetr.js'
import '/imports/modules/js/sw_utils.js'
import '/imports/modules/js/sw_filesharing.js'
import '/imports/modules/js/sw_audio_video.js'
// import '/imports/modules/js/sw_avatarstream.js'
import '/imports/modules/js/sw_talkback.js'
import '/imports/modules/js/sw_datachannel.js'
import '/imports/modules/js/sw_midi.js'
// import '/imports/modules/js/sw_avatarInit.js'

import { swLoadSettings } from '/imports/modules/js/sw_settings'
import '/imports/modules/js/sw_audio_video'
import { initMeters } from '/imports/modules/js/sw_meters'

const subscription = Meteor.subscribe('mesh');

export class Lounge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      helpShow: false,
      settingsShow: false,
      connectShow: false,
      alertVisible: true
    };
    this.helpShow = this.helpShow.bind(this);
    this.helpClose = this.helpClose.bind(this);
    this.settingsShow = this.settingsShow.bind(this);
    this.settingsClose = this.settingsClose.bind(this);
    this.connectShow = this.connectShow.bind(this);
    this.connectClose = this.connectClose.bind(this);
    this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
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

  handleAlertDismiss() {
    this.setState({ alertVisible: false });
  }

  componentDidMount() {
    // console.log('Mounted!');
    swLoadSettings();
    // audioVideoInit();
    initMeters();
    // const name = user && user.profile ? user.profile.name : '';
    // return user ? `${name.first} ${name.last}` : '';
    //easyrtc.setUsername(user);
    //avatar.init();
  }

  render() {
    return (
      <div>
        <Col xs={6}>
          <h1>AVATAR Talkback</h1>
        </Col>
        <Col xs={6}>
          <h1>
          <ButtonToolbar className="pull-right">
            <Button bsStyle="success" onClick={this.connectShow}>
              <Glyphicon glyph="earphone" />
            </Button>
            <Button bsStyle="primary" onClick={this.settingsShow}>
              <Glyphicon glyph="cog" />
            </Button>
            <Button bsStyle="info" onClick={this.helpShow}>
              <Glyphicon glyph="question-sign" />
            </Button>
            <HelpModal show={this.state.helpShow} onHide={this.helpClose} />
            <SettingsList show={this.state.settingsShow} onHide={this.settingsClose} />
            <ConnectModal show={this.state.connectShow} onHide={this.connectClose} />
          </ButtonToolbar>
            </h1>
        </Col>
        <Col xs={12}>
          {this.state.alertVisible ?
            <Alert bsStyle="info" onDismiss={this.handleAlertDismiss}>
              <row>
                <h3>AVATAR Talkback Overview</h3>
                <p>AVATAR Talkback let's you communicate using video, voice and streaming music channels. It's easy to get connected:</p>
                <ul>
                  <li>Click the connect  <Glyphicon glyph="earphone" />  button to initiate an AVATAR Talkback video chat session with another Sessionwire member.</li>
                  <li>You can view and change call settings by clicking on the settings  <Glyphicon glyph="cog" />  button.</li>
                  <li>If you need help you can access it by clicking on the help <Glyphicon glyph="question-sign" /> button.</li>
                </ul>
              </row>
              <row>
                <p className="text-right">
                  <Button onClick={this.handleAlertDismiss}>Got it!</Button>
                </p>
              </row>
            </Alert> : null}
          <Avatar/>

        </Col>
        <Col xs={6}>
          <LocalVideo/>
        </Col>
        <Col xs={6}>
          <RemoteVideo/>
        </Col>
      </div>
    )
  }
};
