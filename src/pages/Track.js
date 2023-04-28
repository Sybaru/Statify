import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { accessToken } from "../Spotify/spotify";
import { getTrackbyId, getTrackRecommendations } from "../Spotify/spotifyGen";
import MakeReview from "../components/MakeReview";
import { getItemReviews } from "../mongo";
import { catchErrors } from "../utils";
import { StyledHeader } from "../styles";
import {
  PlaylistsGrid,
  SectionWrapper,
  Loader,
  TrackList,
  ReviewList,
} from "../components";

export default function Track() {
  const { id } = useParams();
  const [track, setTrack] = useState(null);
  const [recommendations, setRecommendations] = useState({ tracks: [] });
  const [reviews, setReviews] = useState(null);

  const getTrackLength = (track) => {
    let totalDuration = track.duration_ms;
    const minutes = Math.floor(totalDuration / 60000);
    const seconds = ((totalDuration % 60000) / 1000).toFixed(0);
    return ` ${minutes ? minutes + ":" : ""}${seconds ? seconds + "" : ""}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getTrackbyId(id);
      setTrack(data);
      if (data && data.name !== "AxiosError") {
        document.title = data.name;
      }
      const { data: recommendations } = await getTrackRecommendations(data.id);
      setRecommendations(recommendations);

      if (id) {
        const reviews = await getItemReviews(id, "track");
        setReviews(reviews);
      }

      console.log(id);
    };

    catchErrors(fetchData());
  }, [id]);

  return (
    <>
      {track && (
        <>
          <StyledHeader>
            <div className="header__inner">
              {track.album.images.length && track.album.images[0].url && (
                <img
                  className="header__img"
                  src={track.album.images[0].url}
                  alt="Avatar"
                />
              )}
              <div>
                <div className="header__overline">Track</div>
                <h1 className="header__name">{track.name}</h1>
                <p className="header__meta">
                  <span className="artists">
                    {track.artists.map((artist) => artist.name).join(", ")}
                  </span>
                  <span className="year">
                    {track.album.release_date.split("-")[0]}
                  </span>
                  <span className="time">{getTrackLength(track)}</span>
                </p>
              </div>
            </div>
          </StyledHeader>
          <main>
            <SectionWrapper title="Similar Tracks">
              <TrackList tracks={recommendations.tracks.slice(0, 10)} />
            </SectionWrapper>
            <SectionWrapper title="Reviews">
              <MakeReview type={"track"} item={track} />
              <ReviewList reviews={reviews} />
            </SectionWrapper>
          </main>
        </>
      )}
    </>
  );
}
