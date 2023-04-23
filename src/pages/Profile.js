import React from "react";
import { useEffect, useState } from "react";
import {
  accessToken,
  logout,
  getCurrentUserProfile,
  getCurrentUserPlaylists,
  getTopArtists,
  getTopTracks,
  getCurrentUserSaved,
  getRecentlyPlayed,
} from "../Spotify/spotify";
import { catchErrors } from "../utils";
import Login from "./Login";
import { StyledHeader } from "../styles";
import {
  SectionWrapper,
  ArtistsGrid,
  TrackList,
  PlaylistsGrid,
  Loader,
} from "../components";

export default function Profile() {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const [playlists, setPlaylists] = useState({ items: [] });
  const [topArtists, setTopArtists] = useState({ items: [] });
  const [topTracks, setTopTracks] = useState({ items: [] });
  const [savedTracks, setSavedTracks] = useState(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState(null);

  useEffect(() => {
    setToken(accessToken);

    const fetchData = async () => {
      const { data } = await getCurrentUserProfile();
      setProfile(data);
      if (data && data.name !== "AxiosError") {
        document.title = `${data.display_name}'s Profile`;
      }

      const userPlaylists = await getCurrentUserPlaylists();
      setPlaylists(userPlaylists.data);

      const userTopArtist = await getTopArtists();
      setTopArtists(userTopArtist.data);

      const userTopTracks = await getTopTracks();
      setTopTracks(userTopTracks.data);
      console.log("req");

      const { data: savedTracksData } = await getCurrentUserSaved();
      setSavedTracks(savedTracksData.items);

      const { data: recentlyPlayedData } = await getRecentlyPlayed();
      setRecentlyPlayed(recentlyPlayedData.items);
    };

    catchErrors(fetchData());
  }, []);

  const removeDuplicates = (arr) => {
    var map = new Map(arr.map((o) => [o.id, o]));
    return [...map.values()];
  };

  return (
    <div>
      {!token ? (
        <Login />
      ) : (
        <>
          {profile && (
            <>
              <StyledHeader type="user">
                <div className="header__inner">
                  {profile.images.length && profile.images[0].url && (
                    <img
                      className="header__img"
                      src={profile.images[0].url}
                      alt="Avatar"
                    />
                  )}
                  <div>
                    <div className="header__overline">Profile</div>
                    <h1 className="header__name">{profile.display_name}</h1>
                    <p className="header__meta">
                      {playlists && (
                        <span>
                          {playlists.total} Playlist
                          {playlists.total !== 1 ? "s" : ""}
                        </span>
                      )}
                      <span>
                        {profile.followers.total} Follower
                        {profile.followers.total !== 1 ? "s" : ""}
                      </span>
                    </p>
                  </div>
                </div>
              </StyledHeader>

              <main>
                <div>
                  {topArtists && topTracks && playlists ? (
                    <>
                      <SectionWrapper
                        title="Top artists this month"
                        seeAllLink="/top-artists"
                      >
                        <ArtistsGrid artists={topArtists.items.slice(0, 10)} />
                      </SectionWrapper>

                      <SectionWrapper
                        title="Top tracks this month"
                        seeAllLink="/top-tracks"
                      >
                        <TrackList tracks={topTracks.items.slice(0, 5)} />
                      </SectionWrapper>

                      <SectionWrapper
                        title="Your Playlists"
                        seeAllLink="/playlists"
                      >
                        <PlaylistsGrid
                          playlists={playlists.items.slice(0, 10)}
                        />
                      </SectionWrapper>
                      <SectionWrapper
                        title="Recently Played Tracks"
                        seeAllLink="/recently-played"
                      >
                        {recentlyPlayed && (
                          <TrackList
                            tracks={removeDuplicates(
                              recentlyPlayed.map((a) => a.track)
                            ).slice(0, 5)}
                          />
                        )}
                      </SectionWrapper>
                      <SectionWrapper title="Liked Tracks" seeAllLink="/saved">
                        {savedTracks && (
                          <TrackList
                            tracks={removeDuplicates(
                              savedTracks.map((a) => a.track)
                            ).slice(0, 10)}
                          />
                        )}
                      </SectionWrapper>
                    </>
                  ) : (
                    <Loader />
                  )}
                </div>
              </main>
            </>
          )}
        </>
      )}
    </div>
  );
}