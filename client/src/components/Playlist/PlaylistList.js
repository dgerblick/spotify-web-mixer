import React, { Component } from 'react';
import axios from 'axios';
import './PlaylistList.scss';
import PlaylistListEntry from './PlaylistListEntry';

export default class PlaylistList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playlists: [],
      nextPlaylist: 'https://api.spotify.com/v1/me/playlists?limit=10',
    };
    this.handleScroll = this.handleScroll.bind(this);
  }

  getNextPlaylist() {
    if (this.state.nextPlaylist != null) {
      axios.get(this.state.nextPlaylist).then(res => {
        let playlists = this.state.playlists;
        res.data.items.forEach(item => {
          playlists.push(<PlaylistListEntry data={item} key={item.id} />);
        });
        this.setState({ playlists, nextPlaylist: res.data.next });
      });
    }
  }

  handleScroll() {
    const windowHeight =
      'innerHeight' in window
        ? window.innerHeight
        : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight) {
      this.getNextPlaylist();
    }
  }

  componentDidMount() {
    //this.getPlaytlists('https://api.spotify.com/v1/me/playlists?limit=1');
    window.addEventListener('scroll', this.handleScroll);
    this.getNextPlaylist();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  render() {
    return <div className="PlaylistList">{this.state.playlists}</div>;
  }
}
