import { Meteor } from 'meteor/meteor';
import { Invitations } from '../invitations';

Meteor.publish('invitations', () => Invitations.find());
