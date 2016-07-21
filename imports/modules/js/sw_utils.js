/*
 *  sw_utils.js
 *  Rick Beaton
 *  July 2016
 *
 *  Misc. general utility functions
 *
 *  NOTES:
 *
 *  TODO:
 *
 */

/**
 * TRACE functions
 
 * Usage:
 sw_utils.TRACE('This should be red', 'red');
 sw_utils.TRACE('This should be black');
 sw_utils.TRACE.green('This should be green');
 sw_utils.TRACE.blue('This should be blue');
 sw_utils.TRACE.orange('This should be orange');
 
 sw_utils.TRACE.enter('fubar()');
 sw_utils.TRACE('This should be red again', 'red');
 sw_utils.TRACE.leave('fubar()');
 
 
*/
var sw_utils = function() {
  
  this.TRACE = function(msg, txtcolor) {
    if(txtcolor) {
      console.log('%c' + msg, 'color:' + txtcolor);
      return;
    } else {
      console.log(msg);
      return;
    }
  }
  
  this.TRACE.green = function(msg) {
    console.log('%c' + msg, 'color: green');
  }
  this.TRACE.blue = function(msg) {
    console.log('%c' + msg, 'color: blue');
  }
  this.TRACE.orange = function (msg) {
    console.log('%c' + msg, 'color: orange');
  }
  
  this.TRACE.enter = function (msg) {
//    console.log('Entering: ' + msg + '...');
    console.group('Entering: ' + msg + '...');
  }
  
  this.TRACE.leave = function (msg) {
    console.log('...Leaving: ' + msg);
    console.groupEnd();
  }
  
  // convert object to array
  // e.g.
  //   var ra = sw_utils.obj2Array(easyrtc.getLocalMediaIds());
  //   console.log('LOCAL MEDIA IDS (SORTED):' + ra.sort() );
  this.obj2Array = function (obj) {
    var arr = Object.keys(obj).map(function (key) {return obj[key]});
    return(arr);
  }
  
}


window.sw_utils = new sw_utils();

