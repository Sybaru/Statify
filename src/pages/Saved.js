import { useState, useEffect } from "react";
import axios from "axios";
import { getCurrentUserSaved, getCurrentUserProfile } from "../Spotify/spotify";
import { catchErrors } from "../utils";
import { SectionWrapper, TrackList } from "../components";
import { StyledHeader } from "../styles";
import { Loader } from "../components";

const Saved = () => {
  const [savedTracksData, setSavedTracksData] = useState(null);
  const [profile, setProfile] = useState({ display_name: "Loading..." });
  const [savedTracks, setSavedTracks] = useState(null);

  const removeDuplicates = (arr) => {
    var map = new Map(arr.map((o) => [o.id, o]));
    return [...map.values()];
  };

  const countTracks = () => {
    let arr = removeDuplicates(savedTracks.map((a) => a.track));
    let count = 0;
    arr.forEach((item) => {
      count += 1;
    });
    return count;
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getCurrentUserSaved();
      setSavedTracksData(data);

      const { data: profileData } = await getCurrentUserProfile();
      setProfile(profileData);

      console.log("request");
    };
    catchErrors(fetchData());
  }, []);

  useEffect(() => {
    if (!savedTracksData) {
      return;
    }
    const fetchMoreData = async () => {
      if (savedTracksData.next) {
        const { data } = await axios.get(savedTracksData.next);
        setSavedTracksData(data);
      }
    };

    setSavedTracks((savedTracks) => [
      ...(savedTracks ? savedTracks : []),
      ...savedTracksData.items,
    ]);

    catchErrors(fetchMoreData());
  }, [savedTracksData]);

  return (
    <div>
      <StyledHeader>
        <div className="header__inner">
          <img
            className="header__img"
            src="/liked-songs.png"
            alt="Playlist Artwork"
          />
          <div>
            <div className="header__overline">Playlist</div>
            <h1 className="header__name">Liked Songs</h1>
            <p className="header__meta">
              <span className="artists">{profile.display_name}</span>
              <span className="artists">
                {savedTracks && (
                  <>
                    {countTracks()} {`song${countTracks() !== 1 ? "s" : ""}`}
                  </>
                )}
              </span>
            </p>
          </div>
        </div>
      </StyledHeader>
      <SectionWrapper>
        {savedTracks && (
          <TrackList
            tracks={removeDuplicates(savedTracks.map((a) => a.track))}
          />
        )}
      </SectionWrapper>
    </div>
  );
};

export default Saved;
