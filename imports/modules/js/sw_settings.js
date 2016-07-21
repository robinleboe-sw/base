/*
 * sw_Settings.js
 * RJB
 * Manage settings window, saving/restoring to/from local storage
 *
 */

// if makevisible is anything other than true or false, visibility is toggled
function showDiv(divID, makevisible) {
  var elmt = document.getElementById(divID);
  //console.log("showDiv: " + divID + ", " + makevisible);
  if( makevisible === true ) {
    elmt.style.display = "inline";
  } else if( makevisible === false ){
    elmt.style.display = "none";
  } else {  // Toggle visibility (ignore parameter)
    if( elmt.style.display === "inline") {
      elmt.style.display = "none";
    }
    else {
      elmt.style.display = "inline";
    }
  }
}


// Save settings to local storage
function swSaveSettings() {
  var fav, favs = [];
  
  // Do all checkboxes
  $('.cb_settings').each(function() {
    fav = {id: $(this).attr('id'), prop: 'checked', value: $(this).prop('checked')};
    favs.push(fav);
  });
  
  // Do all select elements
  $('.sel_settings').each(function() {
    fav = {id: $(this).attr('id'), prop: 'value', value:  $(this).prop('value')};
    favs.push(fav);
  });
  
  // Do all txt_settings
  $('.txt_settings').each(function() {
    fav = {id: $(this).attr('id'), prop: 'value', value:  $(this).prop('value')};
    favs.push(fav);
  });
  
  localStorage.setItem( 'avatarSettings', JSON.stringify(favs) );

  // Set globals from settings
  enableLocalAudio( !document.getElementById('pushToTalk').checked );   //// Enable audio based on push-to-talk in settings//
}


// load settings from local storage
function swLoadSettings() {
  
  if('avatarSettings' in localStorage){
    var favs = JSON.parse(localStorage.getItem('avatarSettings'));
    for (var i=0; i<favs.length; i++) {
      $('#' + favs[i].id ).prop(favs[i].prop, favs[i].value);
    }

    // Set globals from settings
    enableLocalAudio( !document.getElementById('pushToTalk').checked );   //// Enable audio based on push-to-talk in settings//
    
  } else {
    console.log("Settings not in localstorage")
  }

}


/*
 * RefreshSettings()
 * load settings and show window or store settings and hide window
 */
    
function refreshSettings(divID, makevisible) {
  
  if( makevisible === false ) {
    swSaveSettings();
  } else {
    swLoadSettings();
  }
  
  showDiv(divID, makevisible);

}
    
    
