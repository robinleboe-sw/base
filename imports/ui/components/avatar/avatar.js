/**
 * Parent component for Avatar Talkback A/V chat
 */

import React from 'react';
import { Bert } from 'meteor/themeteorchef:bert';
import { Col, Row } from 'react-bootstrap';
import { LocalVideo } from '/imports/ui/components/avatar/local-video'
import { RemoteVideo } from '/imports/ui/components/avatar/remote-video'
import { handle_iMS_Error, handle_gUM_Error, handle_eD_Error} from '/imports/modules/avatar-errors'
// import { SettingsDisplay } from '/imports/ui/components/avatar/settings-display' /* testing only */

import '/imports/modules/js/sw_easyrtc_1.0.17.js'
import '/imports/modules/js/sw_easyrtc_rates.js'
import '/imports/modules/js/easyrtc_ft.js'

function gotStream(stream) {
  console.log('Entering gotStream function...');
}

function loginSuccess(easyrtcid) {

  console.log('logged in', easyrtcid, easyrtc.idToName(easyrtcid), easyrtc.cleanId(easyrtcid));  ////   easyrtc.showError("noerror", "logged in");

  //AVATAR: create the avatar stream with the current device selections
  // avatar.createStream();

  // MESH: create the mesh stream: audio constraints are hard-coded
  // if(mesh){ mesh.createStream(); }

  // TODO: Set LocalVideo connected property to true

  //DEBUG:
  var myrooms = easyrtc.getRoomsJoined();
  sw_utils.TRACE.orange('I am in rooms: ' + JSON.stringify(myrooms) );

  //FILE
  // sw_filesharing_init(remoteEasyrtcid); // TODO: This doesn't make sense here: There is no remoteEasyrtcid until we have a call in place

}

function loginFailure(errorCode, message) {
  easyrtc.showError(errorCode, message);

  // TODO: Set LocalVideo connected property to true

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

  clearConnectList(otherClientDiv) {
    while (otherClientDiv.hasChildNodes()) {
      otherClientDiv.removeChild(otherClientDiv.lastChild);
    }
  }

  convertListToButtons (roomName, occupants, isPrimary) {
    // get ref to #otherClients div
    const otherClientDiv = this.otherClients;
    // clear div in preparation for population
    this.clearConnectList(otherClientDiv);
    // populate div with occupants
    for(var easyrtcid in occupants) {
      var button = document.createElement('button');
      button.id = 'callerBtn_' + easyrtcid;
      button.onclick = function(easyrtcid) {
        return function() {
          performCall(easyrtcid);
        };
      }(easyrtcid);  //  ?? TODO

      var label = document.createTextNode("Call " + easyrtc.idToName(easyrtcid));
      button.appendChild(label);
      otherClientDiv.appendChild(button);
    }
  }

  componentDidMount() {
    const { userObj } = this.props;
    const fullName = userObj && userObj.profile ? userObj.profile.name.first+"-"+userObj.profile.name.last : 'unkown';
    easyrtc.setUsername(fullName);
    easyrtc.enableAudio(userObj && userObj.settings.sendAudioChecked);
    easyrtc.enableVideo(userObj && userObj.settings.sendVideoChecked);
    easyrtc.enableDataChannels(true);
    easyrtc.setRoomOccupantListener(this.convertListToButtons);
    //easyrtc.connect("sessionwire.avatar", loginSuccess, loginFailure);

    this.init();
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
            {/*<SettingsDisplay settings={userSettings}/>*/}
          </Col>
        </Row>
        <Row>
          <div
            id="otherClients"
            ref={(otherClients) => this.otherClients = otherClients}>
          </div>
        </Row>
      </div>
    )
  }
}
