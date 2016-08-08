import React from 'react';
import { Navbar, Row } from 'react-bootstrap';

const localVideoStyle = {
  display: "block"
}

const localVideoVUStyle = {
  float: "left", height: "100%", display: "block",
}

export class LocalVideo extends React.Component {


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
