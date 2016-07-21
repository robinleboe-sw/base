import React from 'react';
import { Modal, Button, Form, FormGroup, Checkbox, FormControl, ControlLabel } from 'react-bootstrap';


// TODO: wire up JS files and force browser refresh on save settings...

export class SettingsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sendAudioChecked: this.props.sendAudioChecked,
      sendVideoChecked: this.props.sendVideoChecked,
      receiveAudioChecked: this.props.receiveAudioChecked,
      receiveVideoChecked: this.props.receiveVideoChecked,
      freshIceChecked: this.props.freshIceChecked,
      pushToTalkChecked: this.props.pushToTalkChecked
    };
    this.toggleSendAudio = this.toggleSendAudio.bind(this);
    this.toggleSendVideo = this.toggleSendVideo.bind(this);
    this.toggleReceiveAudio = this.toggleReceiveAudio.bind(this);
    this.toggleReceiveVideo = this.toggleReceiveVideo.bind(this);
    this.toggleFreshIce = this.toggleFreshIce.bind(this);
    this.togglePushToTalk = this.togglePushToTalk.bind(this);
  }

  toggleSendAudio(e) {
    this.setState({ sendAudioChecked: e.target.checked }, this.updateSendAudio(e));
  }

  toggleSendVideo(e) {
    this.setState({ sendVideoChecked: e.target.checked }, this.updateSendVideo(e));
  }

  toggleReceiveAudio(e) {
    this.setState({ receiveAudioChecked: e.target.checked }, this.updateReceiveAudio(e));
  }

  toggleReceiveVideo(e) {
    this.setState({ receiveVideoChecked: e.target.checked }, this.updateReceiveVideo(e));
  }

  toggleFreshIce(e) {
    this.setState({ freshIceChecked: e.target.checked }, this.updateFreshIce(e));
  }

  togglePushToTalk(e) {
    this.setState({ pushToTalkChecked: e.target.checked }, this.updatePushToTalk(e));
  }

  updateSendAudio(e) {
    console.log("SendAudio checked: "+e.target.checked)
  }

  updateSendVideo(e) {
    console.log("SendVideo checked: "+e.target.checked)
  }

  updateReceiveAudio(e) {
    console.log("ReceiveAudio checked: "+e.target.checked)
  }

  updateReceiveVideo(e) {
    console.log("ReceiveVideo checked: "+e.target.checked)
  }

  updateFreshIce(e) {
    console.log("Fresh Ice checked: "+e.target.checked)
    // easyrtc.setUseFreshIceEachPeerConnection(this.value);
  }

  updatePushToTalk(e) {
    console.log("Push to Talk checked: "+e.target.checked)
  }

  render() {
    return (
      <Modal {...this.props} bsSize="large" aria-labelledby="contained-modal-title-lg">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">Sessionwire Studio Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>AVATAR Talkback Transmission Options</h4>
          <Form>
            <FormGroup>
              <Checkbox inline checked={this.state.sendAudioChecked} onClick={this.toggleSendAudio} >
                Send audio
              </Checkbox>
              {' '}
              <Checkbox inline checked={this.state.sendVideoChecked} onClick={this.toggleSendVideo} >
                Send video
              </Checkbox>
              {' '}
              <Checkbox inline checked={this.state.receiveAudioChecked} onClick={this.toggleReceiveAudio}>
                Receive audio
              </Checkbox>
              {' '}
              <Checkbox inline checked={this.state.receiveVideoChecked} onClick={this.toggleReceiveVideo}>
                Receive video
              </Checkbox>
              {' '}
              <Checkbox inline checked={this.state.pushToTalkChecked} onClick={this.togglePushToTalk}>
                Push to Talk
              </Checkbox>
            </FormGroup>
            <h4>AVATAR Talkback Audio Options</h4>
            <FormGroup>
              <ControlLabel>Audio Mode</ControlLabel>
              <FormControl componentClass="select" placeholder="select Audio Mode">
                <option value="select">select</option>
                <option value="other">...</option>
              </FormControl>
              <ControlLabel>Talkback Input</ControlLabel>
              <FormControl componentClass="select" placeholder="select Talkback Input">
                <option value="select">select</option>
                <option value="other">...</option>
              </FormControl>
              <ControlLabel>Talkback Output</ControlLabel>
              <FormControl componentClass="select" placeholder="select Talkback Output">
                <option value="select">select</option>
                <option value="other">...</option>
              </FormControl>
            </FormGroup>
            <h4>AVATAR Talkback Video Options</h4>
            <FormGroup>
              <ControlLabel>Video Source</ControlLabel>
              <FormControl componentClass="select" placeholder="select Video Source">
                <option value="select">select</option>
                <option value="other">...</option>
              </FormControl>
            </FormGroup>
            <h4>AVATAR Talkback Advanced Options</h4>
            <FormGroup>
              <Checkbox inline checked={this.state.freshIceChecked} onClick={this.toggleFreshIce} >
                Fresh Ice
              </Checkbox>
            </FormGroup>
          </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
          <Button bsStyle="success">Save Settings</Button>
        </Modal.Footer>
      </Modal>
    );
  }
};

SettingsModal.propTypes = {
  sendAudioChecked: React.PropTypes.bool,
  sendVideoChecked: React.PropTypes.bool,
  receiveAudioChecked: React.PropTypes.bool,
  receiveVideoChecked: React.PropTypes.bool,
  freshIceChecked: React.PropTypes.bool,
  pushToTalkChecked: React.PropTypes.bool
};

SettingsModal.defaultProps = {
  sendAudioChecked: true,
  sendVideoChecked: true,
  receiveAudioChecked: true,
  receiveVideoChecked: true,
  freshIceChecked: false,
  pushToTalkChecked: false
};
