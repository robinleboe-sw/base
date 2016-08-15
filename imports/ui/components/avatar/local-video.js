/**
 * Local video component for Avatar A/V chat
 */

import React from 'react';
import '/imports/modules/js/sw_meters.js'
import { Session } from 'meteor/session'

const localVideoStyle = {
  display: "block"
}

const localVideoVUStyle = {
  // float: "left",
  // height: "100%",
  // width: "100%",
  display: "block",
}

export class LocalVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: false,
      settingsShow: false,
      connectShow: false,
      alertVisible: true
    };
  }

  render() {
    const { settings } = this.props;

    return (
      <div id="divLocalVid" className="videocontainer">
        <p>{settings.profile.name.first} {settings.profile.name.last}</p>
        <video
          autoPlay="autoplay"
          id="localVideo"
          className="easyrtcMirror"
          muted="muted"
          style={localVideoStyle}
        />
        <div id="divLocalVU" className="vumetr" style={localVideoVUStyle}>
          {/*<canvas style={localVideoVUCanvasStyle}/>*/}
        </div>
      </div>
    )
  }
}
