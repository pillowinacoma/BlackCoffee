var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const creds = require('./creds.js');

// This file is copied from: https://github.com/thelinmichael/spotify-web-api-node/blob/master/examples/tutorial/00-get-access-token.js

const scopes = [
  'ugc-image-upload',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'streaming',
  'app-remote-control',
  'user-read-email',
  'user-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-read-private',
  'playlist-modify-private',
  'user-library-modify',
  'user-library-read',
  'user-top-read',
  'user-read-playback-position',
  'user-read-recently-played',
  'user-follow-read',
  'user-follow-modify'
];

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: creds.clientId,
  clientSecret: creds.clientSecret,
  redirectUri: 'http://localhost:3000/callback'
});

const app = express();


app.get('/login', (req, res) => {
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

app.get('callback', (req, res) => {
  console.log("req : ", req);
  console.log("res : ", res);
  res.redirect(301, "http://localhost:3000/?body=" + req.body);
})

app.get('/me', (req, res) => {
  spotifyApi.getMe()
    .then(function (data) {
      return data.body;
    }, function (err) {
      console.log('Something went wrong!', err);
    }).then((data) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.send(data);
    })
});

app.get('/myTopArtists', (req, res) => {
  spotifyApi.getMyTopArtists()
    .then(function (data) {
      return data.body.items;
    }, function (err) {
      console.log('Something went wrong!', err);
    }).then((myTopArtists) => {
      res.send(myTopArtists)
    })
})

app.get('/myTopTracks', (req, res) => {
  spotifyApi.getMyTopTracks()
    .then(function (data) {
      return data.body.items;
    }, function (err) {
      console.log('Something went wrong!', err);
    }).then((myTopTracks) => {
      res.send(myTopTracks)
    })
})

app.get('/callback', (req, res) => {
  const error = req.query.error;
  const code = req.query.code;
  const state = req.query.state;

  if (error) {
    console.error('Callback Error:', error);
    res.send(`Callback Error: ${error}`);
    return;
  }

  spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
      const access_token = data.body['access_token'];
      const refresh_token = data.body['refresh_token'];
      const expires_in = data.body['expires_in'];

      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

      console.log('access_token:', access_token);
      console.log('refresh_token:', refresh_token);

      console.log(
        `Sucessfully retreived access token. Expires in ${expires_in} s.`
      );
      res.send('Success! You can now close the window.');

      setInterval(async () => {
        const data = await spotifyApi.refreshAccessToken();
        const access_token = data.body['access_token'];

        console.log('The access token has been refreshed!');
        console.log('access_token:', access_token);
        spotifyApi.setAccessToken(access_token);
      }, expires_in / 2 * 1000);
    })
    .catch(error => {
      console.error('Error getting Tokens:', error);
      res.send(`Error getting Tokens: ${error}`);
    });
});

app.listen(8888, () =>
  console.log(
    'HTTP Server up. Now go to http://localhost:8888/login in your browser.'
  )
);