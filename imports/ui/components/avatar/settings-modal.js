/**
 * Modal page for Sessionwire Studio AVATAR Talkback settings
 */

import React from 'react';
import { Modal, Button, Form, FormGroup, Checkbox, FormControl, ControlLabel } from 'react-bootstrap';
import { getInputValue } from '/imports/modules/get-input-value';
import { updateSettings } from '../../../api/users/methods';
import { Bert } from 'meteor/themeteorchef:bert';
import { objToStrMap } from '/imports/modules/object-map-conversion.js'

// TODO: wire up JS files and force browser refresh on save settings...

function handle_eD_Error(error) {
  console.log('enumerateDevices() error: ', error);
}

export class SettingsModal extends React.Component {
  constructor(props) {
    super(props);
    // get settings data passed in as props from settings-data.js
    // using React Komposer
    const settings = props.settings[0];
    // initial state values pulled from Settings MongoDB collection
    // subsequent UI changes are stored in component state below
    // handleUpdateSettings() is called via the 'Apply' or 'Save' option
    // to save the updates in Settings collection
    this.state = {
      sendAudioChecked: settings.sendAudioChecked,
      sendVideoChecked: settings.sendVideoChecked,
      receiveAudioChecked: settings.receiveAudioChecked,
      receiveVideoChecked: settings.receiveVideoChecked,
      freshIceChecked: settings.freshIceChecked,
      pushToTalkChecked: settings.pushToTalkChecked,
      selectedTalkbackSource: settings.selectedTalkbackSource,
      selectedTalkbackDestination: settings.selectedTalkbackDestination,
      selectedVideoSource: settings.selectedVideoSource,
      selectedAudioMode: settings.selectedAudioMode,
      talkbackSourceOptions: [],
      talkbackDestinationOptions: [],
      videoSourceOptions: []
    }
  }

  componentDidMount() {
    navigator.mediaDevices.enumerateDevices().then(this.gotDevices.bind(this)).catch(handle_eD_Error);
  }

  gotDevices(deviceInfos) {
    // convert deviceInfos object to map
    let deviceInfosMap = objToStrMap(deviceInfos);
    // iterate over map and use switch to create options based on kind
    // and push them onto arrays stored in component state object
    for (var [key, device] of deviceInfosMap) {
      let kind = device.kind;
      switch(kind) {
        case "audioinput":
          this.state.talkbackSourceOptions.push(<option key={key} value={device.deviceId}>{device.label}</option>)
          break;
        case "audiooutput":
          this.state.talkbackDestinationOptions.push(<option key={key} value={device.deviceId}>{device.label}</option>)
          break;
        case "videoinput":
          this.state.videoSourceOptions.push(<option key={key} value={device.deviceId}>{device.label}</option>)
          break;
        default:
        console.log("Error creating option from navigator.mediaDevices.enumerateDevices() via gotDevices(deviceInfos)");
      }
    }
  }

  toggleSendAudio(e) {
    const toggledValue = !this.state.sendAudioChecked;
    this.setState({sendAudioChecked: toggledValue});
  }

  toggleSendVideo(e) {
    const toggledValue = !this.state.sendVideoChecked;
    this.setState({sendVideoChecked: toggledValue});
  }

  toggleReceiveAudio(e) {
    const toggledValue = !this.state.receiveAudioChecked;
    this.setState({receiveAudioChecked: toggledValue});
  }

  toggleReceiveVideo(e) {
    const toggledValue = !this.state.receiveVideoChecked;
    this.setState({receiveVideoChecked: toggledValue});
  }

  toggleFreshIce(e) {
    const toggledValue = !this.state.freshIceChecked;
    this.setState({freshIceChecked: toggledValue});
  }

  togglePushToTalk(e) {
    const toggledValue = !this.state.pushToTalkChecked;
    this.setState({pushToTalkChecked: toggledValue});
  }

  selectAudioMode(e) {
    const newValue = getInputValue(e.target);
    this.setState({selectedAudioMode: newValue});
  }

  selectTalkbackSource(e) {
    const newValue = getInputValue(e.target);
    this.setState({selectedTalkbackSource: newValue});
  }

  selectTalkbackDestination(e) {
    const newValue = getInputValue(e.target);
    this.setState({selectedTalkbackDestination: newValue});
  }

  selectVideoSource(e) {
    const newValue = getInputValue(e.target);
    this.setState({selectedVideoSource: newValue})
  }

