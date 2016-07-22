// Meteor.methods({
//   'getIP': function() {
//     return {'ip':'192.168.0.0','port':'8080'}
//   }
// });

import { Mesh } from './mesh';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

export const insertMesh = new ValidatedMethod({
  name: 'Mesh.methods.insert',
  validate: new SimpleSchema({
    ip: { type: Object },
    'ip.ip': { type: String },
    'ip.port': { type: String }
  }).validator(),
  run(mesh) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to add a new mesh!');
    }
    console.log(mesh,this.userId);
    Mesh.insert(mesh);
  },
});
