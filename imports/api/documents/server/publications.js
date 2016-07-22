import { Meteor } from 'meteor/meteor';
import { Documents } from '../documents';
import { Mesh } from '../../mesh/mesh'

Meteor.publish('documents', () => Documents.find());
Meteor.publish('mesh', () => Mesh.find());
