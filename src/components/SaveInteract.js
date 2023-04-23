import { accessToken } from "../Spotify/spotify";
import { saveTrack, removeTrack } from "../Spotify/spotify";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import {
  faHeart as faHeartSolid,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
import { catchErrors } from "../utils";

const SaveInteract = ({ track, saved }) => {
  const [token, setToken] = useState();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setToken(accessToken);

    setIsSaved(saved);

  }, [saved]);

  const handleClick = (track) => () => {
    var res = "";
    if (isSaved) {
      res = removeTrack(track.id);
    } else {
      res = saveTrack(track.id);
    }
    console.log("res");
    setIsSaved(!isSaved);
  };

  const promptLogin = () => () => {
    alert("Please login to save tracks");
  };

  return (
    <>
      {token ? (
        <button
          className="track__item__interact"
          onClick={handleClick(track)}
          style={{ padding: "0px" }}
        >
          {!isSaved ? (
            <FontAwesomeIcon icon={faHeart} />
          ) : (
            <FontAwesomeIcon icon={faHeartSolid} style={{ color: "#1ed760" }} />
          )}
        </button>
      ) : (
        <>
          <button
            className="track__item__interact"
            style={{ padding: "0px" }}
            onClick={promptLogin()}
          >
            <FontAwesomeIcon icon={faHeart} />
          </button>
        </>
      )}
    </>
  );
};

export default SaveInteract;
