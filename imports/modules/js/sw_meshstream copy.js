//////////////////////////////////////////////
// meshStream
// Created: June 17, 2016
// RJB
//
//////////////////////////////////////////////

/*
 NOTES
 Caller remotemeter dead: shows -25 dB. Caller remotevideo not active: can't switch by clicking on meter. Caller localvideo and meter ok: shows audio signal
 Callee localmeter = -20dB, localvideo ok: can switch by clicking on meter. Callee remotevideo and meter ok: shows audio signal.
 SDP looks like two video streams the same?
 MediaIds ok: Media IDs: avatarStream,meshAudioStream
 StreamAcceptor called once for each stream..
 
 callee: crashing in acceptthecall() easyrtc line 3801: streamnames is 2 elements, but elem[1] is undefined.
 solution: .call with one stream, then add stream..
 
 NOTE:     callback(wasAccepted, [avatar.streamName, mesh.streamName]); Error in easyrtc: second element in array is undefined. one stream at a time?
 
 can't call addStreamtoCall in successCB? But can't call unless call already initiated.
 Error messages
 set-remote-description: OperationError: Failed to set remote offer sdp: Called in wrong state: STATE_SENTOFFER
 
 >>>>>Cant add stream before, after or during a call!: maybe have to modify easyrtc.js buildPeerConnection to call with different sdp filters per stream?.. or easyrtc.call to use array of sdp_filters... See callBody() in easyrtc.js
 DEBUG: test call with all using same sdp. If works, then work on separate sdp in adStream. Call priologix...
 */


/**
 * Construct a new meshStream object for audio transmission, attaches a dummy video element to DOM element passed as first parameter.
 * @param {String} meshAudioDiv - DOM element to attach audio in and out elements.
 * @example
 *      var mesh = new meshStream('meshAudioDiv');
 */
meshStream = function(meshAudioDiv) {
  
  this.streamName = 'meshAudioStream';  // Name for MESH network stream
  this.meshAudioInId = 'meshAudioIn';       // DOM element for MESH audio input
  this.meshAudioOutId = 'meshAudioOut';     // DOM element for MESH audio output
  this.audioInputDeviceId = '';             // Device connected to meshAudioIn - normally SW Driver
  this.audioOutputDeviceId = '';            // Device connected to meshAudioOut - normally SW Driver
  
  document.getElementById(meshAudioDiv).innerHTML = '<audio autoplay="autoplay" muted="muted" volume="0" style="display:none;" id=' + this.meshAudioInId + '></audio>';
  document.getElementById(meshAudioDiv).innerHTML += '<audio autoplay="autoplay" style="display:none;" id=' + this.meshAudioOutId + '></audio>';
  
}


//
// init()
// Initialize the object: set bitrate, codec, attach local stream to audio input element
//
meshStream.prototype.init = function() {
  console.log('Entering mesh.init()...');
  console.log('Nothing to do yet.');
  console.log('... Leaving mesh.init()');
}


/**
 *  create the stream, connect input and output devices
 *
 */
