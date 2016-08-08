//
// sw_audio_video.js
// Main module for avatar audio/video communications
// Login/logout, call setup/hangup
//


// globals
var localEasyrtcid = "";
var remoteEasyrtcid = "";

//var havelocalVideo = false;

function disable(domId) {
    document.getElementById(domId).disabled = "disabled";
}

function enable(domId) {
    document.getElementById(domId).disabled = "";
}

function isDisabled(domId) {
  return (document.getElementById(domId).disabled === "disabled");
}
function isEnabled(domId) {
  return (document.getElementById(domId).disabled === "");
}


// audioVideoInit()
//
// DON'T NEED THIS state set in connect-modal.js
// function audioVideoInit() {
//   enable("connectButton");
//   disable("disconnectButton");
//
// }

///////////////
// Log on/off
///////////////

function sw_LogIn() {
  sw_utils.TRACE.orange('sw_LogIn(): Logging In..');

  easyrtc.enableAudio(document.getElementById("shareAudio").checked);
  easyrtc.enableVideo(document.getElementById("shareVideo").checked);
  easyrtc.enableDataChannels(true);
  easyrtc.setRoomOccupantListener( convertListToButtons);

  // Connect to signalling server
  easyrtc.connect("sessionwire.avatar", loginSuccess, loginFailure);

  // FILE
  sw_filesharing_connect(remoteEasyrtcid);   // TODO: This doesn't make sense here: There is no remoteEasyrtcid until we have a call in place

}


//
//
function loginSuccess(easyrtcid) {
  disable("connectButton");
  enable("disconnectButton");
  enable('otherClients');
  localEasyrtcid = easyrtcid;
  document.getElementById("iam").innerHTML = "I am " + easyrtc.idToName(easyrtcid) + " (" + easyrtc.cleanId(easyrtcid) + ")";
  console.log('logged in');  ////   easyrtc.showError("noerror", "logged in");

  //AVATAR: create the avatar stream with the current device selections
  avatar.createStream();

  // MESH: create the mesh stream: audio constraints are hard-coded
  if(mesh){ mesh.createStream(); }

  $('#divLocalVU').vumetr('power', true);   //TODO: Logic ....
  if ($("#divLocalVU").is(":visible"))
    showLocalMeter();

  start_VU_Update();  ///////

  //DEBUG:
  var myrooms = easyrtc.getRoomsJoined();
  sw_utils.TRACE.orange('I am in rooms: ' + JSON.stringify(myrooms) );

  //FILE
  sw_filesharing_init(remoteEasyrtcid); // TODO: This doesn't make sense here: There is no remoteEasyrtcid until we have a call in place

}


function loginFailure(errorCode, message) {
  easyrtc.showError(errorCode, message);

  $('#divLocalVU').vumetr('power', false);
}


function sw_LogOut() {
  sw_utils.TRACE.enter('sw_LogOut()');

  easyrtc.disconnect();
  document.getElementById("iam").innerHTML = "logged out";
  enable("connectButton");
  disable("disconnectButton");

  //MESH: clean up and close mesh stream
  if(mesh){  mesh.closeStream(); }

  //AVATAR: clean up and close avatar Stream
  avatar.closeStream();

  easyrtc.setRoomOccupantListener( function(){});
  clearConnectList();

  $('#divLocalVU').vumetr('power', false);
  showLocalMeter(); /////////////////////////
  stop_VU_Update(); ////////
  hangup(); ///RJB

  sw_utils.TRACE.orange('sw_LogOut(): Logged Out');
  sw_utils.TRACE.leave('sw_LogOut()');
}


////////////////////
// Call Management
////////////////////


// setCallConnectedUI()
// update UI items based call state: connected or not
//
function setCallConnectedUI(connected) {
  if(connected) {
    enable('hangupButton');
    if(remoteEasyrtcid) {
      document.getElementById('remoteUserName').innerHTML = easyrtc.idToName(remoteEasyrtcid);
      document.getElementById("talkingto").innerHTML = "Talking to " + easyrtc.idToName(remoteEasyrtcid);
//      document.getElementById('callerBtn_' + remoteEasyrtcid).style.color = '#666';  /////////////////////////////////
    }
    else {
      document.getElementById('remoteUserName').innerHTML = "";
      document.getElementById("talkingto").innerHTML = "<br />";
    }
  } else {
    disable('hangupButton');
    document.getElementById('remoteUserName').innerHTML = "";
    document.getElementById("talkingto").innerHTML = "<br />";
// don't have remoteEasyrtcid after other end hangs up:   document.getElementById('callerBtn_' + remoteEasyrtcid).style.color = '#000';  /////////////////////////////////
  }
  showRemoteMeter();

}