  // copy state values to update object passed to updateSettings method
  handleUpdateSettings(e) {
    const settingsId = this.props.settings[0]._id;
    console.log(this.state)
    updateSettings.call({
      _id: settingsId,
      userId: Meteor.user()._id,
      update: {
        sendAudioChecked: this.state.sendAudioChecked,
        sendVideoChecked: this.state.sendVideoChecked,
        receiveAudioChecked: this.state.receiveAudioChecked,
        receiveVideoChecked: this.state.receiveVideoChecked,
        freshIceChecked: this.state.freshIceChecked,
        pushToTalkChecked: this.state.pushToTalkChecked,
        selectedTalkbackSource: this.state.selectedTalkbackSource,
        selectedTalkbackDestination: this.state.selectedTalkbackDestination,
        selectedVideoSource: this.state.selectedVideoSource,
        selectedAudioMode: this.state.selectedAudioMode
      },
    }, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Settings applied!', 'success');
      }
    });
  }

  // update and close modal
  handleSave(e) {
    this.handleUpdateSettings();
    this.props.onHide();
  }

  render() {
    // get data passed in from settings-data container
    const userSettings = this.props.settings[0];
    // copy props and delete 'unknown prop' settings before passing to div
    const divProps = Object.assign({}, this.props);
    delete divProps.settings;

    return (
      <Modal {...divProps} bsSize="large" aria-labelledby="contained-modal-title-lg">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">Sessionwire Studio Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>AVATAR Talkback Transmission Options</h4>
          <Form>
            <FormGroup>
              <Checkbox inline checked={this.state.sendAudioChecked} onChange={this.toggleSendAudio.bind(this)} >
                Send audio
              </Checkbox>
              {' '}
              <Checkbox inline checked={this.state.sendVideoChecked} onChange={this.toggleSendVideo.bind(this)} >
                Send video
              </Checkbox>
              {' '}
              <Checkbox inline checked={this.state.receiveAudioChecked} onChange={this.toggleReceiveAudio.bind(this)}>
                Receive audio
              </Checkbox>
              {' '}
              <Checkbox inline checked={this.state.receiveVideoChecked} onChange={this.toggleReceiveVideo.bind(this)}>
                Receive video
              </Checkbox>
              {' '}
              <Checkbox inline checked={this.state.pushToTalkChecked} onChange={this.togglePushToTalk.bind(this)}>
                Push to Talk
              </Checkbox>
            </FormGroup>
            <h4>AVATAR Talkback Audio Options</h4>
            <FormGroup>
              <ControlLabel>Audio Mode</ControlLabel>
              <FormControl value={this.state.selectedAudioMode} componentClass="select" placeholder="select Audio Mode" onChange={this.selectAudioMode.bind(this)}>
                <option value="select">select</option>
                <option value="voice">Voice</option>
                <option value="audio">Audio</option>
              </FormControl>
              <ControlLabel>Talkback Source</ControlLabel>
              <FormControl value={this.state.selectedTalkbackSource} componentClass="select" placeholder="select Talkback Input" onChange={this.selectTalkbackSource.bind(this)}>
                <option value="select">select</option>
                {this.state.talkbackSourceOptions}
              </FormControl>
              <ControlLabel>Talkback Destination</ControlLabel>
              <FormControl value={this.state.selectedTalkbackDestination} componentClass="select" placeholder="select Talkback Output" onChange={this.selectTalkbackDestination.bind(this)}>
                <option value="select">select</option>
                {this.state.talkbackDestinationOptions}
              </FormControl>
            </FormGroup>
            <h4>AVATAR Talkback Video Options</h4>
            <FormGroup>
              <ControlLabel>Video Source</ControlLabel>
              <FormControl value={this.state.selectedVideoSource} componentClass="select" placeholder="select Video Source" onChange={this.selectVideoSource.bind(this)}>
                <option value="select">select</option>
                {this.state.videoSourceOptions}
              </FormControl>
            </FormGroup>
            <h4>AVATAR Talkback Advanced Options</h4>
            <FormGroup>
              <Checkbox inline checked={this.state.freshIceChecked} onChange={this.toggleFreshIce.bind(this)} >
                Fresh Ice
              </Checkbox>
            </FormGroup>
          </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
          <Button bsStyle="info" onClick={this.handleUpdateSettings.bind(this)}>Apply Settings</Button>
          <Button bsStyle="success" onClick={this.handleSave.bind(this)}>Save Settings</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