meshStream.prototype.createStream = function() {
  var self = this;
  console.log('Entering mesh.createStream()...');
  
  var audiostream = easyrtc.getLocalStream(self.streamName);
  if (audiostream) {
    audiostream.getTracks().forEach(function(track) {
      track.stop();
    });
  }
  
  
  
  // Attach audio output device to video element using device/sink ID.
  function attachSinkId(element, sinkId) {
    if (typeof element.sinkId !== 'undefined') {
      element.setSinkId(sinkId)
      .then(function() {
        console.log('Audio output device attached: ' + sinkId + ' to: ' + element.id);
      })
      .catch(function(error) {
        var errorMessage = error;
        if (error.name === 'SecurityError') {
          errorMessage = 'You need to use HTTPS for selecting audio output ' +
          'device: ' + error;
        }
        console.error(errorMessage);
        // Jump back to first output device in the list as it's the default.
        audioOutputSelect.selectedIndex = 0;
      });
    } else {
      console.warn('Browser does not support output device selection.');
    }
  }
  
  
  // get audio input and output device ids by enumerating devices and selecting the sessionwire drivers
  navigator.mediaDevices.enumerateDevices().then( function (deviceInfos) {
    for (var i = 0; i !== deviceInfos.length; ++i) {
      var deviceInfo = deviceInfos[i];
      if (deviceInfo.kind === 'audioinput' && deviceInfo.label === 'Soundflower (2ch)') {
        self.audioInputDeviceId = deviceInfo.deviceId;
      }
      if (deviceInfo.kind === 'audiooutput' && deviceInfo.label === 'Soundflower (64ch)') {
        self.audioOutputDeviceId = deviceInfo.deviceId;
        var domId = document.getElementById(self.meshAudioOutId); /////////// Had to put this here..
        attachSinkId(domId, self.audioOutputDeviceId );        ////////
      }
    }
  }).then( function () {
  
  console.log('mesh.audioInputDeviceId: ' + self.audioInputDeviceId);
  console.log('mesh.audioOutputDeviceId: ' + self.audioOutputDeviceId);

    });
  /***************
   var audioSource = self.audioInputDeviceId; //document.querySelector('select#audioSource').value;
   easyrtc._presetMediaConstraints = {
   audio: {
   deviceId: audioSource ? {exact: audioSource} : undefined,
   mandatory: { echoCancellation: false, googEchoCancellation: false }
   },
   video: false  // no video // video: {deviceId: videoSource ? {exact: videoSource} : undefined}
   };
   
   
   // DEBUG
   console.log('############################');
   console.log('meshstream.init(): Stream constraints:', easyrtc._presetMediaConstraints);
   
   // get mediastream from audiosource select
   easyrtc.enableVideo(false);
   //    easyrtc.setVideoSource(self.audioInputDeviceId); ///////////
   easyrtc.initMediaSource(
   function(mediastream){
   elmt = document.getElementById(self.meshAudioInId);
   easyrtc.setVideoObjectSrc( elmt, mediastream );
   console.log('attaching stream: ' + mediastream.id);
   
   var tmpdebugstr = easyrtc.getLocalStream(self.streamName);
   console.log('meshStream.initMediaSource(): attached Audio Input device: ' + self.audioInputDeviceId + ' to: ' + self.meshAudioInId);
   },
   function(errorCode, errorText){
   easyrtc.showError(errorCode, errorText);
   },
   self.streamName);
   
   })
   .catch( function(error) {
   console.log('navigator.getUserMedia error: ', error);
   });
   *********/
  
  //
  function mesh_gotStream(stream) {
    console.log('Entering mesh_gotStream()...');
    
    // set name for stream to allow dealing with multiple streams, attach to media element
    easyrtc.register3rdPartyLocalMediaStream(stream, self.streamName);
    console.log("getLocalStream(mesh.streamName).id: " + easyrtc.getLocalStream(self.streamName).id); ///////DEBUG
    console.log('Media IDs: ' + easyrtc.getLocalMediaIds() ); ///DEBUG
    
    console.log('attaching stream: ' + stream.id + ' to: ' + self.meshAudioInId);
    elmt = document.getElementById(self.meshAudioInId);
    easyrtc.setVideoObjectSrc( elmt, stream );
    
    console.log('...Leaving mesh_gotStream()');
  }
  
  
  var audioSource = self.audioInputDeviceId;
  var constraints = {
  audio: {
  deviceId: audioSource ? {exact: audioSource} : undefined,
  mandatory: { echoCancellation: false, googEchoCancellation: false }
  },
  video: false  // no video
  };
  
  navigator.mediaDevices.getUserMedia(constraints).then(mesh_gotStream)
  .catch( function(error) {
    console.log('navigator.getUserMedia error: ', error);
  });
  
  console.log('... Leaving mesh.createStream()');
}


//
// setSDP()
// set SDP parameters for codec, bitrate, mode for 'Voice' (conferencing) or 'Audio' (high quality)
// This should be called immediately before easyrtc.call();
//
meshStream.prototype.setSDP = function () {
  // set sdp params and getUserMedia constraints
  var audiobitrate='400'; //kbits/s
  local_sdp_filter = '';               // SDP filters passed during call() or on adding stream to set codecs, bitrates, modes
  remote_sdp_filter = '';
  
  // RJB: see  easyrtc_rates.js: corrected logic bug and modified addStereo() to include sprop-stereo=1;
  local_sdp_filter = easyrtc.buildLocalSdpFilter({audioRecvCodec: 'opus/48000/2', audioRecvBitrate: audiobitrate, stereo: 1 });
  remote_sdp_filter = easyrtc.buildRemoteSdpFilter({audioSendCodec: 'opus/48000/2', audioSendBitrate: audiobitrate, stereo: 1 }); // ditto
  // set these when adding stream to call  easyrtc.setSdpFilters(self.local_sdp_filter, self.remote_sdp_filter);
  
  easyrtc.setSdpFilters(local_sdp_filter, remote_sdp_filter);  // Note: filters are reset in this call
}



//
// closeStream()
//
meshStream.prototype.closeStream = function() {
  var self = this;
  console.log('Entering meshstream.closeStream()...');
  console.log('meshstream: ' + easyrtc.getLocalStream(self.streamName).id);
 
  //  easyrtc.setVideoObjectSrc(document.getElementById(mesh.meshAudioInId), "");  //MESH
  easyrtc.clearMediaStream( document.getElementById(self.meshAudioInId) );
  easyrtc.clearMediaStream( document.getElementById(self.meshAudioOutId) );
  easyrtc.closeLocalMediaStream(self.streamName);
  console.log('...Leaving meshstream.closeStream()');
}

//
// getaudioInputDeviceId()
//
meshStream.prototype.getaudioInputDeviceId = function() {
  var self = this;
  return self.audioInputDeviceId;
}


//
// getaudioOutputDeviceId()
//
meshStream.prototype.getaudioOutputDeviceId = function() {
  var self = this;
  return self.audioOutputDeviceId;
}

//
// Instantiate meshStream object
//
var mesh = new meshStream('meshAudioDiv');  //MESH

