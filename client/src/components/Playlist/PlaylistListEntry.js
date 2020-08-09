import React, { Component } from 'react';
import { AllHtmlEntities } from 'html-entities';
import './PlaylistListEntry.scss'

export default class PlaylistListEntry extends Component {
  constructor(props) {
    super(props);

    let image = {
      width: null,
      height: null,
      size: 0,
      url: 'logo192.png',
    };

    props.data.images.forEach(element => {
      let size = Math.sqrt(element.width ** 2 * element.height ** 2);
      if (size >= image.size) {
        image = element;
        image.size = size;
      }
    });

    this.state = {
      image,
      description: props.data.description,
      name: props.data.name,
      tracks: props.data.tracks,
    };
  }

  cleanDisc(text) {
    let parts = text.split(/(<a[^>]*>[^<]*<\/a>)/);
    for (let i = 0; i < parts.length; i++) {
      if (/<a[^>]*>[^<]*<\/a>/.test(parts[i])) {
        let subparts = parts[i].split(/<a[^>]*href="|"[^>]*>|<\/a>/);
        parts[i] = (
          <a key={'desc-link-' + i} href={subparts[1]}>
            {AllHtmlEntities.decode(subparts.slice(2).join(''))}
          </a>
        );
      } else {
        parts[i] = AllHtmlEntities.decode(parts[i])
      }
    }
    console.log(parts);
    return parts;
  }

  render() {
    return (
      <div className="PlaylistListEntry">
        <img src={this.state.image.url} alt={this.state.name} />
        <div className="playlistInfo">
          <h1>{this.state.name}</h1>
          <p>{this.cleanDisc(this.state.description)}</p>
        </div>
      </div>
    );
  }
}
