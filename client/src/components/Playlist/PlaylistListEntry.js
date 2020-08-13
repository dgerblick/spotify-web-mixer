import React, { Component } from 'react';
import { AllHtmlEntities } from 'html-entities';
import { Link } from 'react-router-dom';
import './PlaylistListEntry.scss';

export default class PlaylistListEntry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image: {},
      description: [],
    };
  }

  componentDidMount() {
    let image = {
      width: null,
      height: null,
      size: 0,
      url: 'logo512.png',
    };

    this.props.data.images.forEach(element => {
      let size = Math.sqrt(element.width ** 2 * element.height ** 2);
      if (size >= image.size) {
        image = element;
        image.size = size;
      }
    });

    let description = this.props.data.description.split(/(<a[^>]*>[^<]*<\/a>)/);
    for (let i = 0; i < description.length; i++) {
      if (/<a[^>]*>[^<]*<\/a>/.test(description[i])) {
        let subparts = description[i].split(/<a[^>]*href="|"[^>]*>|<\/a>/);
        description[i] = (
          <a key={'desc-link-' + i} href={subparts[1]}>
            {AllHtmlEntities.decode(subparts.slice(2).join(''))}
          </a>
        );
      } else {
        description[i] = AllHtmlEntities.decode(description[i]);
      }
    }

    this.setState({ image, description });
  }

  render() {
    return (
      <Link
        className="PlaylistListEntry"
        to={{
          pathname: `/playlist/${this.props.data.id}`,
          state: {
            data: this.props.data,
            image: this.state.image,
          }
        }}
      >
        <div className="playlistCard">
          <img src={this.state.image.url} alt={this.props.data.name} />
          <div className="playlistInfo">
            <h1>{this.props.data.name}</h1>
            <h2>{this.props.data.tracks.total} Tracks</h2>
          </div>
          <p>{this.state.description}</p>
        </div>
      </Link>
    );
  }
}