function hangup() {
    easyrtc.hangupAll();
  // TODO: remoteEasyrtcid = "";
  setCallConnectedUI(false); // disable('hangupButton');
//  showRemoteMeter(); // setMeterOnOff('divRemoteVU');  //// set meter on/off depending on connection
//  stop_VU_Update();  /////
//  $('#divLocalVU').vumetr('setMeter',0);
}


function clearConnectList() {
    var otherClientDiv = document.getElementById('otherClients');
    while (otherClientDiv.hasChildNodes()) {
        otherClientDiv.removeChild(otherClientDiv.lastChild);
    }
}

/**
 * clear existing button list of users in the room, rebuild it from occupants list,
 * set the onclick function to make the call to the remote user
 */
function convertListToButtons (roomName, occupants, isPrimary) {
    clearConnectList();
    var otherClientDiv = document.getElementById('otherClients');
    for(var easyrtcid in occupants) {
        var button = document.createElement('button');
      button.id = 'callerBtn_' + easyrtcid;
        button.onclick = function(easyrtcid) {
            return function() {
                performCall(easyrtcid);
            };
        }(easyrtcid);  //  ?? TODO

        var label = document.createTextNode("Call " + easyrtc.idToName(easyrtcid));
        button.appendChild(label);
        otherClientDiv.appendChild(button);
    }
}


//
// performCall()
// Set SDP for both mesh and avatar streams, add the mesh stream to the call, then call the remote end.
//
function performCall(otherEasyrtcid) {
  sw_utils.TRACE.enter('performCall()');
  sw_utils.TRACE.green('Media IDs: ' + easyrtc.getLocalMediaIds() ); ///DEBUG

  document.getElementById("talkingto").innerHTML = "Calling " + easyrtc.idToName(otherEasyrtcid) + "..."; ///////////////

  easyrtc.hangupAll();
  remoteEasyrtcid = "";   ///////##### TEMP DEBUG...
  easyrtc.setAutoInitUserMedia(false); ///////

  var acceptedCB = function(accepted, easyrtcid) {
    if( !accepted ) {
      easyrtc.showError("CALL-REJECTED", "Sorry, your call to " + easyrtc.idToName(easyrtcid) + " was rejected");
      enable('otherClients');
      setCallConnectedUI(false); //////////////////
    }
  };

  var successCB = function(easyrtcid, mediaType){
    sw_utils.TRACE.enter('successCB()');

    console.log("Got mediaType " + mediaType + " from " + easyrtc.idToName(easyrtcid));

    setCallConnectedUI(true); // enable('hangupButton');   // modify remoteUserName everywhere hangup button enabled/disabled
    sw_utils.TRACE.leave('successCB()');
  };

  var failureCB = function() {
    enable('otherClients');
    setCallConnectedUI(false); /////////////////
  };

  avatar.setSDP(); // set avatar sdp filters for audio or voice
  if(mesh){ mesh.setSDP(); } //## set mesh sdp filters
  // TODO: Appears that last SDP to be set affects both streams. But both streams routed to speakers regardless..

  sw_utils.TRACE.green('Pre-call - Media IDs: ' + easyrtc.getLocalMediaIds() ); ///DEBUG

  // TODO: streams are not always muxed in same order, so try calling and accepting with sorted list of streamNames. UPDATE: doesn't change anything.
 easyrtc.call(otherEasyrtcid, successCB, failureCB, acceptedCB, easyrtc.getLocalMediaIds().sort());
//ADDMESHTEST    easyrtc.call(otherEasyrtcid, successCB, failureCB, acceptedCB, avatar.streamName);  //ADDMESHTEST

//ADDMESHTEST    addMeshStreamtoCall(); //ADDMESHTEST

  sw_utils.TRACE.leave('performCall()');
}


