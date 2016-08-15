export function avatarLogin() {
  sw_utils.TRACE.orange('sw_LogIn(): Logging In..');

  easyrtc.enableAudio(true);
  easyrtc.enableVideo(true);
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
  // disable("connectButton");
  // enable("disconnectButton");
  // enable('otherClients');
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


export function avatarLogout() {
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
