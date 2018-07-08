import * as React from "react";
import * as ReactBootstrap from "react-bootstrap";

import MicrosoftSpeechController from '../microsoft/MicrosoftSpeechController';
import WwMusicController from '../ww/WwMusicController';

// const {shell} = require('electron').remote;
// const wwLogo = require('../../../assets/ww-logo-40.png')

export interface ApplicationProps { }
export interface ApplicationState { }

export default class Application extends React.Component < ApplicationProps, ApplicationState > {

    componentWillMount() {
        // this.setState({
        // });
    }

    componentDidMount() {
    }

    // onLogoClicked(): void {
    //     shell.openExternal('http://robocommander.io');
    // }

    onButtonClicked(action: string): void {
        // console.log(`onButtonClicked: ${action}`);
        switch (action) {
            case 'startSpeech':
                const microsoftSpeechController = new MicrosoftSpeechController();
                break;
            case 'startMusic':
                const musicController = new WwMusicController();
                break;
        }
    }

    render() {
        return(
            <div>
                <ReactBootstrap.Button bsStyle={'success'} key={"startSpeech"} style = {{width: 100}}
                    onClick={this.onButtonClicked.bind(this, "startSpeech")}>Start Speech</ReactBootstrap.Button>
                <ReactBootstrap.Button bsStyle={'info'} key={"startMusic"} style = {{width: 100}}
                    onClick={this.onButtonClicked.bind(this, "startMusic")}>Start Music</ReactBootstrap.Button>
            </div>
        );
    }
}