//
// sets callback to receive media streams from other peers. callback can be called by either caller or callee
// MESH Connect stream to appropriate DOM element depending on which stream passed as param.
//
easyrtc.setStreamAcceptor( function(easyrtcid, stream, streamName) {
  sw_utils.TRACE.enter('StreamAcceptor()');

  sw_utils.TRACE.green('Media IDs: ' + easyrtc.getLocalMediaIds() ); ///DEBUG
  console.log('Stream: ' + stream.id + ' (' + streamName + ')' ); ///DEBUG

  // select audio or video element depending on incoming stream
  if (mesh) { //MESH
    if ( streamName === mesh.streamName ) {
      var element = mesh.remoteAudio;  // Mesh Audio
    } else if ( streamName === avatar.streamName ) {
      var element = avatar.remoteVideo;  // remote video
    } else {
      sw_utils.TRACE.orange('UNKNOWN STREAM:' + stream.id + ' (' + streamName + ')');
    }
  } else { // no Mesh instantiated
    var element = avatar.remoteVideo;  // remote video
  }

  /// DEBUG - both streams mixed output on avatar.remoteVideo, no output on mesh.remoteAudio
  /// DEBUG - commenting out "element = avatar.remoteVideo" above causes both streams' mixed output on mesh.remoteAudio
  /// related: see easyrtc.js line 1293? multistreams not right?
  /// Experiment to see if order of attaching stream matters: yes it does. First element to be attached gets both streams.
  /// if ( streamName === mesh.streamName ) { // only connect one stream to both elements
  ///    easyrtc.setVideoObjectSrc(avatar.remoteVideo, stream); // first of these gets both streams: reversing order reverses which element gets both streams
  ///    easyrtc.setVideoObjectSrc(mesh.remoteAudio, stream);
  /// }

  sw_utils.TRACE.blue('Attaching incoming stream: ' + stream.id + ' (' + streamName + ') ' + ' to: ' + element.id);
//  easyrtc.clearMediaStream(element); // Debug: should not be necessary.
  easyrtc.setVideoObjectSrc(element, stream);

//  sw_utils.TRACE.blue("accepted incoming stream with name " + stream.streamName);
//  sw_utils.TRACE.blue("checking incoming " + easyrtc.getNameOfRemoteStream(easyrtcid, stream));

  remoteEasyrtcid = easyrtcid;  ///////
  setCallConnectedUI(true);

  dumpAVTracks(stream);  // DEBUG

  sw_utils.TRACE.leave('StreamAcceptor()');
});


//
// need to clean up after closing both local and remote easyrtcids
//
easyrtc.setOnStreamClosed( function (easyrtcid, stream, streamName) {
  console.log( easyrtc.idToName(easyrtcid) + " closed stream: " + stream.id + " " + streamName);

  if(mesh && (streamName === mesh.streamName) ) {//MESH
    easyrtc.clearMediaStream( mesh.remoteAudio ); // set stream for element to ''
  } else { //MESH
    easyrtc.clearMediaStream( avatar.remoteVideo ); // set stream for element to ''
  }

  setCallConnectedUI(false); // disable("hangupButton");
});


var callerPending = null;

easyrtc.setCallCancelled( function(easyrtcid){
    if( easyrtcid === callerPending) {
        document.getElementById('acceptCallBox').style.display = "none";
        callerPending = false;
    }
});


// set function to check and act on call accepted buttons, call the easyrtc callback function
easyrtc.setAcceptChecker(function(easyrtcid, callback) {
  sw_utils.TRACE.enter('AcceptChecker()');

  document.getElementById('acceptCallBox').style.display = "block";
  callerPending = easyrtcid;
  if( easyrtc.getConnectionCount() > 0 ) {
    document.getElementById('acceptCallLabel').innerHTML = "Drop current call and accept new from " + easyrtc.idToName(easyrtcid) + " ?";
  }
  else {
    document.getElementById('acceptCallLabel').innerHTML = "Accept incoming call from " + easyrtc.idToName(easyrtcid) + " ?";
  }


// Called on click of 'Accept the call' button
  var acceptTheCall = function(wasAccepted) {
    sw_utils.TRACE.enter('acceptTheCall()');
    document.getElementById('acceptCallBox').style.display = "none";
    if( wasAccepted && easyrtc.getConnectionCount() > 0 ) {
      console.log("Hanging up current calls");
      easyrtc.hangupAll();  // hang up on current calls to accept this one
    }

    // callback(wasAccepted);
    sw_utils.TRACE.green('Media IDs: ' + easyrtc.getLocalMediaIds() ); ///DEBUG
    var localIds = easyrtc.getLocalMediaIds(); //TODO : make array and use in callback

    // streams are getting swapped, so calling and accepting with sorted list of streamNames. UPDATE: doesn't appear to solve the problem.
    easyrtc.setAutoInitUserMedia(false); ///////

  callback(wasAccepted, easyrtc.getLocalMediaIds().sort());  // accept using all local media streamNames
//ADDMESHTEST      callback(wasAccepted, avatar.streamName);  // accept using avatar local media streamName //ADDMESHTEST

    callerPending = null;
    sw_utils.TRACE.leave(' acceptTheCall()');
  };
  /*******/

  document.getElementById("callAcceptButton").onclick = function() {
    acceptTheCall(true);
  };

  document.getElementById("callRejectButton").onclick = function() {
    acceptTheCall(false);
  };

  sw_utils.TRACE.leave(' AcceptChecker()');
} );


//
// TEST: ADDMESHTEST
function addMeshStreamtoCall() {
  mesh.setSDP(); //## set mesh sdp filters
  easyrtc.addStreamToCall(remoteEasyrtcid, mesh.streamName);
}


