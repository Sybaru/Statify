import React from "react";
import { useEffect, useState } from "react";
import { accessToken } from "../Spotify/spotify";
import {
  SectionWrapper,
  ArtistsGrid,
  PlaylistsGrid,
  TrackList,
} from "../components";
import { getFeaturedPlaylists } from "../Spotify/spotifyGen";
import { getTopArtists, getRecentlyPlayed } from "../Spotify/spotify";
import { catchErrors } from "../utils";
import { StyledHeader } from "../styles";
import LoginButton from "./LoginButton";

export default function Home() {
  const [token, setToken] = useState(null);
  const [playlistsData, setPlaylistsData] = useState(null);
  const [topArtists, setTopArtists] = useState({ items: [] });
  const [recentlyPlayed, setRecentlyPlayed] = useState(null);

  useEffect(() => {
    setToken(accessToken);

    const fetchData = async () => {
      const { data } = await getFeaturedPlaylists();
      setPlaylistsData(data);
      const userTopArtist = await getTopArtists();
      setTopArtists(userTopArtist.data);
      const { data: recentlyPlayedData } = await getRecentlyPlayed();
      setRecentlyPlayed(recentlyPlayedData.items);
    };

    catchErrors(fetchData());
  }, []);

  return (
    <div>
      <StyledHeader type="home">
        <div className="header__inner">
          <h1 className="header__name">Home</h1>
        </div>
      </StyledHeader>
      <main>
        <SectionWrapper title="Featured Playlists">
          {playlistsData && (
            <PlaylistsGrid playlists={playlistsData.playlists.items} />
          )}
        </SectionWrapper>
        <SectionWrapper title="Your Top Artists">
          {token ? (
            <>
              {topArtists && (
                <ArtistsGrid artists={topArtists.items.slice(0, 10)} />
              )}
            </>
          ) : (
            <LoginButton text="Log in to see your top artists" />
          )}
        </SectionWrapper>
        <SectionWrapper title="Recently Played">
          {token ? (
            <>
              {recentlyPlayed && (
                <TrackList tracks={recentlyPlayed.map((o) => o.track)} />
              )}
            </>
          ) : (
            <LoginButton text="Log in to see your recently played tracks" />
          )}
        </SectionWrapper>
      </main>
    </div>
  );
}
