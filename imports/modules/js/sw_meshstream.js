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
  var self = this;
  
  this.streamName = 'meshStream';           // Name for MESH network stream
  this.meshAudioInId = 'meshAudioIn';       // DOM element for MESH audio input (audio from local input)
  this.meshAudioOutId = 'meshAudioOut';     // DOM element for MESH audio output (audio from remote stream)
  this.audioInputDeviceId = '';             // Device connected to localAudio: Sessionwire 'Send' Driver
  this.audioOutputDeviceId = '';            // Device connected to remoteAudio: Sessionwire 'Receive' Driver
  
  document.getElementById(meshAudioDiv).innerHTML = '<audio autoplay="autoplay" muted="muted" volume="0" style="display:none;" id=' + this.meshAudioInId + '></audio>';
  document.getElementById(meshAudioDiv).innerHTML += '<audio autoplay="autoplay" style="display:none;" id=' + this.meshAudioOutId + '></audio>';
  this.localAudio = document.getElementById(self.meshAudioInId); // DOM element for MESH audio input (audio from local input)
  this.remoteAudio = document.getElementById(self.meshAudioOutId); // DOM element for MESH audio output (audio from remote stream)
}


//
// init()
// Initialize the object: set bitrate, codec, attach local stream to audio input element
//
meshStream.prototype.init = function() {
  console.log('Entering mesh.init()...');
  console.log('..nothing to do here yet.');
  console.log('... Leaving mesh.init()');
}


/**
 *  create the stream, connect input and output devices
 *
 */
meshStream.prototype.createStream = function() {
  sw_utils.TRACE.enter('mesh.createStream()');
  var self = this;
  
  var audiostream = easyrtc.getLocalStream(self.streamName);
  if (audiostream) {
    audiostream.getTracks().forEach(function(track) {
      track.stop();
    });
  }
  
  
  // Attach audio output device to video element using device/sink ID.
  function mesh_attachSinkId(element, sinkId) {
    if (typeof element.sinkId !== 'undefined') {
      element.setSinkId(sinkId)
      .then(function() {
        sw_utils.TRACE.blue('Audio output device attached: ' + sinkId + ' to: ' + element.id);
      })
      .catch(function(error) {
        var errorMessage = error;
        if (error.name === 'SecurityError') {
          errorMessage = 'You need to use HTTPS for selecting audio output ' +
          'device: ' + error;
        }
        console.error(errorMessage);
        // Jump back to first output device in the list as it's the default.
//        audioOutputSelect.selectedIndex = 0;
      });
    } else {
      console.warn('Browser does not support output device selection.');
    }
  }
  
  
  //
  function mesh_gotStream(stream) {
    sw_utils.TRACE.enter('mesh_gotStream()');
    
    // set name for stream to allow dealing with multiple streams, attach to media element
    easyrtc.register3rdPartyLocalMediaStream(stream, self.streamName);
    var ez_stream = easyrtc.getLocalStream(self.streamName);
    
    console.log("getLocalStream(mesh.streamName).id: " + ez_stream.id); ///////DEBUG
    sw_utils.TRACE.green('Media IDs: ' + easyrtc.getLocalMediaIds() ); ///DEBUG
    
//    sw_utils.TRACE.blue('attaching stream: ' + stream.id + '(' + stream.streamName + ') to: ' + self.meshAudioInId);
    sw_utils.TRACE.blue('attaching stream: ' + ez_stream.id + '(' + ez_stream.streamName + ') to: ' + self.localAudio.id);
    elmt = self.localAudio;
    easyrtc.setVideoObjectSrc( elmt, ez_stream );
    
    sw_utils.TRACE.leave('mesh_gotStream()');
  }
  
  
  // get audio input and output device ids by enumerating devices and selecting the sessionwire drivers
  navigator.mediaDevices.enumerateDevices().then( function (deviceInfos) {
    for (var i = 0; i !== deviceInfos.length; ++i) {
      var deviceInfo = deviceInfos[i];
//      if (deviceInfo.kind === 'audioinput' && deviceInfo.label === 'Soundflower (2ch)') {
        if (deviceInfo.kind === 'audioinput' && deviceInfo.label === 'ToSW') {
        self.audioInputDeviceId = deviceInfo.deviceId;
      }
//      if (deviceInfo.kind === 'audiooutput' && deviceInfo.label === 'Soundflower (64ch)') {
        if (deviceInfo.kind === 'audiooutput' && deviceInfo.label === 'FromSW') {
        self.audioOutputDeviceId = deviceInfo.deviceId;
        mesh_attachSinkId(self.remoteAudio, self.audioOutputDeviceId );        ////////
      }
    }
  }).then( function () {
    
    console.log('mesh.audioInputDeviceId: ' + self.audioInputDeviceId);
    console.log('mesh.audioOutputDeviceId: ' + self.audioOutputDeviceId);
    
    var audioSource = self.audioInputDeviceId;

    ////TEST
    easyrtc.enableVideo(false);
//    easyrtc.enableVideoReceive(false); //////TEST: need to enable in avatar

    
    /****** OLD CONSTRAINTS SYNTAX UNTIL CHROME CATCHES UP *********/
    var constraints = setOldAudioConstraints(audioSource);
    // var constraints = setNewAudioConstraints(audioSource);
/*******************/
    
    console.log('Calling gUM...');
    console.log('audioSource = ' + audioSource);
    
    navigator.mediaDevices.getUserMedia(constraints).then(mesh_gotStream)
    .catch( function(error) {
      console.log('navigator.getUserMedia error: ', error);
    });
    
  });
  
  sw_utils.TRACE.leave('mesh.createStream()');
}



