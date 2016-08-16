/**
 * Attach sinkId to HTML Media Element
 * @param element
 * @param sinkId
 */

export function attachSinkId(element, sinkId) {
  if (typeof element.sinkId !== 'undefined') {
    element.setSinkId(sinkId)
      .then(function() {
        console.log('Success, audio output device attached: ' + sinkId);
        // console.log('getSinkId: '+element.sinkId)
      })
      .catch(function(error) {
        var errorMessage = error;
        if (error.name === 'SecurityError') {
          errorMessage = 'You need to use HTTPS for selecting audio output ' +
            'device: ' + error;
        }
        console.error(errorMessage);
        // Jump back to first output device in the list as it's the default.
        // audioOutputSelect.selectedIndex = 0; TODO: update collection to default value
      });
  } else {
    console.warn('Browser does not support output device selection.');
  }
}
