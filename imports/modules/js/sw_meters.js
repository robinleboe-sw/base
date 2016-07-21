/*
 *  sw_meters.js
 *  Rick Beaton
 *  June 2016
 * 
 *  Meters Interfaces. construct and control functions for meters, wrapper for vumetr.
 * 
 *  NOTES:
 * VU
 * Possible modes for VU:
 * - Click to toggle between VU and video
 * - shows VU any time video is not showing. VU shows powered on when connected, power off when not connected.
 *
 *  TODO:
Re-do VU meters to call callback from getAnimationFrame which supplies current values for meter. Start and stop getAnimationFrame when VU meters visible/not visible. Render only moving parts in realtime (overlapping transparent canvases).
 *
 */

// initMeters()
// invoked in onload()
//
function initMeters() {
  
  $('#divLocalVU').vumetr();
  $('#divLocalVU').vumetr('lightMode','night');
  $('#divLocalVU').vumetr('power', false);
  $("#divLocalVU").hide();

  $("#divLocalVid").click(function(){
//    if ( !havelocalVideo() || ($("#localVideo").is(":visible") == true ) ) {
    if ( ($("#localVideo").is(":visible") == true ) ) {
      $("#localVideo").hide();
      // power on only if connected
      if( document.getElementById('connectButton').disabled ) {
        $('#divLocalVU').vumetr('power', true);
      }
      $("#divLocalVU").show();
    }
    else if (easyrtc.getLocalStream(avatar.streamName)) { //if (document.getElementById('localVideo').src) {
      // nothing works! if (isDisabled("connectButton")) { // { //if ( havelocalVideo() ) {  //else { //
      var test = document.getElementById('localVideo'); /////DEBUG
      $("#divLocalVU").hide();
      $('#divLocalVU').vumetr('power', false);
      $("#localVideo").show();
    }
  });
  
  $('#divRemoteVU').vumetr();
  $('#divRemoteVU').vumetr('lightMode','night');
  $('#divRemoteVU').vumetr('power', false);
  $("#divRemoteVU").hide();
  
  $("#divRemoteVid").click(function(){
    if ($("#divRemoteVU").is(":visible") == false) {
      $("#remoteVideo").hide();
      setMeterOnOff('divRemoteVU');
      $("#divRemoteVU").show();
    }
    else { // FIXME remoteVideo .srcObject undefined//  else if( localLoggedIn()  ) {  //
      if( document.getElementById('hangupButton').disabled == false) {  // only show video if connected
        $('#divRemoteVU').vumetr('power', false);
        $("#divRemoteVU").hide();
        $("#remoteVideo").show();
      }
    }
  });
 
  // Show meters by default
  showLocalMeter();
  showRemoteMeter();
   /***/
}


//
//
function havelocalVideo() {
  var vid = document.getElementById('localVideo').src; 
  console.log('VIDEO ' + elmt + ': ' + vid)
  return(!!vid);
}

function haveRemoteVideo() {
  var vid = document.getElementById('remoteVideo').src;
  console.log('VIDEO ' + elmt + ': ' + vid)
  return(!!vid);
}

function localLoggedIn() {
  return( !!(document.getElementById('connectButton').disabled == "disabled") );
}


//
//
function showRemoteMeter() {
  // show meter off if not connected to other user, on if connected
  if( document.getElementById('hangupButton').disabled == false) {
    $("#divRemoteVU").vumetr('power', true);
  } else {
    $("#divRemoteVU").vumetr('power', false);
  }
  
  $("#remoteVideo").hide();
  $("#divRemoteVU").show();
}


//
//
function showLocalMeter() {
  // show meter off if not logged in, on if logged in
  if( document.getElementById('connectButton').disabled == true) {
    $("#divLocalVU").vumetr('power', true);
  } else {
    $("#divLocalVU").vumetr('power', false);
  }
  $("#localVideo").hide();
  $("#divLocalVU").show();
}


