/*
 *  sw_talkBack.js
 *  Rick Beaton
 *  July 2016
 *
 *  Talkback/Mute button control
 *
 *  NOTES:
 *
 *  TODO:
 *  1. Change of color should be handled in a function which adds/removes the class 'talking' to the remote and local names.
 *  The class 'talking' just styles the color.
 *  2. Check if other end is talking before activating mic in talkback mode. (check class of remote name)
 */


/**
 *
 *     talkBack.init('talkback');  ////#########
 */
var sw_talkBack = function() {

  self = this;

  /**
   * set mode: talkback or mute, modify button text
   * called from sw_settings
   */
  this.init = function(mode) {
    sw_utils.TRACE.enter('talkBack.init()');
    self = this;

    var tb_btn = document.getElementById('talkButton');
    tb_btn.onmousedown = self.buttonDown;
    tb_btn.onmouseup = self.buttonUp;

    switch(mode) {
      case 'talkback' :
        self.tbMode = true;
        self.isMuted = true;  // channel closed unless talkback button pushed
        tb_btn.firstChild.data = 'Talkback';
        break;
      case 'mute' :
        self.tbMode = false;
        self.isMuted = false;  // channel open unless mute button pushed
        tb_btn.firstChild.data = 'Mute';
        break;
      default :
        console.log('sw_talkBack.init() - Invalid mode: ' + mode);
        break;
    }

    self.buttonUp(); // activate the button with initial settings

    sw_utils.TRACE.leave('talkBack.init()');
  }


  /**
   *
   */
  this.buttonDown = function() {
    sw_utils.TRACE.enter('talkBack.buttonDown()');

    var tb_btn = document.getElementById('talkButton');

    var avStream = easyrtc.getLocalStream(avatar.streamName);
    if(!avStream) {
      console.log('sw_talkBack.buttonDown(): could not get avatar stream');
      sw_utils.TRACE.leave('talkBack.buttonDown()');
      return;
    }

    var voicetrack = avStream.getAudioTracks()[0];
    if (!voicetrack) {
      console.log('sw_talkBack.buttonDown(): no audio track');
      sw_utils.TRACE.leave('talkBack.buttonDown()');
      return;
    }

    if (talkBack.tbMode) { // Talkback mode
      talkBack.isMuted = false;
      document.getElementById('localUserName').style.color = 'green';
      swData.sendRemoteUserStatus(remoteEasyrtcid, 'green'); // indicate talkback status at other end
    } else { // Mute mode Mute button is sticky: toggle mode and button appearance
      if(talkBack.isMuted) {
        talkBack.isMuted = false;
        tb_btn.className = '';
        updateUserTalkbackStatus(remoteEasyrtcid, '#555');
      } else {
        talkBack.isMuted = true;
        tb_btn.className = 'muteOn';    // change button appearance
        updateUserTalkbackStatus(remoteEasyrtcid, 'red');
      }
    }

    voicetrack.muted = talkBack.isMuted;
    voicetrack.enabled = !(talkBack.isMuted);

    sw_utils.TRACE.leave('talkBack.buttonDown()');
  }


  /**
   * @private
   * Set talkback status by changing local and remote user name color to txtcolor
   */
  function updateUserTalkbackStatus(otherEasyrtcid, txtcolor) {
    document.getElementById('localUserName').style.color = txtcolor;
    if (easyrtc.getConnectStatus(otherEasyrtcid) === easyrtc.IS_CONNECTED) {
      swData.sendRemoteUserStatus(otherEasyrtcid, txtcolor);
    }
  }


  /**
   *
   */
  this.buttonUp = function() {
    sw_utils.TRACE.enter('talkBack.buttonUp()');

    var tb_btn = document.getElementById('talkButton');

    var avStream = easyrtc.getLocalStream(avatar.streamName);
    if(!avStream) {
      console.log('sw_talkBack.buttonUp(): could not get avatar stream');
      sw_utils.TRACE.leave('talkBack.buttonUp()');
      return;
    }

    var voicetrack = avStream.getAudioTracks()[0];
    if (!voicetrack) {
      console.log('sw_talkBack.buttonUp(): no audio track');
      sw_utils.TRACE.leave('talkBack.buttonUp()');
      return;
    }

    if (talkBack.tbMode) { // Talkback mode
      talkBack.isMuted = true;
      voicetrack.muted = talkBack.isMuted;
      voicetrack.enabled = !(talkBack.isMuted);
      updateUserTalkbackStatus(remoteEasyrtcid, '#555');
    } else { // Mute mode
      // nothing to do: un-mute on next button down
      if (talkBack.isMuted)
        tb_btn.className = 'muteOnUp';    // change button appearance
      else
        tb_btn.className = '';
    }

    sw_utils.TRACE.leave('talkBack.buttonUp()');
  }

}

window.talkBack = new sw_talkBack();
