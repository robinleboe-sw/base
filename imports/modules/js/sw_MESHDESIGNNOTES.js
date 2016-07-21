

/*****************
 
 ///// Changes to support multiple streams from multiple devices:
 see https://easyrtc.com/docs/browser/easyrtc.html#toc_17
 easyrtc has support for multiple named mediastreams per connection , supported through the mediaIds apifield, getMediaStreamByName(), getLocalMediaIds(), closeLocalMediaStream(), buildLocalMediaStream(), getRemoteStream(), addStreamToCall(). See issue #34.
 
 see call, setAcceptChecker fns: take multiple streamNames
 lookup MediaStreamTrack...
 ===> Check easyrtc.js to verify: the documentation is flakey.
 -----------
 relevant easyrtc calls: (update existing to add streamName)
 
 addStreamToCall(easyrtcId, streamName)
 buildLocalMediaStream(streamName, audioTracks, videoTracks) → {void}  (To get named stream)
 
 call(otherUser, callSuccessCB, callFailureCB, wasAcceptedCB, streamNames)
 closeLocalMediaStream(streamName)
 enableCamera(enable, streamName) (maybe)
 enableMicrophone(enable, streamName)  (for mic mute, talkback)
 getNameOfRemoteStream(easyrtcid, stream)
getRemoteStream(easyrtcid, remotestreamName) → {Object}
 getLocalStream(streamName)
 getLocalMediaIds()
 haveAudioTrack(easyrtcid, streamName) → {Boolean}  (check if we have hifi track - may want to just use as conferencing app)
 haveVideoTrack(easyrtcid, streamName) → {Boolean}
 
 initMediaSource(successCallback, errorCallback, streamName)
 
 makeLocalStreamFromRemoteStream(easyrtcid, remotestreamName, localstreamName) (when supporting multiple users on a call)
 
 setAcceptChecker((callerEasyrtcid, acceptor))  (acceptor callback function now can take streamName)
 setOnStreamClosed(onStreamClosed) (onStreamClosed callback function takes stream, streamName arguments)
 
 NOTE: Could trigger MMC record with onunmute event from incoming mediastreamtrack ?
 see: https://www.w3.org/TR/mediacapture-streams/#mediastreamtrack

 ******************/


// sw_createMeshStream()
// create dummy video element <div id="meshVideoDiv"></div>

// disable the video source for meshStreamName? set sdp params? easyrtc._presetMediaConstraints is deleted after each call to initMediaSource()
// add {OfferToReceiveVideo: false} to sdp constraints as per https://groups.google.com/forum/#!topic/discuss-webrtc/wHMufyuJsQo
// https://groups.google.com/forum/#!searchin/discuss-webrtc/SDP$20audio/discuss-webrtc/e_vfj91IFPs/3_eY2fxFeqIJ
// OR:
// just call easyrtc.enableVideo() before each call to easyrtc.initMediaSource()?
meshStreamName = 'meshAudioStream';
avatarStreamName = 'avatarStream';
// attach input device with easyrtc.setVideoObjectSrc()
// initMediaSource(successCallback, errorCallback, meshStreamName)

// get mediastream from audiosource select
easyrtc.enableVideo(false);
easyrtc.initMediaSource(
  function(mediastream){
    easyrtc.setVideoObjectSrc( document.getElementById("meshVideoDiv"), mediastream);
  },
  function(errorCode, errorText){
    easyrtc.showError(errorCode, errorText);
  },
  meshStreamName);

// set remote video, audio to incoming streams
// read easyrtc.js code: doc at https://easyrtc.com/docs/browser/easyrtc.html is messed up
easyrtc.setStreamAcceptor(function(easyrtcid, stream, streamName) {
  // for all streamNames...
  console.log("ACCEPTOR: streamName= " + streamName);
  if ( streamName == meshStreamName) {
    
  } else if (streamName == avatarStreamName) {
    
  }
});

// set function to check and act on call accepted status
easyrtc.setAcceptChecker(function(easyrtcid, callback) {
  // callback takes second arg of LocalMediaIds...
  callback(wasAccepted, easyrtc.getLocalMediaIds());
});


// in performCall(), make the call using streamNames
easyrtc.call(otherEasyrtcid, successCB, failureCB, acceptedCB, streamNames));

