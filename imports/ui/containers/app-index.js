import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { Index } from '../pages/index';

const composer = (props, onData) => {
  onData(null, { hasUser: Meteor.user() });
};

export default composeWithTracker(composer, {}, {}, { pure: false })(Index);
