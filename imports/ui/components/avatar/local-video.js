/**
 * Local video component for Avatar A/V chat
 */

import React from 'react';
import '../../../modules/js/vumetr.js'

const localVideoStyle = {
  display: "block",
  border: "solid thin black"
}

const localVideoVUStyle = {
  display: "block"
}

export class LocalVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: false,
      videoShow: true
    };
    this.handleVideoToggle = this.handleVideoToggle.bind(this);
  }

  initMeter() {
    // get ref
    const vu = this.divLocalVU;
    // instantiate meter using jQuery TODO: refactor to remove jQuery dependency
    if(vu != null) {
      $(vu).vumetr();
      // initial settings
      $(vu).vumetr('lightMode', 'night');
      this.state.connected ? $(vu).vumetr('power', true) : $(vu).vumetr('power', false);
    }
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
      <div id="divLocalVid" className="videocontainer">
        <p>{settings.profile.name.first} {settings.profile.name.last}</p>
          <video
            autoPlay="autoplay"
            id="localVideo"
            className={this.state.videoShow ? 'hidden easyrtcMirror' : 'easyrtcMirror'}
            muted="muted"
            style={localVideoStyle}
            onClick={this.handleVideoToggle}
          />
          <div
            id="divLocalVU"
            ref={(vu) => this.divLocalVU = vu}
            className={this.state.videoShow ? 'vumetr' : 'hidden vumetr'}
            style={localVideoVUStyle}
            onClick={this.handleVideoToggle}>
          </div>

      </div>
    )
  }
}
