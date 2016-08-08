import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/dburles:factory';

export const Settings = new Mongo.Collection('Settings');

Settings.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Settings.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Settings.schema =  new SimpleSchema({
  sendAudioChecked: {
    type: Boolean
  },
  sendVideoChecked: {
    type: Boolean
  },
  receiveAudioChecked: {
    type: Boolean
  },
  receiveVideoChecked: {
    type: Boolean
  },
  freshIceChecked: {
    type: Boolean
  },
  pushToTalkChecked: {
    type: Boolean
  },
  selectedTalkbackSource: {
    type: String
  },
  selectedTalkbackDestination: {
    type: String
  },
  selectedVideoSource: {
    type: String
  },
  selectedAudioMode: {
    type: String
  },
  userId: {
    type: String,
  }
});

Settings.attachSchema(Settings.schema);

// Factory.define('settings', Settings, {
//   sendAudioChecked: false,
//   sendVideoChecked: false,
//   receiveAudioChecked: false,
//   receiveVideoChecked: false,
//   freshIceChecked: false,
//   pushToTalkChecked: false,
//   selectedTalkbackSource: 'one',
//   selectedTalkbackDestination: 'two',
//   selectedVideoSource: 'three',
//   selectedAudioMode: 'voice',
//   userId: '123'
// });
