import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import './App.css';
import { AuthContext } from './AuthContext';
import NowPlaying from './NowPlaying';

const cookies = new Cookies();

export default class App extends Component {
  constructor() {
    super();

    var auth_token = cookies.get('auth_token');

    if (auth_token === undefined) {
      window.location = 'http://localhost:3001/api/auth';
    }

    //auth_token.addChangeListener((name, value, options) => {});

    axios.defaults.headers.common['Authorization'] =
      'Bearer ' + auth_token.access_token;

    axios.interceptors.request.use(
      function (config) {
        console.log('Request Sent');
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
        <AuthContext.Provider value={this.state.auth_token}>
          <NowPlaying />
        </AuthContext.Provider>
        <a href="http://localhost:3001/api/auth">Login</a>
      </div>
    );
  }
}
