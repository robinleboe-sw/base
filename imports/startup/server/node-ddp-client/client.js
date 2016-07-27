import DDPClient from 'ddp';

  var ddpclient = new DDPClient({
    // All properties optional, defaults shown
    host: "localhost",
    port: 3000
  });

  ddpclient.on('message', function(msg) {
    console.log('[DDP Message: ]', msg);
  })

  ddpclient.connect(function() {
    ddpclient.subscribe('mesh', [], function() {
      console.log('[Subscription complete]');
    })
  })


  setTimeout(function () {
    /*
     * Call a Meteor Method
     */

    ddpclient.call("login", [
      { user : { email : "robin@sessionwire.com" }, password : "qweasd" }
    ], function (err, result) {
      console.log("[success: ]",result.id);
      let userId = result.id;

      ddpclient.call(
        'mesh.insertConnection',             // name of Meteor Method being called
        [{
          userId: userId,
          connectionIP: "192.168.30",
          connectionPort: "9001"
        }],            // parameters to send to Meteor Method
        function (err, result) {   // callback which returns the method call results
          console.log("[result insert: ]",result);

          ddpclient.call(
            'mesh.updateConnection',             // name of Meteor Method being called
            [{
              connectionIP: "192.168.32",
              connectionPort: "9003"
            }],            // parameters to send to Meteor Method
            function (err, result) {   // callback which returns the method call results
              console.log("[result insert: ]",result);
            }
          );

        }
      );
    });


  }, 3000);
