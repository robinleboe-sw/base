import { Meteor } from 'meteor/meteor';
import { Invitations } from '../invitations';
import { Settings } from '../settings';

Meteor.publish('invitations', () => Invitations.find());
Meteor.publish('Settings', () => Settings.find());
