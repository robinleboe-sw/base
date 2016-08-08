/*
 *  sw_datachannel.js
 *  Rick Beaton
 *  July 2016
 *
 *  Datachannel module
 *
 *  NOTES:
 *
 *  TODO:
 *
 */

var channelIsActive = {}; // tracks which channels are active

var swDataChannel = function () {

  /**
   *
   */
  this.init = function() {
    self = this;

    easyrtc.setDataChannelOpenListener(self.openListener);
    easyrtc.setDataChannelCloseListener(self.closeListener);
//    easyrtc.setPeerListener(self.addToConversation);
    easyrtc.setPeerListener(self.setRemoteUserStatus, 'setUserStatus');

  }

  this.openListener = function(otherParty) {
    channelIsActive[otherParty] = true;
  }

  this.closeListener = function(otherParty) {
    channelIsActive[otherParty] = false;
  }

  /**
   * add message to the conversation window
   */
  this.addToConversation = function(who, msgType, content) {
    var othername;

    // Escape html special characters, then add linefeeds.
    content = content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    content = content.replace(/\n/g, "<br />");

    if (msgType == 'localmsg') {
      othername = 'Me';
    } else {
      othername = easyrtc.idToName(who);
    }
    document.getElementById("conversation").innerHTML +=
      "<b>" + othername + ":</b>&nbsp;" + content + "<br />";
  }

  //
  this.sendStuffP2P = function(otherEasyrtcid) {
    self = this;

    var text = document.getElementById("sendMessageText").value;
    if (text.replace(/\s/g, "").length === 0) { // Don"t send just whitespace
      return;
    }
    if (easyrtc.getConnectStatus(otherEasyrtcid) === easyrtc.IS_CONNECTED) {
      easyrtc.sendDataP2P(otherEasyrtcid, "textMsg", text);
    }
    else {
      console.log("NOT-CONNECTED", "not connected to " + easyrtc.idToName(otherEasyrtcid) + " yet.");
    }

    self.addToConversation("Me", "localmsg", text);
    document.getElementById("sendMessageText").value = "";
  }


  /*
   * indicate talkback activity/status of other user by changing colour of the user name
   */
  this.setRemoteUserStatus  = function(who, msgType, text) {
    document.getElementById('remoteUserName').style.color = text;
  }

  /*
   * send our talkback activity/status to the other user,
   * @param otherEasyrtcid - id of the other user
   * @param text - a color for CSS styling
   */
  this.sendRemoteUserStatus = function(otherEasyrtcid, text) {
    self = this;

    if (easyrtc.getConnectStatus(otherEasyrtcid) === easyrtc.IS_CONNECTED) {
      easyrtc.sendDataP2P(otherEasyrtcid, 'setUserStatus', text);
    }
    else {
      console.log("NOT-CONNECTED", "not connected to " + easyrtc.idToName(otherEasyrtcid) + " yet.");
    }
  }

}

window.swData = new swDataChannel();
