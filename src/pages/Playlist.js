import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { catchErrors } from "../utils";
import {
  getPlaylistById,
  getAudioFeaturesForTracks,
} from "../Spotify/spotifyGen";
import {
  accessToken,
  getCurrentUserProfile,
  unfollowPlaylist,
  userFollowsPlaylist,
  followPlaylist,
} from "../Spotify/spotify";
import { StyledHeader, StyledDropdown } from "../styles";
import { TrackList, SectionWrapper } from "../components";
import axios from "axios";

const Playlist = () => {
  const { id } = useParams();
  const [token, setToken] = useState(accessToken);
  const [profile, setProfile] = useState(null);
  const [playlist, setPlaylist] = useState(null);
  const [tracksData, setTracksData] = useState(null);
  const [tracks, setTracks] = useState(null);
  const [audioFeatures, setAudioFeatures] = useState(null);
  const [sortValue, setSortValue] = useState("");
  const [followed, setFollowed] = useState(false);
  const sortOptions = ["danceability", "tempo", "energy"];

  const handleEdit = () => {
    if (token) {
      console.log(profile);
      if (playlist.owner.id !== profile.id) {
        alert("You can only edit your own playlists");
      } else {
        window.location.href = `/edit/${id}`;
      }
    } else {
      alert("You need to be logged in to edit this playlist");
    }
  };

  const tracksForTracklist = useMemo(() => {
    if (!tracks) {
      return;
    }
    return tracks.map(({ track }) => track);
  }, [tracks]);

  const tracksWithAudioFeatures = useMemo(() => {
    if (!tracks || !audioFeatures) {
      return null;
    }

    return tracks.map(({ track }) => {
      const trackToAdd = track;

      if (!track.audio_features) {
        const audioFeaturesObj = audioFeatures.find((item) => {
          if (!item || !track) {
            return null;
          }
          return item.id === track.id;
        });

        trackToAdd["audio_features"] = audioFeaturesObj;
      }

      return trackToAdd;
    });
  }, [tracks, audioFeatures]);

  const sortedTracks = useMemo(() => {
    if (!tracksWithAudioFeatures) {
      return null;
    }

    return [...tracksWithAudioFeatures].sort((a, b) => {
      const aFeatures = a["audio_features"];
      const bFeatures = b["audio_features"];

      if (!aFeatures || !bFeatures) {
        return false;
      }

      return bFeatures[sortValue] - aFeatures[sortValue];
    });
  }, [sortValue, tracksWithAudioFeatures]);

  const removeDuplicates = (arr) => {
    var map = new Map(arr.map((o) => [o.id, o]));
    return [...map.values()];
  };

  useEffect(() => {
    setToken(accessToken);

    const fetchData = async () => {
      const { data } = await getCurrentUserProfile();
      setProfile(data);
    };

    catchErrors(fetchData());
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getPlaylistById(id);
      setPlaylist(data);
      setTracksData(data.tracks);
      if (data && data.name !== "AxiosError") {
        document.title = data.name;
      }
    };

    catchErrors(fetchData());
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await userFollowsPlaylist(id, profile.id);
      setFollowed(data[0]);
      console.log(data[0]);
    };

    if (profile) {
      catchErrors(fetchData());
    }
  }, [profile, id]);

  // When tracksData updates, compile arrays of tracks and audioFeatures
  useEffect(() => {
    if (!tracksData) {
      return;
    }

    // When tracksData updates, check if there are more tracks to fetch
    // then update the state variable
    const fetchMoreData = async () => {
      if (tracksData.next) {
        const { data } = await axios.get(tracksData.next);
        setTracksData(data);
      }
    };
    setTracks((tracks) => [...(tracks ? tracks : []), ...tracksData.items]);
    catchErrors(fetchMoreData());

    // Also update the audioFeatures state variable using the track IDs
    const fetchAudioFeatures = async () => {
      const ids = tracksData.items.map(({ track }) => track.id).join(",");
      const { data } = await getAudioFeaturesForTracks(ids);
      setAudioFeatures((audioFeatures) => [
        ...(audioFeatures ? audioFeatures : []),
        ...data["audio_features"],
      ]);
    };
    catchErrors(fetchAudioFeatures());
  }, [tracksData]);

  return (
    <>
      {playlist && (
        <>
          <StyledHeader>
            <div className="header__inner">
              {playlist.images.length && playlist.images[0].url ? (
                <img
                  className="header__img"
                  src={playlist.images[0].url}
                  alt="Playlist Artwork"
                />
              ) : (
                <img
                  className="header__img"
                  src="/defaultplaylist.png"
                  alt="Playlist Artwork"
                />
              )}
              <div>
                <div className="header__overline">Playlist</div>
                <h1 className="header__name">{playlist.name}</h1>
                <p className="header__meta">
                  {playlist.owner.display_name ? (
                    <span className="artists">
                      {playlist.owner.display_name}{" "}
                    </span>
                  ) : null}
                  <span>
                    {playlist.tracks.total}{" "}
                    {`song${playlist.tracks.total !== 1 ? "s" : ""}`}
                    <button className="edit__button" onClick={handleEdit}>
                      Edit Playlist
                    </button>
                    {profile ? (
                      <>
                        {followed ? (
                          <button
                            className="edit__button"
                            onClick={() => {
                              unfollowPlaylist(id);
                              setFollowed(false);
                            }}
                          >
                            Remove From Saved
                          </button>
                        ) : (
                          <button
                            className="edit__button"
                            onClick={() => {
                              followPlaylist(id);
                              setFollowed(true);
                            }}
                          >
                            Save
                          </button>
                        )}
                      </>
                    ) : null}
                  </span>
                </p>
              </div>
            </div>
          </StyledHeader>

          <main>
            <SectionWrapper title="Playlist" breadcrumb={true}>
              <StyledDropdown active={!!sortValue}>
                <label className="sr-only" htmlFor="order-select">
                  Sort tracks
                </label>
                <select
                  name="track-order"
                  id="order-select"
                  onChange={(e) => setSortValue(e.target.value)}
                >
                  <option className="dropdown__option" value="">
                    Sort tracks
                  </option>
                  {sortOptions.map((option, i) => (
                    <option className="dropdown__option" value={option} key={i}>
                      {`${option.charAt(0).toUpperCase()}${option.slice(1)}`}
                    </option>
                  ))}
                </select>
              </StyledDropdown>
              {sortedTracks && (
                <TrackList tracks={removeDuplicates(sortedTracks)} />
              )}
            </SectionWrapper>
          </main>
        </>
      )}
    </>
  );
};

export default Playlist;
