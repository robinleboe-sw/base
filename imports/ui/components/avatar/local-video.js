import React from 'react';
import '/imports/modules/js/sw_meters.js'
import { Session } from 'meteor/session'

const localVideoStyle = {
  display: "block"
}

const localVideoVUStyle = {
  float: "left", height: "100%", display: "block",
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

    return (
      <div id="divLocalVid" className="videocontainer">
        <video
          autoPlay="autoplay"
          id="localVideo"
          className="easyrtcMirror"
          muted="muted"
          style={localVideoStyle}
        />
        <div id="divLocalVU" className="vumetr" style={localVideoVUStyle}>
          <canvas
            width="300"
            height="225"
          />
        </div>
        <div id="localUserName" className="userName">Nigel Tufnel</div>
      </div>
    )
  }
}
