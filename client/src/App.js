import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import './App.scss';
import NowPlaying from './NowPlaying';
import PlaylistList from './PlaylistList';

const cookies = new Cookies();

export default class App extends Component {
  constructor() {
    super();

    var auth_token = cookies.get('auth_token');

    if (auth_token === undefined) {
      window.location = 'http://localhost:3001/api/auth';
    }

    axios.interceptors.request.use(
      function (config) {
        if (Date.now() > auth_token.expires) {
          Promise.resolve(fetch('/api/refresh'));
          auth_token = cookies.get('auth_token');
        }
        config.headers['Authorization'] = `Bearer ${auth_token.access_token}`;
        return config;
      },
      function (error) {
        console.log(error);
        return Promise.reject(error);
      }
    );

    this.state = { auth_token };
  }

  render() {
    return (
      <div className="App">
        <PlaylistList />
      </div>
    );
  }
}
