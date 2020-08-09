import React, { Component } from 'react';
import axios from 'axios';
import './NowPlaying.scss'
import SongDisplay from './SongDisplay';

export default class NowPlaying extends Component {
  constructor() {
    super();

    this.state = { track: {} };
  }

  componentDidMount() {
    axios
      .get('https://api.spotify.com/v1/me/player/currently-playing')
      .then(res => this.setState({ track: res.data.item }));
  }

  render() {
    return (
      <div className="NowPlaying">
        <SongDisplay track={this.state.track} />
        <SongDisplay track={this.state.track} />
        <SongDisplay track={this.state.track} />
        <SongDisplay track={this.state.track} />
        <SongDisplay track={this.state.track} />
        <SongDisplay track={this.state.track} />
        <SongDisplay track={this.state.track} />
        <SongDisplay track={this.state.track} />
        <SongDisplay track={this.state.track} />
        <SongDisplay track={this.state.track} />
        <SongDisplay track={this.state.track} />
        <SongDisplay track={this.state.track} />
        <SongDisplay track={this.state.track} />
        <SongDisplay track={this.state.track} />
        <SongDisplay track={this.state.track} />
        <SongDisplay track={this.state.track} />
        <SongDisplay track={this.state.track} />
        <SongDisplay track={this.state.track} />
        <SongDisplay track={this.state.track} />
        
      </div>
    );
  }
}