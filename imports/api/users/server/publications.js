/**
 * Publish user related collections on the server
 */

import { Meteor } from 'meteor/meteor';
import { Invitations } from '../invitations';
import { Settings } from '../settings';

Meteor.publish('Invitations', () => Invitations.find());
Meteor.publish('Settings', () => Settings.find());
