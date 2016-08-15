/**
 * Remote video component for Avatar A/V chat
 */

import React from 'react';
import '../../../modules/js/sw_meters'
import { attachSinkId } from '../../../modules/attach-sink-id'

const remoteVideoStyle = {
  display: "block"
}

const remoteVideoVUStyle = {
  // float: "left",
  // height: "100%",
  // width: "100%",
  display: "block",
}

export class RemoteVideo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { settings } = this.props;

    return (
      <div id="divRemoteVid" className="videocontainer">
        <p>{settings.profile.name.first} {settings.profile.name.last}</p>
        <video
          autoPlay="autoplay"
          ref={function(video) {
              if(video != null) {
                var sinkId = settings.settings.selectedTalkbackDestination;
                attachSinkId(video, sinkId);
              }
            }
          }
          id="remoteVideo"
          className="easyrtcMirror"
          muted="muted"
          style={remoteVideoStyle}
        />
        <div id="divRemoteVU" className="vumetr" style={remoteVideoVUStyle}></div>
      </div>
    )
  }
}

