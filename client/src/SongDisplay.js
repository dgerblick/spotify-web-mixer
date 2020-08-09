import React, { Component } from 'react';

export default class SongDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      img: {},
      title: '',
      artists: [],
      albumName: '',
    };
  }

  componentDidUpdate(prevProps) {
    if (
      typeof this.props.track !== 'undefined' &&
      this.props.track.id !== prevProps.track.id
    ) {
      this.setState({
        img: this.props.track.album.images[0],
        title: this.props.track.name,
        artists: this.props.track.artists,
        albumName: this.props.track.album.name,
      });
    }
  }

  render() {
    return (
      <div className="SongDisplay">
        <img src={this.state.img.url} alt={this.state.albumName} />
        <div className="songInfo">
          <h1>{this.state.title}</h1>
          <h1>
            {(artists => {
              var out = [];
              artists.forEach(e => out.push(e.name));
              return out.join(', ');
            })(this.state.artists)}
          </h1>
        </div>
      </div>
    );
  }
}
