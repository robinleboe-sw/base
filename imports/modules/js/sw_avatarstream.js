//////////////////////////////////////////////
// avatarstream2
// Created: June 26, 2016
// Last update: July 4, 2016. RJB
// replaces sw_selectAV.js
//
//////////////////////////////////////////////

/*
 NOTES
 Because easyrtc.initMediaSource() has issues with constraints, we use getUserMedia() directly and then
 use easyrtc.register3rdPartyLocalMediaStream() to add name to stream so we can use it with easyrtc.

 TODO: Currently setting input devices by loading sw_settings from localstorage.
 Setting output device not happening on loading app: sinkId not being set until menu selectedIndex
 audioInputSelect and audioOutputSelect not being set on startup: value is 'default' at entry to createStream();

 TODO: Need to change flow: with the current design, changing audio settings will result in dropping the current stream,
 and thus dropping the call. Should modify onchange functions so they only save changes to localstorage via
 sw_save_settings(), then call sw_loadSettings() just before setting constraints. So changes to settings will not
 affect current call, and will take effect on next login.

 TODO: default input mic volume is being set to 33% by either enumeratedevices or gUM...
 ALSO: see https://bugs.chromium.org/p/chromium/issues/detail?id=525443 for googDucking flag, which should be set to false (if still supported?)
 AND: see https://jsfiddle.net/e9xtt4cs/ for how order of connection affects gUM !!! from Comment 39 on https://bugs.chromium.org/p/chromium/issues/detail?id=376796
 */
import { swSaveSettings } from '/imports/modules/js/sw_settings.js'

'use strict';

