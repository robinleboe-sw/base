/**
 * Remote video component for Avatar A/V chat
 */

import React from 'react';
import { attachSinkId } from '../../../modules/attach-sink-id'
import '../../../modules/js/vumetr.js'

const remoteVideoStyle = {
  display: "block",
  border: "solid thin black"
}

const remoteVideoVUStyle = {
  display: "block"
}

export class RemoteVideo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      videoShow: true
    };
    this.handleVideoToggle = this.handleVideoToggle.bind(this);

  }

  initMeter() {
    // get ref
    const vu = this.divRemoteVU;
    // instantiate meter using jQuery TODO: refactor to remove jQuery dependency
    $(vu).vumetr();
    // initial settings
    $(vu).vumetr('lightMode', 'night');
    $(vu).vumetr('power', false);
  }

  handleVideoToggle() {
    this.setState({videoShow: !this.state.videoShow})
  }

  componentDidMount() {
    this.initMeter()
  }

  render() {
    const { settings } = this.props;

    return (
      <div id="divRemoteVid" className="videocontainer">
        <p>{settings.profile.name.first} {settings.profile.name.last}</p>
        <video
          autoPlay="autoplay"
          ref={(video) => {
              if(video != null) {
                var sinkId = settings.settings.selectedTalkbackDestination;
                attachSinkId(video, sinkId);
              }
            }
          }
          id="remoteVideo"
          className={this.state.videoShow ? 'hidden easyrtcMirror' : 'easyrtcMirror'}
          muted="muted"
          style={remoteVideoStyle}
          onClick={this.handleVideoToggle}
        />
        <div
          id="divRemoteVU"
          ref={(vu) => this.divRemoteVU = vu}
          className={this.state.videoShow ? 'vumetr' : 'hidden vumetr'}
          style={remoteVideoVUStyle}
          onClick={this.handleVideoToggle}
        ></div>
      </div>
    )
  }
}

