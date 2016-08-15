/**
 * Parent component for Avatar Talkback A/V chat
 */

import React from 'react';
import { Bert } from 'meteor/themeteorchef:bert';
import { Col, Row } from 'react-bootstrap';
import { LocalVideo } from '/imports/ui/components/avatar/local-video'
import { RemoteVideo } from '/imports/ui/components/avatar/remote-video'
import { SettingsDisplay } from '/imports/ui/components/avatar/settings-display'
import { avatarLogin, avatarLogout } from '/imports/ui/components/avatar/avatar-login'

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

import { swLoadSettings } from '/imports/modules/js/sw_settings'
// import '/imports/modules/js/sw_audio_video'
import { initMeters } from '/imports/modules/js/sw_meters'

function handle_iMS_Error() {
  console.log('easyrtc.initMediaSource Error:' + errorCode + ',' + errorText);
}

function handle_gUM_Error(error) {
  console.log('getUserMedia() error: ', error);
}

function handle_eD_Error(error) {
  console.log('enumerateDevices() error: ', error);
}

function gotStream(stream) {
  console.log('Entering gotStream function...');
}

// end functions from avatarsrteam.js

export class Avatar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    // Name for avatar network stream
    this.streamName = 'avatarStream';
    // SDP filters passed during call() or on adding stream to set codecs, bitrates, modes
    this.local_sdp_filter = '';
    this.remote_sdp_filter = '';
  }

  changeAudioDestination() {
    console.log('Entering changeAudioDestination method...');
  }

  createStream() {
    console.log('Entering createStream method...');
  }

  setSDP() {
    console.log('Entering setSDP method...');
  }

  init() {
    console.log('Entering init method...');
  }

  closeStream() {
    console.log('Entering setSDP method...');
  }

  componentDidMount() {
    const { userObj } = this.props;
    const fullName = userObj && userObj.profile ? userObj.profile.name.first+"-"+userObj.profile.name.last : 'unkown';
    // initialize Avatar
    swLoadSettings();
    // audioVideoInit();
    initMeters();
    easyrtc.setUsername(fullName);
    this.init();
    avatarLogin()
  }

  render() {
    // get data passed in from avatar container
    const userSettings = this.props.userObj;
    // copy props and delete 'unknown prop' settings before passing to div
    // const divProps = Object.assign({}, this.props);
    // delete divProps.settings;

    return (
      <div >
        <Row>
          <Col xs={12} sm={6} className="text-center">
            <LocalVideo settings={userSettings}/>
          </Col>
          <Col xs={12} sm={6} className="text-center">
            <RemoteVideo settings={userSettings} />
            <SettingsDisplay settings={userSettings}/>
          </Col>
        </Row>
        <Row>
          <div id="otherClients"> </div>
        </Row>
      </div>
    )
  }
}
