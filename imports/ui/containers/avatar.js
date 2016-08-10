import { composeWithTracker } from 'react-komposer';
// import { Settings } from '../../api/users/settings.js';
import { Avatar } from '../components/avatar/avatar';
import { Loading } from '../components/loading.js';
import { Meteor } from 'meteor/meteor';

const composer = (params, onData) => {
  const user = Meteor.user();
  const userObj = user && user.profile && user.profile.name;
  if (userObj) {
    console.log("user in data is: ",userObj)
    onData(null, { userObj });
  }
};
export default composeWithTracker(composer, Loading)(Avatar);
