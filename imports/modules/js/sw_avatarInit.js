/*
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
window.onload = function() {
  
  // Set socket signalling server
//  var signalingOptions = {}; //{'connect timeout': 10000, 'force new connection': true };
//  easyrtc.setSocketUrl("https://studio.sessionwire.com:8888", signalingOptions);
//  easyrtc.setSocketUrl("https://studio.sessionwire.com:8080");
//  easyrtc.setSocketUrl("https://159.203.210.61:8080");

  
  swLoadSettings();
  audioVideoInit();
  initMeters();
  
  // display username from settings instead of rtcids
  var _localUserName = document.getElementById('userName').value;
  easyrtc.setUsername(_localUserName);
  document.getElementById('localUserName').innerHTML = _localUserName;

  avatar.init();

  mesh = null;   // Stub out the mesh module by setting mesh object null
  if (mesh) { mesh.init(); } //MESH
}