var Avatar = function() {
  var self = this;


  this.streamName = 'avatarStream';  // Name for avatar network stream
  var audioInputSelect = document.querySelector('select#audioSource');
  var audioOutputSelect = document.querySelector('select#audioOutput');
  var videoSelect = document.querySelector('select#videoSource');
  var selectors = [audioInputSelect, audioOutputSelect, videoSelect];

  this.localVideo = document.querySelector('#localVideo');
  // TODO: remoteVideo should get moved out, prepare for multi-party conference variable number of parties
  this.remoteVideo = document.querySelector('#remoteVideo');  // DOM element for remote a/v

  // SDP filters passed during call() or on adding stream to set codecs, bitrates, modes
  this.local_sdp_filter = '';
  this.remote_sdp_filter = '';


  //
  // gotDevices()
  // Called with deviceInfos returned by mediaDevices.enumerateDevices()
  //
  function gotDevices(deviceInfos) {
    console.log('Entering gotDevices()...');

    // Handles being called several times to update labels. Preserve values.
    var values = selectors.map(function(select) {
      return select.value;
    });
    selectors.forEach(function(select) {
      while (select.firstChild) {
        select.removeChild(select.firstChild);
      }
    });
    for (var i = 0; i !== deviceInfos.length; ++i) {
      var deviceInfo = deviceInfos[i];
      var option = document.createElement('option');
      option.value = deviceInfo.deviceId;
      if (deviceInfo.kind === 'audioinput') {
        option.text = deviceInfo.label ||
        'microphone ' + (audioInputSelect.length + 1);
        audioInputSelect.appendChild(option);
      } else if (deviceInfo.kind === 'audiooutput') {
        option.text = deviceInfo.label || 'speaker ' +
        (audioOutputSelect.length + 1);
        audioOutputSelect.appendChild(option);
      } else if (deviceInfo.kind === 'videoinput') {
        option.text = deviceInfo.label || 'camera ' + (videoSelect.length + 1);
        videoSelect.appendChild(option);
      } else {
        console.log('Some other kind of source/device: ', deviceInfo);
      }
    }
    selectors.forEach(function(select, selectorIndex) {
      if (Array.prototype.slice.call(select.childNodes).some(function(n) {
        return n.value === values[selectorIndex];
      })) {
        select.value = values[selectorIndex];
      }
    });
    console.log('... Leaving gotDevices()');

  }


  //
  // attachSinkId()
  // Attach audio output device to video element using device/sink ID.
  //
  function attachSinkId(element, sinkId) {
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
        audioOutputSelect.selectedIndex = 0;
      });
    } else {
      console.warn('Browser does not support output device selection.');
    }
  }


  //
  //
  //
  this.changeAudioDestination = function() {
    self = this;
    var audioDestination = audioOutputSelect.value;
    attachSinkId(self.remoteVideo, audioDestination);
  }


  //
  function gotStream(stream) {
    sw_utils.TRACE.enter('Entering avatar.gotStream()');

    // set name for stream to allow dealing with multiple streams, attach to media element
    easyrtc.register3rdPartyLocalMediaStream(stream, 'avatarStream')
    console.log("getLocalStream(avatar.streamName).id: " + easyrtc.getLocalStream(self.streamName).id); ///////DEBUG
    sw_utils.TRACE.green('Media IDs: ' + easyrtc.getLocalMediaIds() ); ///DEBUG

    sw_utils.TRACE.blue('attaching stream: ' + stream.id + '(' + stream.streamName + ') to: ' + self.localVideo.id);
    easyrtc.setVideoObjectSrc( self.localVideo, stream); ////////

    sw_utils.TRACE.leave('avatar.gotStream()');

    // Refresh list in case new devices have become available
    return navigator.mediaDevices.enumerateDevices();
  }


  //
  // createStream()
  // create the stream, connect input and output devices
  // TODO: set sdp
  //
  this.createStream = function () {
    sw_utils.TRACE.enter('avatar.createStream()');

//delete    if (window.stream) {
 //     console.log('Stopping window.stream tracks: ' + window.stream.id );
 //     window.stream.getTracks().forEach(function(track) {
 //       track.stop();
 //     });
 //   }

    var avStr = easyrtc.getLocalStream("avatarStream");
    if(avStr) {
      // no point just stopping tracks: if we're getting new stream anyway, just close the old one...
      // console.log('Stopping avatarStream tracks: ' + avStr.id );
      //     avStr.getTracks().forEach(function(track) {
      //       track.stop();
      //     });
      console.log('Closing avatarStream: ' + avStr.id);
      easyrtc.closeLocalMediaStream("avatarStream");
    }

    // ###### DEBUG: kludge.. load settings from local storage directly here.
    swLoadSettings();
    self.changeAudioDestination();
    //^^^^^

    var audioMode = document.querySelector('select#audioMode').value;
    var audioSource = audioInputSelect.value;
    var videoSource = videoSelect.value;
    var constraints = 'none';

    // set up media constraints depending on mode: high-quality 'Audio', or voice conferencing 'Voice'
    switch (audioMode) {
      case 'Audio':
        /* deprecated syntax for Chrome ver <=51 because it doesn't support current syntax yet..*/
        var constraints = {
          audio: {
            mandatory: {
              sourceId: audioSource ? audioSource : undefined,
              echoCancellation: false
            }
          },
          video: {
            mandatory: {
              sourceId: videoSource ? videoSource : undefined
            }
          }
        };
        /* new syntax (not supported in Chrome yet)
        constraints = {
          audio: {
            deviceId: audioSource ? {exact: audioSource} : undefined,
            echoCancellation: {exact: false}
          },
          video: {deviceId: videoSource ? {exact: videoSource} : undefined}
        };
 */
        break;
      case 'Voice':
/* deprecated syntax for Chrome ver <=51 */
        var constraints = {
          audio: {
            mandatory: {
              sourceId: audioSource ? audioSource : undefined ,
              echoCancellation: true
            }
          },
          video: {
            sourceId: videoSource ? videoSource : undefined
          }
        };
/* new syntax (not supported in Chrome yet)
        constraints = {
        audio: {
          deviceId: audioSource ? {exact: audioSource} : undefined,
           echoCancellation: true
        },
        video: {deviceId: videoSource ? {exact: videoSource} : undefined}
        };
*/
        break;
      default:
        var constraints = {
        audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
        video: {deviceId: videoSource ? {exact: videoSource} : undefined}
        };
        console.log("Unsupported audioModeSelect.value in sw_selectAV: " + audioMode);
        break;
    };

    console.log('Calling gUM...');
    console.log('audioSource = ' + audioSource);
    console.log('videoSource = ' + videoSource);

    /*******DEBUG*******
    constraints = {
    audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
    video: {deviceId: videoSource ? {exact: videoSource} : undefined}
    };
    ******************/

    navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(gotDevices).catch(handle_gUM_Error);
    //INITMEDIASOURCE    easyrtc._presetMediaConstraints = constraints;
    //INITMEDIASOURCE    easyrtc.initMediaSource(gotStream, handle_iMS_Error);

    sw_utils.TRACE.leave('avatar.createStream()');

  }


  //
  //
  //
  function handle_iMS_Error() {
    console.log('easyrtc.initMediaSource Error:' + errorCode + ',' + errorText);
  }


  //
  // setSDP()
  // set SDP parameters for codec, bitrate, mode for 'Voice' (conferencing) or 'Audio' (high quality)
  // This should be called immediately before easyrtc.call();
  //
  this.setSDP = function () {
    sw_utils.TRACE.enter('avatar.setSDP()');

    var audiobitrate='400'; // kbits/s
    var voicebitrate='32';  // "
    var local_sdp_filter = "";
    var remote_sdp_filter = "";

    var audioMode = document.querySelector('select#audioMode').value;
    switch (audioMode) {
      case 'Audio':
        // RJB: see  easyrtc_rates.js: corrected logic bug and modified addStereo() to include sprop-stereo=1;
        local_sdp_filter = easyrtc.buildLocalSdpFilter({audioRecvCodec: 'opus/48000/2', audioRecvBitrate: audiobitrate, stereo: 1 });
        remote_sdp_filter= easyrtc.buildRemoteSdpFilter({audioSendCodec: 'opus/48000/2', audioSendBitrate: audiobitrate, stereo: 1 }); // ditto
        break;
      case 'Voice':
        local_sdp_filter= easyrtc.buildLocalSdpFilter({audioRecvCodec: 'ISAC/16000', audioRecvBitrate: voicebitrate});
        remote_sdp_filter= easyrtc.buildRemoteSdpFilter({audioSendCodec: 'ISAC/16000', audioSendBitrate: voicebitrate});
        break;
      default:
        console.log("avatar.setSDP() Unsupported audioModeSelect.value: " + audioMode);
        break;
    }
    easyrtc.setSdpFilters(local_sdp_filter, remote_sdp_filter);  // Note: filters are reset in this call

    sw_utils.TRACE.leave('avatar.setSDP()');
  }

  //
  // init()
  // get initial devices list, set handlers for changes to device selection
  //
  this.init = function() {

    navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handle_eD_Error);
    /*
     audioInputSelect.onchange = self.createStream;
     audioOutputSelect.onchange = self.changeAudioDestination;
     videoSelect.onchange = self.createStream;
     */
    // save settings any time there is a change...
    audioInputSelect.onchange = swSaveSettings;
    audioOutputSelect.onchange = swSaveSettings;
    videoSelect.onchange = swSaveSettings;

  }


  //
  // closeStream()
  //
  this.closeStream = function() {
    sw_utils.TRACE.enter('avatar.closeStream()');
    console.log('avatar.avatarStream: ' + easyrtc.getLocalStream('avatarStream').id);

    easyrtc.clearMediaStream( self.localVideo );
    easyrtc.setVideoObjectSrc( self.localVideo, "" ); // same thing as clearMediaStream?
    easyrtc.closeLocalMediaStream('avatarStream');

    sw_utils.TRACE.leave('avatar.closeStream()');
  }

  //
  // handle_gUM_Error()
  // Error handler function for getUserMedia()
  //
  function handle_gUM_Error(error) {
    console.log('getUserMedia() error: ', error);
  }

  //
  // handle_eD_Error()
  // Error handler function for enumerateDevices()
  //
  function handle_eD_Error(error) {
    console.log('enumerateDevices() error: ', error);
  }

} // avatar()


//
window.avatar = new Avatar();

dumpDevInfos(); // DEBUG

/////////////////////////
// TESTING UTILITIES
/////////////////////////

//
// dumpDevInfos()
// Utility to list all devices to console
//
function dumpDevInfos() {
  navigator.mediaDevices.enumerateDevices()
  .then(function(devinfos) {
    console.log("------- DEVICES --------");
    for(var i=0; i<devinfos.length; i++){
      var di = devinfos[i];
      console.log(di.kind + ', ' + di.label + ', ' + di.deviceId);
    }
    console.log("------- ------- --------");

  });
}
