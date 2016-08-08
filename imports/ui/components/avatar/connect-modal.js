import React from 'react';
import { Modal, Button, FormControl } from 'react-bootstrap';
import { ConnectedMembers } from '/imports/ui/components/avatar/connected-members'

export class ConnectModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "Offline",
      connected: false
    }
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
  }

  connect(e) {
    this.setState({connected: true}, this.initCall(e));
  }

  disconnect(e) {
    this.setState({connected: false}, this.endCall(e));
  }

  initCall(e) {
    console.log(this.state.connected);
    $("#divLocalVU").vumetr('power', true);
    $("#divRemoteVU").vumetr('power', true);

    $("#localVideo").hide();
    $("#divLocalVU").show();
    $("#remoteVideo").hide();
    $("#divRemoteVU").show();
  }

  endCall(e) {
    console.log(this.state.connected);
    $("#divLocalVU").vumetr('power', false);
    $("#divRemoteVU").vumetr('power', false);

  }

  renderConnectionButtons(connected) {
    return connected ? <Button onClick={this.disconnect} id="disconnectButton" disabled={!this.state.connected}>Disconnect</Button> : <Button onClick={this.connect} id="connectButton" disabled={this.state.connected}>Connect</Button>;
  }

  render() {
    return (
      <Modal {...this.props} bsSize="large" aria-labelledby="contained-modal-title-lg">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">Sessionwire Studio Help</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Connect with AVATAR Talkback</h4>
          <p>Sessionwire Avatar provides audio-video communication between Sessionwire users.</p>

          {this.renderConnectionButtons(this.state.connected)}

          <p>Status: { this.state.status }</p>

          { this.state.connected ? <ConnectedMembers /> : null }

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
};
