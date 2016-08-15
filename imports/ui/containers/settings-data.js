/**
 * Higher order container (HOC) to supply data to the SettingsModal component using React Komposer
 */

import { Meteor } from 'meteor/meteor';
import { composeWithTracker } from 'react-komposer';

// import collection to provide data source
import { Settings } from '../../api/users/settings.js';

// import components
import { SettingsModal } from '../components/avatar/settings-modal';
import { Loading } from '../components/loading.js';

const composer = (params, onData) => {
  // subscribe to data sources
  const subscription = Meteor.subscribe('Settings');
  if (subscription.ready()) {
    const settings = Settings.find({userId: Meteor.user()._id}).fetch();
    onData(null, { settings });
  }
};
export default composeWithTracker(composer, Loading)(SettingsModal);
