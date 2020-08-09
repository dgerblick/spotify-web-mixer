import React, { Component } from 'react';
import axios from 'axios';
import PlaylistListEntry from './PlaylistListEntry';

export default class PlaylistList extends Component {
  constructor(props) {
    super(props);

    this.state = { playlists: [] };
  }

  getPlaytlists(endpoint) {
    axios.get(endpoint).then(res => {
      var playlists = this.state.playlists;
      res.data.items.forEach(item => {
        playlists.push(<PlaylistListEntry data={item} key={item.uri}/>)
      });
      if (res.data.next != null) {
        this.getPlaytlists(res.data.next);
      }
      this.setState({ playlists });
    });
  }

  componentDidMount() {
    this.getPlaytlists('https://api.spotify.com/v1/me/playlists');
  }

  render() {
    return (
      <div className="PlaylistList">
        {this.state.playlists}
      </div>
    );
  }
}
