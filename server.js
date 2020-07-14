const express = require('express');
const querystring = require('querystring');

const app = express();
const port = process.env.PORT || 3001;

require('dotenv').config()

app.get('/api/auth', (req, res) => {
  var redirect_uri = config.SPOTIFY.REDIRECT_URI;

  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: 'user-read-private user-read-email',
        redirect_uri,
      })
  );
});

app.listen(port, () => `Server running on port ${port}`);