//////////////
//
// tip from: http://muaz-khan.blogspot.ca/2014/05/webrtc-tips-tricks.html
// or, could use easyrtc.enableMicrophone() - TODO: see if it operates on all audio sources or just selected one. See easyrtc.js, https://easyrtc.com/docs/browser/easyrtc.php
//
function enableLocalAudio(flag) {
  sw_utils.TRACE.enter('enableLocalAudio()');

  var audioEnable = false;

  // if push-to-talk feature enabled, enable audio based on flag==true, otherwise mute on flag==true
  if( document.getElementById('pushToTalk').checked ){
    document.getElementById('talkButton').firstChild.data = 'Talkback';
    audioEnable = (flag == 'true');
  } else {
    document.getElementById('talkButton').firstChild.data = 'Mute';
    audioEnable = !(flag == 'true');;
  }

  sw_utils.TRACE.green('Media IDs: ' + easyrtc.getLocalMediaIds() ); ///DEBUG
  var ds = easyrtc.getLocalStream('default');
  if(ds) { console.log('default stream:' + ds.id ); } ///DEBUG

  var localStream = easyrtc.getLocalStream(avatar.streamName);
  if(!localStream) {
    sw_utils.TRACE.leave('enableLocalAudio(): could not get local stream');
    return;
  }

  console.log("getLocalStream(avatar.streamName).id: " + localStream.id); ///////DEBUG

  var audioTracks = localStream.getAudioTracks();
  console.log("Device:" + audioTracks[0].label + " flag:" + flag);

  // if MediaStream has reference to audio source: audioTracks[0] is current setting
  // TODO: should use easyrtc.enableMicrophone(enable, streamName) ??
  if (audioTracks[0]) {
    audioTracks[0].enabled = audioEnable;
  }

  swDumpStreamStats(); // DEBUG

  sw_utils.TRACE.leave('enableLocalAudio()');

}



//////////////////////
// DEBUG UTILITIES
//////////////////////


//
//@private
//
function dumpAVTracks(stream) {
  var NumAud = stream.getAudioTracks().length;
  var NumVid = stream.getVideoTracks().length;
  sw_utils.TRACE.orange('Stream ' + stream.id + " has " + NumAud + ' audio tracks and ' + NumVid + ' video tracks');
}


// Testing function, invoke from button to show stats from remote end on RTP stream
//
//@private
//
function swDumpStreamStats() {

  // tmp: debug: look at ICE stuff
  // var server_ice = easyrtc.getServerIce();
  // sw_utils.TRACE.orange(JSON.stringify(server_ice));

  // See easyrtc.js, search for "this.chromeStatsFilter" for Google and Firefox formats for statsfilter
  // add stats as needed, e.g. network dropouts...
  // also http://www.testuser.com/talk/app/webrtc/statscollector.cc
  var chromeAudioStatsFilt = [
    {
    "packetsSent": "audioPacketsSent"
    },
    {
    "packetsSent": "videoPacketsSent"
    },
    {
    "packetsLost": "videoPacketsLost",
    "packetsReceived": "videoPacketsReceived"
    },
    {
    "packetsLost": "audioPacketsLost",
    "packetsReceived": "audioPacketsReceived",
    "audioOutputLevel": "audioOutputLevel"
    },
    {
    "googRemoteAddress": "remoteAddress"
    },
    {
    "audioInputLevel": "audioInputLevel"
    }
    ];

  function statsCallback(id, stats) {
    console.log( JSON.stringify(stats) );
//    var inLevel = stats.audioInputLevel/32768;
//    var outLevel = stats.audioOutputLevel/32768;
  }

  if(remoteEasyrtcid) {
    easyrtc.getChromePeerStatistics(remoteEasyrtcid, statsCallback, chromeAudioStatsFilt);
  // Easyrtc 1.0.17 changed call to: easyrtc.getPeerStatistics. It is still 'experimental' :(
  //  easyrtc.getPeerStatistics(remoteEasyrtcid, statsCallback, chromeAudioStatsFilt);
  } else {
    console.log('swDumpStreamStats(): no remote stream');
  }

}


//
//@private
//
function DEBUG_dump_DOM_Devices() {
  var a_in = document.getElementById('meshAudioIn');
  var a_out = document.getElementById('meshAudioOut');
  var self_v = document.getElementById('localVideo');
  var remote_v = document.getElementById('remoteVideo');
  console.log('*********** DOM ELEMENTS');
  console.log('AudioIn sinkId: ', a_in.sinkId + 'srcObject: ' + a_in.srcObject);
  console.log('AudioIn: ', a_in);
  console.log('AudioOut: ', a_out);
  console.log('localVideo: ', self_v);
  console.log('remoteVideo: ', remote_v);
  console.log('*********** ');

}