// setMeterOnOff()
// set meter power on if we're connected to another user, off otherwise
//
function setMeterOnOff(divID) {
  // show meter off if not connected, on if connected
  if( document.getElementById('hangupButton').disabled == false) {
    $('#' + divID).vumetr('power', true);
  } else {
    $('#' + divID).vumetr('power', false);
  }
}


// See easyrtc.js, search for "this.chromeStatsFilter" for Google and Firefox formats for statsfilter
// also http://www.testuser.com/talk/app/webrtc/statscollector.cc
var chromeAudioStatsFilt = [
  {
  "audioInputLevel": "audioInputLevel"
  },
  {
  "audioOutputLevel": "audioOutputLevel"
  }
  ];


// statsCallback()
// TODO: optimize a bit by eliminating jQuery and DOM references
//



var monitor_stream = 0;
/**
 * Selects which stream to monitor on meters.
 */
function swSelStreamMonitor() {
  if (monitor_stream === 0) {
    document.getElementById('selectStreamMonitorButton').firstChild.data = 'Meter 1';
    monitor_stream = 1;
  } else {
    document.getElementById('selectStreamMonitorButton').firstChild.data = 'Meter 0';
    monitor_stream = 0;
  }
    
}
function statsCallback(id, stats) {
  //  console.log(stats);
//    var inLevel = stats.audioInputLevel/32768;
//    var outLevel = stats.audioOutputLevel/32768;

  // stats returns array if multiple streams in the call. We have (optionally) two: MESH and AVATAR stream.
  // At the moment, streams are sometimes reversed in callee w.r.t. caller, e.g.:
  // Caller: mesh IN on ch 0, mesh OUT on ch 1. avatar IN on ch 1, avatar OUT on ch 0
  // Callee: mesh IN on ch 1, mesh OUT on ch 0. avatar IN on ch 0, avatar OUT on ch 1
  // You can find out the order by calling easyrtc.getLocalMediaIds(), which will return either [meshStream,avatarStream] or [avatarStream,meshStream]

  var inLevel;
  var outLevel;
  var inTmp = stats.audioInputLevel;
  var outTmp = stats.audioOutputLevel;
  
  if(Array.isArray(inTmp)) {
    inLevel = inTmp[monitor_stream];
    outLevel = outTmp[monitor_stream];
  }
  else {
    inLevel = inTmp;
    outLevel = outTmp;
  }
 // console.log("IN: " + inTmp + " OUT: " + outTmp);
  
  /////
  
  if( document.getElementById('hangupButton').disabled == false) {  // if call is active
    $('#divLocalVU').vumetr('input', inLevel/32768);
    $('#divRemoteVU').vumetr('input', outLevel/32768);
  } else {
    $('#divLocalVU').vumetr('input', 0);  // output zeros instead of frozen meter
    $('#divRemoteVU').vumetr('input', 0);
  }
}


// Testing function, invoke from button to show stats
function swGetStats() {
  // stats only come in from remote end via RTP
  easyrtc.getChromePeerStatistics(remoteEasyrtcid, statsCallback, chromeAudioStatsFilt);
  // NOTE: Easyrtc 1.0.17 changed to: easyrtc.getPeerStatistics. 'experimental' 
  //easyrtc.getChromePeerStatistics(localEasyrtcid, statsCallback);
}


// Kludgy way to get levels to meters:
// TODO: Integrate and simplify meter level calculations, get rid of Web Audio audioAnalyser stuff (way overkill for just driving a meter!
var t_VU;
var VU_timer_is_on = 0;

function start_VU_Update() {
  if (!VU_timer_is_on) {
    VU_timer_is_on = 1;
    timed_VU_Update();
  }
}

function stop_VU_Update() {
  VU_timer_is_on = 0;
  clearTimeout(t_VU);
}

function timed_VU_Update() {
  easyrtc.getChromePeerStatistics(remoteEasyrtcid, statsCallback, chromeAudioStatsFilt);
  // Easyrtc 1.0.17 changed to: easyrtc.getPeerStatistics. 'experimental' :(

  // update frequency in ms.
  if (VU_timer_is_on) {
    t_VU = setTimeout(function(){ timed_VU_Update() }, 50);
  }
}
