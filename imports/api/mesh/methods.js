import { Mesh } from './mesh';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

// Meteor.methods({
//   'getIP': function() {
//     return Mesh.find({ 'ip.userId': Meteor.userId() }).fetch();
//   }
// });

export const insertConnection = new ValidatedMethod({
  name: 'mesh.insertConnection',
  validate: new SimpleSchema({
    userId: { type: String },
    connectionIP: { type: String },
    connectionPort: { type: String },
  }).validator(),
  run({ userId, connectionIP, connectionPort }) {
    const mesh = Mesh.findOne(userId);

    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to add a new mesh!');
    }

    Mesh.insert({ 'userId': userId, 'connectionIP': connectionIP, 'connectionPort': connectionPort });
  }
});

export const updateConnection = new ValidatedMethod({
  name: 'mesh.updateConnection',
  validate: new SimpleSchema({
    connectionIP: { type: String },
    connectionPort: { type: String },
  }).validator(),
  run({ connectionIP, connectionPort }) {

    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to add a new mesh!');
    }

    Mesh.update({ 'userId': this.userId }, {
      $set: { 'connectionIP': connectionIP, 'connectionPort': connectionPort }
    });
  }
});
//
// export const setMeshIP = new ValidatedMethod({
//   name: 'Mesh.methods.insert',
//   validate: new SimpleSchema({
//     ip: { type: Object },
//     'ip.ip': { type: String },
//     'ip.port': { type: String },
//     'ip.userId': { type: String }
//   }).validator(),
//   run(mesh) {
//     if (!this.userId) {
//       throw new Meteor.Error('unauthorized', 'You must be logged in to add a new mesh!');
//     }
//     console.log(mesh,this.userId);
//     Mesh.upsert(mesh);
//   },
// });

// export const getMeshIP = new ValidatedMethod({
//   name: 'Mesh.methods.find',
//   validate: new SimpleSchema({
//     ip: { type: Object },
//     'ip.ip': { type: String },
//     'ip.port': { type: String },
//     'ip.userId': { type: String }
//   }).validator(),
//   run(mesh) {
//     if (!this.userId) {
//       throw new Meteor.Error('unauthorized', 'You must be logged in to add a new mesh!');
//     }
//     return Mesh.find({ 'ip.userId': Meteor.userId() }).fetch();
//   },
// });

