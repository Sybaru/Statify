import React from "react";
import { useEffect, useState } from "react";
import { accessToken, logout, getCurrentUserProfile } from "../Spotify/spotify";
import { Routes, Route, useNavigate } from "react-router-dom";
import Profile from "./Profile";
import Login from "./Login";
import TopArtists from "./TopArtists";
import TopTracks from "./TopTracks";
import Playlists from "./Playlists";
import Playlist from "./Playlist";
import Home from "./Home";
import Artist from "./Artist";
import Album from "./Album";
import User from "./User";
import Track from "./Track";
import Saved from "./Saved";
import PlaylistEdit from "./PlaylistEdit";
import RecentlyPlayed from "./RecentlyPlayed";
import Search from "./Search";
import Admin from "./Admin";
import styled from "styled-components/macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { catchErrors } from "../utils";

const StyledLogoutButton = styled.button`
  position: absolute;
  top: 15px;
  right: var(--spacing-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(0, 0, 0, 0.7);
  color: var(--white);
  font-size: var(--fz-sm);
  font-weight: 700;
  border-radius: var(--border-radius-pill);
  z-index: 10;
  @media (min-width: 768px) {
    right: var(--spacing-lg);
  }
`;

const StyledNavButton = styled.button`
  position: relative;
  top: 15px;
  left: var(--spacing-md);
  margin: 0 5px;
  background-color: rgba(0, 0, 0, 0.7);
  color: var(--white);
  font-size: var(--fz-sm);
  font-weight: 700;
  border-radius: var(--border-radius-pill);
  z-index: 10;
`;

const RelativeDiv = styled.div`
  position: relative;
`;

const Absolute = styled.div`
  position: absolute;
`;

export default function Body() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  let navigate = useNavigate();

  const goLogin = () => {
    let path = "/login";
    navigate(path);
  };

  useEffect(() => {
    setToken(accessToken);

    const fetchData = async () => {
      const { data } = await getCurrentUserProfile();
      setUser(data);
    };

    catchErrors(fetchData());
  }, []);

  return (
    <RelativeDiv>
      <Absolute>
        <StyledNavButton onClick={() => navigate(-1)} className="left">
          <FontAwesomeIcon icon={faArrowLeft} />
        </StyledNavButton>
        <StyledNavButton onClick={() => navigate(1)} className="right">
          <FontAwesomeIcon icon={faArrowRight} />
        </StyledNavButton>
      </Absolute>

      {token ? (
        <>
          <StyledLogoutButton onClick={logout}>
            Log Out of {user && <>{user.display_name}</>}
          </StyledLogoutButton>
        </>
      ) : (
        <StyledLogoutButton onClick={goLogin}>Log in</StyledLogoutButton>
      )}
      <Routes>
        <Route path="/top-artists" element={<TopArtists />} />
        <Route path="/top-tracks" element={<TopTracks />} />
        <Route path="/playlists/:id" element={<Playlist />} />
        <Route path="/playlists" element={<Playlists />} />
        <Route path="/edit/:id" element={<PlaylistEdit />} />
        <Route path="/artist/:id" element={<Artist />} />
        <Route path="/album/:id" element={<Album />} />
        <Route
          path="/profile"
          element={<Profile token={token} setToken={setToken} />}
        />
        <Route path="/user/:id" element={<User />} />
        <Route path="/track/:id" element={<Track />} />
        <Route path="/search" element={<Search />} />
        <Route path="/search/:query" element={<Search />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/recently-played" element={<RecentlyPlayed />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </RelativeDiv>
  );
}
