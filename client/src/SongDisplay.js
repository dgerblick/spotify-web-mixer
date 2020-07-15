import React, { Component } from 'react';

export default class SongDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      size: props.size || 100,
      img: {},
      title: '',
      artists: [],
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.track.id !== prevProps.track.id) {
      this.setState({
        img: this.props.track.album.images[0],
        title: this.props.track.name,
        artists: this.props.track.artists,
      });
    }
  }

  render() {
    return (
      <div className="SongDisplay">
        <img src={this.state.img.url} width={this.state.size} />
        <div className="songInfo" style={{ fontSize: this.state.size / 12 }}>
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
