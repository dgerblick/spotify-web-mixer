const express = require('express');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3001;

require('dotenv').config();

app.use(cookieParser());

app.get('/api/auth', (req, res) => {
  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        client_id: process.env.SPOTIFY_CLIENT_ID,
        response_type: 'code',
        redirect_uri: 'http://localhost:3001/api/callback',
        scope: 'user-read-private user-read-playback-state playlist-read-private user-read-playback-state user-modify-playback-state',
        show_dialog: true,
      })
  );
});

app.get('/api/callback', (req, res) => {
  axios
    .post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        grant_type: 'authorization_code',
        code: req.query.code,
        redirect_uri: 'http://localhost:3001/api/callback',
      }),
      {
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(
              `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_SECRET_ID}`
            ).toString('base64'),
        },
      }
    )
    .then(data => {
      data.data.expires = Date.now() + data.data.expires_in * 1000;
      return res
        .cookie('authToken', JSON.stringify(data.data))
        .redirect('http://localhost:3000');
    })
    .catch(error => res.send(error));
});

app.get('/api/refresh', (req, res) => {
  var refresh = axios
    .post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: JSON.parse(req.cookies.authToken).refresh_token,
      }),
      {
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(
              `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_SECRET_ID}`
            ).toString('base64'),
        },
      }
    )
    .then(data => {
      data.data.expires = Date.now() + data.data.expires_in * 1000;
      data.data.refresh_token =
        data.data.refresh_token ||
        JSON.parse(req.cookies.authToken).refresh_token;
      return res.send(data.data);
    })
    .catch(error => res.send(error));
});

app.listen(port, () => `Server running on port ${port}`);
