/**
 * Updates AVATAR Talkback settings for the current user
 */

import { Settings } from './settings';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

export const updateSettings = new ValidatedMethod({
  name: 'settings.update',
  validate: new SimpleSchema({
    _id: { type: String },
    userId: {type: String, regEx: SimpleSchema.RegEx.Id},
    'update.sendAudioChecked': { type: Boolean },
    'update.sendVideoChecked': { type: Boolean },
    'update.receiveAudioChecked': { type: Boolean },
    'update.receiveVideoChecked': { type: Boolean },
    'update.freshIceChecked': { type: Boolean },
    'update.pushToTalkChecked': { type: Boolean },
    'update.selectedTalkbackSource': { type: String },
    'update.selectedTalkbackDestination': { type: String },
    'update.selectedVideoSource': { type: String },
    'update.selectedAudioMode': { type: String }
  }).validator(),
  // pass id and update object from setting-modal updateSettings call
  run({_id, update}) {
    Settings.update(_id, { $set: update });
  }
});
