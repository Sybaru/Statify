import React from "react";
import { useEffect, useState } from "react";
import { accessToken, logout } from "../Spotify/spotify";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
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
import styled from "styled-components/macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const StyledLogoutButton = styled.button`
  position: absolute;
  top: var(--spacing-sm);
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
  top: var(--spacing-sm);
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
  let navigate = useNavigate();

  const goLogin = () => {
    let path = "/login";
    navigate(path);
  };

  useEffect(() => {
    setToken(accessToken);
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
        <StyledLogoutButton onClick={logout}>Log Out</StyledLogoutButton>
      ) : (
        <StyledLogoutButton onClick={goLogin}>Log in</StyledLogoutButton>
      )}
      <Routes>
        <Route path="/top-artists" element={<TopArtists />} />
        <Route path="/top-tracks" element={<TopTracks />} />
        <Route path="/playlists/:id" element={<Playlist />} />
        <Route path="/playlists" element={<Playlists />} />
        <Route path="/artist/:id" element={<Artist />} />
        <Route path="/album/:id" element={<Album />} />
        <Route
          path="/profile"
          element={<Profile token={token} setToken={setToken} />}
        />
        <Route path="/user/:id" element={<User />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </RelativeDiv>
  );
}
