import React from 'react';
import { Bert } from 'meteor/themeteorchef:bert';


export class Avatar extends React.Component {
  constructor(props) {
    super(props);
    console.log("props are: ",props.userObj)
    // const user = props.user[0];
    //
    // this.state = {
    //
    // }
  }

  render() {
    // get data passed in from avatar container
    const userSettings = this.props.userObj;
    console.log("get data passed in from avatar container", userSettings)
    // copy props and delete 'unknown prop' settings before passing to div
    // const divProps = Object.assign({}, this.props);
    // delete divProps.settings;

    return (
      <div><p>User is {userSettings.first + " " + userSettings.last}</p></div>
    )
  }
}
