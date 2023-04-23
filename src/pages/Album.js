import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAlbumById } from "../Spotify/spotifyGen";
import { catchErrors } from "../utils";
import { StyledHeader } from "../styles";
import { TrackList, SectionWrapper} from "../components";

const Album = () => {
  const { id } = useParams();
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
    return `${hours ? hours + " hours" : ""} ${minutes ? minutes + " min" : ""} ${
        seconds ? seconds + " sec" : ""
    }`;
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getAlbumById(id);
      if (data && data.name !== "AxiosError") {
        setAlbum(data);
        setTracks(data.tracks.items);
        document.title = data.name;
      }
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
                    <span className="time">{getAlbumLength(album.tracks.items)}</span>
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
