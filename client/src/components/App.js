import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { PlaylistList }from './PlaylistList';
import PlaylistDisplay from './PlaylistDisplay';
import './index.scss';

const cookies = new Cookies();

export default class App extends Component {
  constructor() {
    super();

    var auth_token = cookies.get('auth_token');

    if (auth_token === undefined || Date.now() > auth_token.expires) {
      window.location = 'http://localhost:3001/api/auth';
    }
    this.state = { auth_token };

    axios.interceptors.request.use(config => {
      if (Date.now() > this.state.auth_token.expires) {
        cookies.remove('auth_token');
        Promise.resolve(fetch('/api/refresh'));
        this.setState({ auth_token: cookies.get('auth_token') });
      }
      config.headers[
        'Authorization'
      ] = `Bearer ${this.state.auth_token.access_token}`;
      return config;
    });
  }

  render() {
    return (
      <Router className="App">
        <Switch>
          <Route path="/playlists" component={PlaylistDisplay} />
          <Route path="/" component={PlaylistList} />
        </Switch>
      </Router>
    );
  }
}
