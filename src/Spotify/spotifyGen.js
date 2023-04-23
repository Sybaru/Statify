import axios from "axios";

export const API_BASE = process.env.APP_API_BASE || "http://localhost:3001";

export const getPlaylistById = (playlist_id) => {
  return axios.get(`${API_BASE}/playlists/?id=${playlist_id}`);
};

export const getAudioFeaturesForTracks = (id) => {
  return axios.get(`${API_BASE}/audio-features/?id=${id}`);
};

export const getArtistById = (artist_id) => {
  return axios.get(`${API_BASE}/artist/?id=${artist_id}`);
};

export const getArtistTopTracks = (artist_id) => {
  return axios.get(`${API_BASE}/artist-top-tracks/?id=${artist_id}`);
};

export const getArtistAlbums = (artist_id) => {
  return axios.get(`${API_BASE}/artist-albums/?id=${artist_id}`);
};

export const getAlbumById = (album_id) => {
  return axios.get(`${API_BASE}/album/?id=${album_id}`);
};

export const getFeaturedPlaylists = () => {
  return axios.get(`${API_BASE}/featured-playlists`);
};

export const getUser = (user_id) => {
  return axios.get(`${API_BASE}/user/?id=${user_id}`);
};

export const getUserPLaylists = (user_id) => {
  return axios.get(`${API_BASE}/user-playlists/?id=${user_id}`);
};

export const getTrackbyId = (track_id) => {
  return axios.get(`${API_BASE}/track/?id=${track_id}`);
};

export const getTrackRecommendations = (seed_tracks) => {
  return axios.get(
    `${API_BASE}/recommendations/?seed_tracks=${seed_tracks}`,
    { crossDomain: true }
  );
};

export const getTrackRecommendationsByGenre = (seed_genres) => {
  return axios.get(
    `${API_BASE}/recommendations/?seed_genres=${seed_genres}`,
    { crossDomain: true }
  );
};

export const getTrackRecommendationsByArtist = (seed_artists) => {
  return axios.get(
    `${API_BASE}/recommendations/?seed_artists=${seed_artists}`,
    { crossDomain: true }
  );
};

export const search = (query) => {
  return axios.get(`${API_BASE}/search/?q=${query}`);
};
