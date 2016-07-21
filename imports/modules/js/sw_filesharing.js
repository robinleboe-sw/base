//
// sw_filesharing.js
//


function buildDragNDropName(easyrtcid) {
  return 'divfileDropZone';
  //  return "dragndrop_" + easyrtcid;
}

function buildReceiveAreaName(easyrtcid) {
  return 'divfileDropZone';
  //  return "receivearea_" + easyrtcid;
}


//
// hideDropArea()
// hide the drop area, after a delay if specified
// returns the dropArea element
// TODO: make consistent: process the send and receive status blocks the same
//
function hideDropArea(delay_in_ms) {
  var dropArea = document.getElementById(buildReceiveAreaName('divfileDropZone'));
  var statusDiv = document.getElementById('fileSendStatus');
  var receiveBlock = document.getElementById('fileReceiveStatus');
  
  if(delay_in_ms && delay_in_ms > 0) {
    setTimeout(function() {
      if (statusDiv) statusDiv.innerHTML = "";
      if (receiveBlock) receiveBlock.style.display = "none";
      if (dropArea) dropArea.style.display = "none";  // hide file drop window
    }, delay_in_ms);
  }
  else {
    if (statusDiv) statusDiv.innerHTML = "";
    if (receiveBlock) receiveBlock.style.display = "none";
    if (dropArea) dropArea.style.display = "none";  // hide file drop window
  }
  return dropArea;
}


//
// showDropArea()
// show the drop are, returning the element
//
function showDropArea() {
  dropArea = document.getElementById(buildReceiveAreaName('divfileDropZone'));
  dropArea.style.display = "inline-block";  // show file drop window
  return dropArea;
}

///////////////////////////
// File Send
///////////////////////////
function sw_filesharing_connect(easyrtcid) {
  
  // Set up listener functions
  easyrtc.setDataChannelOpenListener(function(easyrtcid, usesPeer) {
    var obj = document.getElementById(buildDragNDropName(easyrtcid));
    if (!obj) {
      console.log("sw_filesharing_connect: dropArea no such object ");
    }
    jQuery(obj).addClass("connected");
    jQuery(obj).removeClass("notConnected");
  });
  
  easyrtc.setDataChannelCloseListener(function(easyrtcid) {
    jQuery(buildDragNDropName(easyrtcid)).addClass("notConnected");
    jQuery(buildDragNDropName(easyrtcid)).removeClass("connected");
  });
  
  
  var dropArea = document.getElementById(buildDragNDropName(easyrtcid));
  var statusDiv = document.getElementById('fileSendStatus');
  
  //
  // show status while sending files
  function updateStatusDiv(state) {
    var statusDiv = document.getElementById('fileSendStatus');
    //    var statusDiv = document.getElementById(buildDragNDropName(easyrtcid));  ////TODO: create status div as child of dragndrop
    switch (state.status) {
      case "waiting":
        statusDiv.innerHTML = "waiting for other party<br\>to accept transmission";
        break;
      case "started_file":
        statusDiv.innerHTML = "started file: " + state.name;
      case "working":
        var filezTxt = state.numFiles == 1 ? " file)" : " files)";
        statusDiv.innerHTML = state.name + ": " + state.position + "/" + state.size + " bytes (" + state.numFiles + filezTxt;
        break;
      case "rejected":
        statusDiv.innerHTML = "cancelled";
        hideDropArea(2000);
        break;
      case "done":
        statusDiv.innerHTML = "done";
        hideDropArea(3000);
        break;
    }
    return true;
  }
  
  
  var fileSender = null;
  function filesHandler(files) {
    
    var statusDiv = document.getElementById('fileSendStatus');
    
    // if we haven't eastablished a connection to the other party yet, inform user they need to connect to someone
    // Otherwise send the files now.
    if (easyrtc.getConnectStatus(remoteEasyrtcid) === easyrtc.NOT_CONNECTED) {
      //      easyrtc.showError("user-error", "You must be connected to another user to send files. ");
      statusDiv.innerHTML = "You must be connected to another user to send files.";
      console.log("Tried to send files without connection: remote id=" + remoteEasyrtcid);
      hideDropArea(3000); ///////
    }
    else if (easyrtc.getConnectStatus(remoteEasyrtcid) === easyrtc.IS_CONNECTED ) {
      if (!fileSender) {
        fileSender = easyrtc_ft.buildFileSender(remoteEasyrtcid, updateStatusDiv);
      }
      fileSender(files, true /* assume binary */);
    }
    else {
      //     easyrtc.showError("user-error", "Wait for the connection to complete before sending files!");
      statusDiv.innerHTML = "Please wait for the connection to complete before sending files!";
      hideDropArea(3000); ///////
    }
  }
  
  //  var dropArea = document.getElementById(buildDragNDropName(easyrtcid));
  //  easyrtc_ft.buildDragNDropRegion(dropArea, filesHandler);
  easyrtc_ft.buildDragNDropRegion(document, filesHandler);  // accept dropped files anywhere
  
}



////////////////////////////
// File receive
////////////////////////////

