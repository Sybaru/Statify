import React from "react";
import { useEffect, useState } from "react";
import { accessToken } from "../Spotify/spotify";
import { SectionWrapper, ArtistsGrid, PlaylistsGrid } from "../components";
import { getFeaturedPlaylists } from "../Spotify/spotifyGen";
import { getTopArtists } from "../Spotify/spotify";
import { catchErrors } from "../utils";
import { StyledHeader } from "../styles";
import LoginButton from "./LoginButton";

export default function Home() {
  const [token, setToken] = useState(null);
  const [playlistsData, setPlaylistsData] = useState(null);
  const [topArtists, setTopArtists] = useState({ items: [] });

  useEffect(() => {
    setToken(accessToken);

    const fetchData = async () => {
      const { data } = await getFeaturedPlaylists();
      setPlaylistsData(data);

      if (token) {
        const userTopArtist = await getTopArtists();
        setTopArtists(userTopArtist.data);
      }
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
      </main>
    </div>
  );
}
