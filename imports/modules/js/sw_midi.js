// sw_midi.js
// RJB: WebMidi interface to control DAW transport.
//
// April 11, 2016

/***
References
https://www.w3.org/TR/webmidi/
https://en.wikipedia.org/wiki/MIDI_Machine_Control
https://www.keithmcmillen.com/blog/making-music-in-the-browser-web-midi-api/
http://peterelsea.com/Maxtuts_advanced/Max&MMC.pdf
http://tangiblejs.com/posts/web-midi-music-and-show-control-in-the-browser
http://www.blitter.com/~russtopia/MIDI/~jglatt/tech/mmc.htm

***/


var midi = null;  // global MIDIAccess object

function onMIDISuccess( midiAccess ) {
  console.log( "MIDI ready!" );
  midi = midiAccess;  // store in the global (in real usage, would probably keep in an object instance)
//  listInputsAndOutputs( midi );

  listAllInsAndOuts();
}

function onMIDIFailure(msg) {
  console.log( "Failed to get MIDI access - " + msg );
}

// request MIDI access
if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess( { sysex: true } ).then( onMIDISuccess, onMIDIFailure );
} else {
  alert("No MIDI support in your browser.");
}



//-------------
// List all MIDI inputs and outputs to the console
function listAllInsAndOuts() {

  var inputs = midi.inputs.values();
  // loop through all inputs
  for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
    var inval = input.value;
    console.log("MIDI Input port : [ type:'" + inval.type + "' id: '" + inval.id +
      "' manufacturer: '" + inval.manufacturer + "' name: '" + inval.name +
      "' version: '" + inval.version + "']");
  }

  //document.getElementById("outputportselector").innerHTML = "";

  var outputs = midi.outputs.values();
  // loop through all outputs
  for (var output = outputs.next(); output && !output.done; output = outputs.next()) {
    var outval = output.value;
    console.log("MIDI Output port : [ type:'" + outval.type + "' id: '" + outval.id +
      "' manufacturer: '" + outval.manufacturer + "' name: '" + outval.name +
      "' version: '" + outval.version + "' state: '" + outval.state + "' connection: '" + outval.connection + "']");

    var opt = document.createElement("option");
    opt.text = outval.name;
    //document.getElementById("outputportselector").add(opt);

  }

/*  for (outval of outputs) {
    var opt = document.createElement("option");
    opt.text = outval.value.name;
    document.getElementById("outputportselector").add(opt);
  }
 */

}
//--------------




var mmcStop = 0x01;
var mmcPlay = 0x02;
var mmcDeferredPlay = 0x03;  // (play after no longer busy)
var mmcFastForward  = 0x04;
var mmcRewind   = 0x05;
var mmcPunchIn  = 0x06;
var mmcPunchOut = 0x07;
var mmcRecPause = 0x08;
var mmcPause    = 0x09;
var mmcEject    = 0x0A;  // (disengage media container from MMC device)
var mmcChase    = 0x0B;  // On a machine that is able to lock to SMPTE time code, puts it into chase mode so it follows the master.
var mmcReset    = 0x0D;  // (reset to default/startup state)
var mmcRecArm   = 0x40;  // (AKA Reset Record Ready, AKA Arm Tracks) parameters: <length1> 4F <length2> <track-bitmap-bytes>
var mmcLocate   = 0x44;  // (AKA Goto) parameters: <length>=06 01 <hours> <minutes> <seconds> <frames> <subframes>
var mmcShuttle  = 0x47;  // parameters: <length>=03 <sh> <sm> <sl> (MIDI Standard Speed codes)
var mmcStep     = 0x48;  // locate by single step

// sendTransport()
// send single MIDI command messages
function sendTransport( midiAccess, portID, mmcCmd ) {
  var mmcMessage = [0xF0, 0x7F, portID, 0x06, mmcCmd, 0xF7];    // sysex msg: send mmcCmd to port
//  var output = midiAccess.outputs.get(portID);
  var output = midiAccess.outputs.values().next().value;
  output.send( mmcMessage );  //omitting the timestamp means send immediately.

}

// sendLocate
// Locate (cue) to a specific position (SMPTE hour, minute, second, frame number, and subframe number).
// Message format:  0xF0 0x7F <deviceID> 0x06 0x44 0x06 0x01 <hh> <mm> <ss> <ff> <sf> 0xF7
//
function sendLocate(midiAccess, devID, hh, mm, ss, ff, sf) {
  var mmcMessage = [0xF0, 0x7F, devID, 0x06, 0x44, 0x06, 0x01, hh, mm, ss, ff, sf, 0xF7];    // sysex msg
  var output = midiAccess.outputs.values().next().value;
  output.send( mmcMessage );  //omitting the timestamp means send immediately.
}


//
//function sendRetune(midiAccess, devID) {
//
//}




/////////////// EXTRA JUNK ///////////////



// TBD: sendRecArm
// Arm a single track.
// Message format:
// See https://en.wikipedia.org/wiki/MIDI_Machine_Control
// and http://peterelsea.com/Maxtuts_advanced/Max&MMC.pdf
// F0 7F <Device-ID> 06 40 <length1> 4F <length2> <track-bitmap> F7
//
//function sendRecArm(midiAccess, devID, tracknum) {
//  var length1, length2;
//  var mmcMessage = [0xF0, 0x7F, devID, 0x06, 0x40, ______________];    // sysex msg
//  var output = midiAccess.outputs.values().next().value;
//  output.send( mmcMessage );  //omitting the timestamp means send immediately.
//}


function sendMiddleC( midiAccess, portID ) {
  var noteOnMessage = [0x90, 60, 0x7f];    // note on, middle C, full velocity
  var output = midiAccess.outputs.get(portID);
  output.send( noteOnMessage );  //omitting the timestamp means send immediately.
  output.send( [0x80, 60, 0x40], window.performance.now() + 1000.0 ); // Inlined array creation- note off, middle C,
  // release velocity = 64, timestamp = now + 1000ms.
}

// listInputsAndOutputs
// get the list of the input and output ports and prints their information to the console log
function listInputsAndOutputs( midiAccess ) {

  var numberOfMIDIInputs = midiAccess.inputs.size;
  var numberOfMIDIOutputs = midiAccess.outputs.size;
  console.log( "# of Midi Inputs:" + numberOfMIDIInputs + " # of Midi Outputs:" + numberOfMIDIOutputs);

  //---------
  //TBD: This is from the W3C examples, which don't work.

  for (var input in midiAccess.inputs) {
    console.log( "Input port [type:'" + input.type + "'] id:'" + input.id +
      "' manufacturer:'" + input.manufacturer + "' name:'" + input.name +
      "' version:'" + input.version + "'" );
  }

  for (var output in midiAccess.outputs) {
    console.log( "Output port [type:'" + output.type + "'] id:'" + output.id +
      "' manufacturer:'" + output.manufacturer + "' name:'" + output.name +
      "' version:'" + output.version + "'" );
  }

  midiAccess.inputs.forEach( function( key, port ) {
    console.log( "Input port key: " + key + " name:" +  port.name);
  });

  //---------

}



