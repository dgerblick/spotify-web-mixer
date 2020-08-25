import React, { Component } from 'react';
import './SongDisplay.scss';

export default class SongDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = { track: { id: '' } };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.track.id !== state.track.id) return { track: props.track };
  }

  render() {
    return (
      <div className="SongDisplay">
        <img src={this.state.track.album.images[0].url} alt={this.state.track.album.name} />
        <div className="songInfo">
          <h1>{this.state.track.name}</h1>
          <h2>
            {(artists => {
              let out = [];
              artists.forEach(e => out.push(e.name));
              return out.join(', ');
            })(this.state.track.artists)}
          </h2>
        </div>
      </div>
    );
  }
}
