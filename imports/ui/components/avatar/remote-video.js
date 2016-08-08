import React from 'react';
import { Navbar, Row } from 'react-bootstrap';

const remoteVideoStyle = {
  display: "block"
}

const remoteVideoVUStyle = {
  float: "left", height: "100%", display: "block",
}

export class RemoteVideo extends React.Component {


  render() {

    return (
      <div id="divRemoteVid" className="videocontainer">
        <video
          autoPlay="autoplay"
          id="remoteVideo"
          className="easyrtcMirror"
          muted="muted"
          style={remoteVideoStyle}
        />
        <div id="divRemoteVU" className="vumetr" style={remoteVideoVUStyle}>
          <canvas
            width="300"
            height="225"
          />
        </div>
        <div id="remoteUserName" className="userName">David St. Hubbins</div>
      </div>
    )
  }
}

