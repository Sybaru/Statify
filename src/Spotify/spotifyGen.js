import axios from "axios";

var genToken;

const setGenToken = (token) => {
  genToken = token;
};

export const getPlaylistById = (playlist_id) => {
  return axios.get(`http://localhost:3001/playlists/?id=${playlist_id}`);
};

export const getAudioFeaturesForTracks = (id) => {
  return axios.get(`http://localhost:3001/audio-features/?id=${id}`);
};

export const getArtistById = (artist_id) => {
  return axios.get(`http://localhost:3001/artist/?id=${artist_id}`);
};

export const getArtistTopTracks = (artist_id) => {
  return axios.get(`http://localhost:3001/artist-top-tracks/?id=${artist_id}`);
};

export const getArtistAlbums = (artist_id) => {
  return axios.get(`http://localhost:3001/artist-albums/?id=${artist_id}`);
};


export const getAlbumById = (album_id) => {
  return axios.get(`http://localhost:3001/album/?id=${album_id}`);
};

export const getFeaturedPlaylists = () => {
  return axios.get(`http://localhost:3001/featured-playlists`);
};

export const getUser = (user_id) => {
  return axios.get(`http://localhost:3001/user/?id=${user_id}`);
};

export const getUserPLaylists = (user_id) => {
  return axios.get(`http://localhost:3001/user-playlists/?id=${user_id}`);
};