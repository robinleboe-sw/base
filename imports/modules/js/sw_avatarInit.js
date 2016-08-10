/**
 *  sw_avatarInit.js
 *  Rick Beaton
 *  April 2016
 *
 *  Initialization for HTML GUI. Constructs HTML, initializes all other modules.
 *
 *  NOTES:
 *
 *  TODO:
 *
 */

// Globals
//var avatar = '';
//var mesh = '';

// Invoked after everything loaded
import { swLoadSettings } from '/imports/modules/js/sw_settings'
import '/imports/modules/js/sw_audio_video'
import { initMeters } from '/imports/modules/js/sw_meters'
import { Meteor } from 'meteor/meteor';

window.onload = function() {

  // Set socket signalling server
//  var signalingOptions = {}; //{'connect timeout': 10000, 'force new connection': true };
//  easyrtc.setSocketUrl("https://studio.sessionwire.com:8888", signalingOptions);
//  easyrtc.setSocketUrl("https://studio.sessionwire.com:8080");
//  easyrtc.setSocketUrl("https://159.203.210.61:8080");
  function audioVideoInit() {
    // enable("connectButton");
    // disable("disconnectButton");
  }
  console.log("avatar is: ",avatar)
  // swLoadSettings();
  // audioVideoInit();
  // initMeters();

  const user = Meteor.user();
  console.log("user: ",user)

  const name = user && user.profile ? user.profile.name : '';
  return user ? `${name.first} ${name.last}` : '';

  // display username from settings instead of rtcids
  var _localUserName = user;
  easyrtc.setUsername(_localUserName);
  document.getElementById('localUserName').innerHTML = _localUserName;

  console.log("avatar is: ",avatar)

  avatar.init();

  mesh = null;   // Stub out the mesh module by setting mesh object null
  if (mesh) { mesh.init(); } //MESH
}

