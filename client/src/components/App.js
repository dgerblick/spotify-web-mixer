import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { PlaylistList } from './PlaylistList';
import PlaylistDisplay from './PlaylistDisplay';
import './index.scss';

const App = () => {
  const [cookies, setCookies] = useCookies(['authToken']);
  const authToken = cookies['authToken'];

  if (authToken === undefined)
    window.location = 'http://localhost:3001/api/auth';

  useEffect(() => {
    setTimeout(() => {
      axios.get('/api/refresh').then(res => setCookies('authToken', res.data));
    }, Math.max(authToken.expires - Date.now(), 0));
  }, [authToken]);

  const [ready, setReady] = useState(false);
  useEffect(() => {
    axios.interceptors.request.use(config => {
      config.headers['Authorization'] = `Bearer ${authToken.access_token}`;
      return config;
    });
    setReady(true);
  }, []);

  return (
    (ready && (
      <Router className="App">
        <Switch>
          <Route path="/playlists" component={PlaylistDisplay} />
          <Route path="/" component={PlaylistList} />
        </Switch>
      </Router>
    )) ||
    null
  );
};

export default App;