//
// Set constraints using old syntax, supported by Chrome 51 and older...
//
setOldAudioConstraints = function (audioSource) {
  var constraints = {
    audio: {
      mandatory: {
        sourceId: audioSource ? audioSource : undefined,
        echoCancellation: false,
        googEchoCancellation: false
      }
    },
  video: false  // no video
  };
  
  return (constraints);
}


//
// DEBUG
//
meshStream.prototype.changeAudioDestination = function () {
  var element = mesh.remoteAudio;
  var sinkId = mesh.audioOutputDeviceId;
  
  if (typeof element.sinkId !== 'undefined') {
    element.setSinkId(sinkId)
    .then(function() {
      sw_utils.TRACE.blue('Audio output device attached: ' + sinkId + ' to: ' + element.id);
    })
    .catch(function(error) {
      var errorMessage = error;
      if (error.name === 'SecurityError') {
        errorMessage = 'You need to use HTTPS for selecting audio output ' +
        'device: ' + error;
      }
      console.error(errorMessage);
      // Jump back to first output device in the list as it's the default.
      //        audioOutputSelect.selectedIndex = 0;
    });
  } else {
    console.warn('Browser does not support output device selection.');
  }
}



//
// Set constraints using new syntax, not supported by Chrome as of ver 51...
//
setNewAudioConstraints = function (audioSource) {
  constraints = {
    audio: {
      deviceId: audioSource ? {exact: audioSource} : undefined,
      echoCancellation: false,
      googEchoCancellation: false
    },
    video: false  // no video
  };
  
  return (constraints);
}


//
// setSDP()
// set SDP parameters for codec, bitrate, mode for 'Voice' (conferencing) or 'Audio' (high quality)
// This should be called immediately before easyrtc.call();
//
meshStream.prototype.setSDP = function () {
  sw_utils.TRACE.enter('mesh.setSDP()');
  
  // set sdp params and getUserMedia constraints
  var audiobitrate='400'; //kbits/s
  local_sdp_filter = '';               // SDP filters passed during call() or on adding stream to set codecs, bitrates, modes
  remote_sdp_filter = '';
  
//  easyrtc.enableVideoReceive(false); /////////////TEST
  
  // RJB: see  easyrtc_rates.js: corrected logic bug and modified addStereo() to include sprop-stereo=1;
  local_sdp_filter = easyrtc.buildLocalSdpFilter({audioRecvCodec: 'opus/48000/2', audioRecvBitrate: audiobitrate, stereo: 1 });
  remote_sdp_filter = easyrtc.buildRemoteSdpFilter({audioSendCodec: 'opus/48000/2', audioSendBitrate: audiobitrate, stereo: 1 }); // ditto
  // set these when adding stream to call  easyrtc.setSdpFilters(self.local_sdp_filter, self.remote_sdp_filter);
  
  easyrtc.setSdpFilters(local_sdp_filter, remote_sdp_filter);  // Note: filters are reset in this call
  sw_utils.TRACE.leave('mesh.setSDP()');
}



//
// closeStream()
//
meshStream.prototype.closeStream = function() {
  var self = this;
  sw_utils.TRACE.enter('meshstream.closeStream()');
  console.log('meshstream: ' + easyrtc.getLocalStream(self.streamName).id);
  
  //  easyrtc.setVideoObjectSrc(document.getElementById(mesh.meshAudioInId), "");  //MESH
  easyrtc.clearMediaStream( self.localAudio );
  easyrtc.clearMediaStream( self.remoteAudio );
  easyrtc.closeLocalMediaStream(self.streamName);
  sw_utils.TRACE.leave('meshstream.closeStream()');
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

