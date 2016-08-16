/**
 * Error functions for Avatar WebRTC
 */

export function handle_iMS_Error() {
  console.log('easyrtc.initMediaSource Error:' + errorCode + ',' + errorText);
}

export function handle_gUM_Error(error) {
  console.log('getUserMedia() error: ', error);
}

export function handle_eD_Error(error) {
  console.log('enumerateDevices() error: ', error);
}
