/**
 * Settings display component for Avatar A/V chat
 */

import React from 'react';

export class SettingsDisplay extends React.Component {
  constructor(props) {
    super(props);
    console.log("user settings: ",props);
  }

  render() {
    // use destructuring to retrieve settings from props
    const { settings } = this.props;
    const userSettings = settings.settings;
    console.log("user settings: ",userSettings);

    return (
      <div id="divSettingsDisplay" className="text-left">

        {/* for testing purposes */}
          <ul>
            <li>User is {settings.profile.name.first + " " + settings.profile.name.last}</li>
            <li>{userSettings._id}</li>
            <li>sendAudioChecked {":"+userSettings.sendAudioChecked }</li>
            <li>sendVideoChecked {":"+userSettings.sendVideoChecked }</li>
            <li>receiveAudioChecked {":"+userSettings.receiveAudioChecked }</li>
            <li>receiveVideoChecked {":"+userSettings.receiveVideoChecked }</li>
            <li>freshIceChecked {":"+userSettings.freshIceChecked }</li>
            <li>pushToTalkChecked {":"+userSettings.pushToTalkChecked }</li>
            <li>selectedTalkbackSource {":"+userSettings.selectedTalkbackSource }</li>
            <li>selectedTalkbackDestination {":"+userSettings.selectedTalkbackDestination }</li>
            <li>selectedVideoSource {":"+userSettings.selectedVideoSource }</li>
            <li>selectedAudioMode {":"+userSettings.selectedAudioMode }</li>
          </ul>
        </div>
    )
  }
}