// acceptRejectCB()
// Callback to accept/reject files sent by other user
//
function acceptRejectCB(otherGuy, fileNameList, wasAccepted) {
  
  dropAreaHeadingDiv = document.getElementById('fileDropAreaHeading');
  var filezTxt = fileNameList.length == 1 ? " a file!" : " files";
  dropAreaHeadingDiv.innerHTML = '<h2 style="margin-top:100px;">' + easyrtc.idToName(otherGuy) + ' sent you' + filezTxt + ' </h2>';
  
  dropArea = document.getElementById(buildReceiveAreaName(otherGuy));
  dropArea.style.display = "inline-block";  // show file drop window
  var receiveBlock = document.getElementById('fileReceiveStatus');
  receiveBlock.innerHTML = ''; //jQuery(receiveBlock).empty();  //receiveBlock.innerHTML = ''; //
  receiveBlock.style.display = "inline-block";  // show status window
  
  //
  // list the files being offered
  //
  receiveBlock.appendChild(document.createTextNode("Files offered"));
  receiveBlock.appendChild(document.createElement("br"));
  for (var i = 0; i < fileNameList.length; i++) {
    receiveBlock.appendChild(
      document.createTextNode("  " + fileNameList[i].name + " (" + fileNameList[i].size + " bytes)"));
    receiveBlock.appendChild(document.createElement("br"));
  }
  
  //
  // create the accept/reject buttons
  //
  var button = document.createElement("button");
  button.appendChild(document.createTextNode("Accept"));
  button.onclick = function() {
    jQuery(receiveBlock).empty();
    wasAccepted(true);
  };
  receiveBlock.appendChild(button);
  
  button = document.createElement("button");
  button.appendChild(document.createTextNode("Reject"));
  button.onclick = function() {
    wasAccepted(false);
    receiveBlock.style.display = "none";
    dropArea.style.display = "none";  // hide file drop window
  };
  receiveBlock.appendChild(button);
}


// receiveStatusCB()
// Callback to update status of files being received from other user
//
function receiveStatusCB(otherGuy, msg) {
  var receiveBlock = document.getElementById('fileReceiveStatus');
  var dropArea = document.getElementById(buildReceiveAreaName(otherGuy));
  
  if( !receiveBlock) return;
  
  switch (msg.status) {
    case "started":
      break;
    case "eof":
      receiveBlock.innerHTML = "Finished file";
      hideDropArea(1000);
      break;
    case "done":
      receiveBlock.innerHTML = "Done: " +msg.reason;
      hideDropArea(1000);
      break;
    case "started_file":
      receiveBlock.innerHTML = "Beginning receive of " + msg.name;
      break;
    case "progress":
      receiveBlock.innerHTML = msg.name + " " + msg.received + "/" + msg.size + " bytes";
      break;
    default:
      console.log("strange file receive cb message = ", JSON.stringify(msg));
  }
  return true;
}

// blobAcceptor()
// Provide 'Save-as' dialog box to save received files
//
function blobAcceptor(otherGuy, blob, filename) {
  easyrtc_ft.saveAs(blob, filename);
}


// sw_filesharing_init()
// Initialize module, set up status message areas
// Call this in sw_audio_video.js loginSuccess()
//
function sw_filesharing_init(easyrtcid) {
  
  var dropArea = document.getElementById(buildDragNDropName(easyrtcid));  //
  
  // Create heading message area
  removeIfPresent(dropArea, 'fileDropAreaHeading');
  var dropAreaHeadingDiv = document.createElement("div");
  dropAreaHeadingDiv.className = "fileDropAreaHeading";
  dropAreaHeadingDiv.id = 'fileDropAreaHeading';
  dropArea.appendChild(dropAreaHeadingDiv);
  
  
  // Create status message areas within file dragndrop area
  removeIfPresent(dropArea, 'fileReceiveStatus');
  removeIfPresent(dropArea, 'fileSendStatus');
  
  var recvStatusDiv = document.createElement("div");
  recvStatusDiv.className = "dragndropStatus";
  recvStatusDiv.id = 'fileReceiveStatus';
  var sendStatusDiv = document.createElement("div");
  sendStatusDiv.className = "dragndropStatus";
  sendStatusDiv.id = 'fileSendStatus';
  
  dropArea.appendChild(recvStatusDiv);
  dropArea.appendChild(sendStatusDiv);
  
  initFileDropZone(dropAreaHeadingDiv);
  
  // set up file receive functions
  easyrtc_ft.buildFileReceiver(acceptRejectCB, blobAcceptor, receiveStatusCB);
}



//
// initFileDropZone()
//
var _fileDropzoneAlreadyVisible = false;  // flag so we don't hide element that was already visible when we entered it

function initFileDropZone(dropAreaHeadingDiv) {
  
  elmt = document.getElementById('divfileDropZone');
  //  dragTarget = document.getElementById('mainContainer');
  dragTarget = document;
  
  dragTarget.addEventListener("dragenter", function(){
    if(elmt.style.display === "none") {
      var dropAreaHeadingDiv = document.getElementById('fileDropAreaHeading');
      dropAreaHeadingDiv.innerHTML = '<h1 style="margin-top:100px;"> Drop files here </h1>';
      elmt.style.display = "inline";
    }
    else {
      _fileDropzoneAlreadyVisible = true;
    }
  });
  
  dragTarget.addEventListener("dragleave", function(){
    if(!_fileDropzoneAlreadyVisible)
      elmt.style.display = "none";
    else
      _fileDropzoneAlreadyVisible = false;
  });
  
}



//
// removeIfPresent()
//
function removeIfPresent(parent, childname) {
  var item = document.getElementById(childname);
  if (item) {
    parent.removeChild(item);
  }
  else {
    console.log("no " + childname + " to delete");
  }
}



