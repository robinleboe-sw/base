import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export class HelpModal extends React.Component {
  render() {
    return (
      <Modal {...this.props} bsSize="large" aria-labelledby="contained-modal-title-lg">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">Sessionwire Studio Help</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>AVATAR Talkback</h4>
          <p>Sessionwire Avatar provides audio-video communication between Sessionwire users. Audio and video transmission can be enabled/disabled individually before connection to manage processor and network load.</p>

          <p>To start, click on the Login menu item, then click on "Log In".
            You should see buttons representing other users who are currently online.
            Click one of those buttons to initiate the call. Push the "Talkback" button to talk.</p>

          <p>You can send and receive files once you are connected. To send, drag one or more files onto the Avatar window. When someone sends you files, a status window will pop up showing you the progress, and a file 'Save-as' window will pop up when each file arrives, allowing you to save to the folder of your choice.</p>

          <p>In the Settings window you can enable/disable sending or receiving video and audio streams. When "Fresh Ice" is checked, the client will request a new ice config from the server before building the peer connection.</p>

          <p>When the "PushToTalk" option is checked, you must push the 'Talkback' button under the local video window to speak. You can also push the space bar if the Talkback button has current focus. If the "PushToTalk" option is not checked, the audio channel is open continuously and the 'Talkback' button becomes a 'Mute' button.</p>

          <p>Click on the video windows to switch between meter or video view. The remote meter is powered on when connected to another user, powered off otherwise. </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
};
