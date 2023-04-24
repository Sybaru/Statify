import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAlbumById } from "../Spotify/spotifyGen";
import {
  follow,
  unfollow,
  accessToken,
  checkFollowing,
} from "../Spotify/spotify";
import { catchErrors } from "../utils";
import { StyledHeader } from "../styles";
import { TrackList, SectionWrapper } from "../components";

const Album = () => {
  const { id } = useParams();
  const [token, setToken] = useState(null);
  const [followed, setFollowed] = useState(false);
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState(null);

  const getAlbumLength = (tracks) => {
    let totalDuration = 0;
    tracks.forEach((track) => {
      totalDuration += track.duration_ms;
    });
    const hours = Math.floor(totalDuration / 3600000);
    const minutes = Math.floor(totalDuration / 60000);
    const seconds = ((totalDuration % 60000) / 1000).toFixed(0);
    return `${hours ? hours + " hours" : ""} ${
      minutes ? minutes + " min" : ""
    } ${seconds ? seconds + " sec" : ""}`;
  };

  useEffect(() => {
    setToken(accessToken);

    const fetchData = async () => {
      const { data } = await getAlbumById(id);
      if (data && data.name !== "AxiosError") {
        setAlbum(data);
        setTracks(data.tracks.items);
        document.title = data.name;
      }

      const isFollowing = await checkFollowing("album", id);
      setFollowed(isFollowing.data[0]);

      console.log("request");
    };

    catchErrors(fetchData());
  }, [id]);

  return (
    <div>
      <StyledHeader>
        <div className="header__inner">
          {album &&
            album.images &&
            album.images.length &&
            album.images[0].url && (
              <>
                <img
                  className="header__img"
                  src={album.images[0].url}
                  alt="Playlist Artwork"
                />
                <div>
                  <div className="header__overline">Album</div>
                  <h1 className="header__name">{album.name}</h1>
                  <p className="header__meta">
                    <span className="artists">
                      {album.artists.map((artist) => artist.name).join(", ")}
                    </span>
                    <span className="year">
                      {album.release_date.split("-")[0]}
                    </span>
                    <span className="songs">{album.total_tracks} songs</span>
                    <span className="time">
                      {getAlbumLength(album.tracks.items)}

                      {token && (
                        <>
                          {followed ? (
                            <button
                              onClick={() => {
                                unfollow("album", id)
                                setFollowed(false);
                                }}
                            >
                              Unfollow
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                follow("album", id);
                                setFollowed(true);
                              }}
                            >
                              Follow
                            </button>
                          )}
                        </>
                      )}
                    </span>
                  </p>
                </div>
              </>
            )}
        </div>
      </StyledHeader>
      <main>
        <SectionWrapper title="Tracks">
          {tracks && <TrackList tracks={tracks} />}
        </SectionWrapper>
      </main>
    </div>
  );
};

export default Album;
