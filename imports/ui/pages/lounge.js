import React from 'react';
import { render } from 'react-dom';
import { Button, ButtonToolbar } from 'react-bootstrap';
import { HelpModal } from '/imports/ui/components/avatar/help-modal'
import { SettingsModal } from '/imports/ui/components/avatar/settings-modal'


export class Lounge extends React.Component {
  constructor(props) {
    super(props);
    this.state = { helpShow: false, settingsShow: false };
    this.helpShow = this.helpShow.bind(this);
    this.helpClose = this.helpClose.bind(this);
    this.settingsShow = this.settingsShow.bind(this);
    this.settingsClose = this.settingsClose.bind(this);
  }

  helpShow() {
    this.setState({ helpShow: true });
  }

  helpClose() {
    this.setState({ helpShow: false });
  }

  settingsShow() {
    this.setState({ settingsShow: true });
  }

  settingsClose() {
    this.setState({ settingsShow: false });
  }

  render() {
    return (
      <div>
        <h1>Lounge</h1>
        <ButtonToolbar>
          <Button bsStyle="primary" onClick={this.helpShow}>
            Need Help?
          </Button>
          <Button bsStyle="primary" onClick={this.settingsShow}>
            Settings
          </Button>
          <HelpModal show={this.state.helpShow} onHide={this.helpClose} />
          <SettingsModal show={this.state.settingsShow} onHide={this.settingsClose} />
        </ButtonToolbar>
      </div>
    )
  }
};
