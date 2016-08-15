// Utility to list all devices to console
export function dumpDevInfos() {
  navigator.mediaDevices.enumerateDevices()
    .then(function(devinfos) {
      console.log("------- DEVICES --------");
      for(var i=0; i<devinfos.length; i++){
        var di = devinfos[i];
        console.log(di.kind + ', ' + di.label + ', ' + di.deviceId);
      }
      console.log("------- ------- --------");

    });
}
