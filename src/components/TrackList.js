import { formatDuration } from "../utils";
import { StyledTrackList } from "../styles";
import { accessToken, isTrackSaved } from "../Spotify/spotify";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import SaveInteract from "./SaveInteract";
import { useEffect, useState } from "react";
import { catchErrors } from "../utils";

const TrackList = ({ tracks }) => {
  const trackIds = tracks.map((track) => track.id);
  const [saved, setSaved] = useState(null);
  const [trackSize, setTrackSize] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (trackIds.length <= 50) {
        const res = await isTrackSaved(trackIds);
        if (res !== undefined) {
          setSaved(res.data);
          console.log(res.data);
        }
      } else {
        for (let i = 0; i < trackIds.length; i += 50) {
          var res = undefined;
          if (i + 50 > trackIds.length) {
            res = await isTrackSaved(trackIds.slice(i));
          } else {
            res = await isTrackSaved(trackIds.slice(i, i + 50));
          }
          if (res !== undefined) {
            setSaved(saved + res.data);
            console.log(res.data);
          }
        }
      }
    };

    setTrackSize(trackIds.length);
    catchErrors(fetchData());
  }, [trackIds.length]);

  return (
    <>
      {tracks && tracks.length ? (
        <StyledTrackList>
          {tracks.map((track, i) => (
            <li className="track__item" key={i}>
              <div className="track__item__num">{i + 1}</div>
              <Link
                className="track__item__title-group"
                to={`/track/${track.id}`}
              >
                {track.album &&
                  track.album.images.length &&
                  track.album.images[2] && (
                    <div className="track__item__img">
                      <img src={track.album.images[2].url} alt={track.name} />
                    </div>
                  )}
                <div className="track__item__name-artist">
                  <div className="track__item__name overflow-ellipsis">
                    {track.name}
                  </div>
                  <div className="track__item__artist overflow-ellipsis">
                    {track.artists.map((artist, i) => (
                      <span key={i}>
                        {artist.name}
                        {i !== track.artists.length - 1 && ", "}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
              <div className="track__item__album overflow-ellipsis">
                {track.album && <>{track.album.name}</>}
              </div>
              <div className="track__item__duration">
                {saved ? <SaveInteract track={track} saved={saved[i]} /> : null}
                {formatDuration(track.duration_ms)}
              </div>
            </li>
          ))}
        </StyledTrackList>
      ) : (
        <p className="empty-notice">No tracks available</p>
      )}
    </>
  );
};

export default TrackList;
