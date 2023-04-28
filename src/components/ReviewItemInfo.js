import { useState, useEffect } from "react";
import { catchErrors } from "../utils";
import { getTrackbyId, getAlbumById } from "../Spotify/spotifyGen";
import { Link } from "react-router-dom";

const ReviewItemInfo = ({ review }) => {
  const type = review.type;
  const [track, setTrack] = useState(null);
  const [album, setAlbum] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (type === "track") {
        const { data } = await getTrackbyId(review.reviewedId);
        setTrack(data);
      } else if (type === "album") {
        const { data } = await getAlbumById(review.reviewedId);
        setAlbum(data);
      }
      console.log("req");
    };
    catchErrors(fetchData());
  }, [type, review.reviewedId]);

  return (
    <>
      {type === "track" && track && (
        <Link to={`/track/${review.reviewedId}`} className="review__item__info">
          <div className="review__item__info">
            <div className="review__item__info__img">
              <img src={track.album.images[0].url} alt="Album Art" />
            </div>
            <div className="review__item__info__text">
              <h3>{track.name}</h3>
              <p>{track.artists[0].name}</p>
            </div>
          </div>
        </Link>
      )}
      {type === "album" && album && (
        <Link to={`/album/${review.reviewedId}`} className="review__item__info">
          <div className="review__item__info">
            <div className="review__item__info__img">
              <img src={album.images[0].url} alt="Album Art" />
            </div>
            <div className="review__item__info__text">
              <h3>{album.name}</h3>
              <p>{album.artists[0].name}</p>
            </div>
          </div>
        </Link>
      )}
    </>
  );
};

export default ReviewItemInfo;
