import React, { Component } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export default class NowPlaying extends Component {
  static contextType = AuthContext;

  constructor() {
    super();

    this.state = { playback: {} };
  }

  componentDidMount() {
    axios
      .get('https://api.spotify.com/v1/me/player/currently-playing')
      .then(playback => this.setState({ playback }));
  }

  render() {
    return (
      <AuthContext.Consumer>
        {() => JSON.stringify(this.state.playback)}
      </AuthContext.Consumer>
    );
  }
}