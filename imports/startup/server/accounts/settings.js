/**
 * Checks for existing settings item and if none exists creates one with default settings
 */

import { Accounts } from 'meteor/accounts-base';
import { Settings } from '../../../api/users/settings';

Accounts.onLogin(function() {
  // grab id of authenticated user
  const userId = Meteor.user()._id;
  // retrieve an item in the collection if it belongs to the user
  const userSettingsExists = Settings.find({userId});

  // if no item is found in collection create one with the default settings
  if (!userSettingsExists.count()) {
    Settings.insert(
      {
        sendAudioChecked: false,
        sendVideoChecked: false,
        receiveAudioChecked: false,
        receiveVideoChecked: false,
        freshIceChecked: false,
        pushToTalkChecked: false,
        selectedTalkbackSource: 0,
        selectedTalkbackDestination: 0,
        selectedVideoSource: 0,
        selectedAudioMode: 0,
        userId: userId
      },
      function(error, result) {
        if (error) {
          console.log("Error creating default settings: ",error);
        } else {
          console.log('Default settings created.', result);
        }
      }
    )
  }
})
