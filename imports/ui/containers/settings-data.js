import { composeWithTracker } from 'react-komposer';
import { Settings } from '../../api/users/settings.js';
import { SettingsModal } from '../components/avatar/settings-modal';
import { Loading } from '../components/loading.js';
import { Meteor } from 'meteor/meteor';

const composer = (params, onData) => {
  const subscription = Meteor.subscribe('Settings');
  if (subscription.ready()) {
    const settings = Settings.find({userId: Meteor.user()._id}).fetch();
    onData(null, { settings });
  }
};
export default composeWithTracker(composer, Loading)(SettingsModal);
