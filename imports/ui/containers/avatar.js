/**
 * Higher order container (HOC) to supply data to the Avatar component using React Komposer
 */

import { Meteor } from 'meteor/meteor';
import { composeWithTracker } from 'react-komposer';

// import collections to provide data sources
import { Settings } from '../../api/users/settings';
// import { Mesh } from '../../api/mesh/mesh';

// import components
import { Avatar } from '../components/avatar/avatar';
import { Loading } from '../components/loading';

const composer = (params, onData) => {
  // get user object
  const user = Meteor.user();
  // subscribe to data sources
  const subscription = Meteor.subscribe('Settings');
  // const subscription = Meteor.subscribe('mesh');

  // this line is required to create a reactive context for Meteor.user()
  // .ready is not available for global (unpublished) data sources
  const userObj = user;

  if (userObj && subscription.ready()) {
    // grab settings data based on userId
    const settings = Settings.find({userId: userObj._id}).fetch();
    userObj.settings = settings[0];

    onData(null, { userObj });
  }
};
export default composeWithTracker(composer, Loading)(Avatar);
