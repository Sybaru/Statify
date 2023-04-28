import { formatDuration } from "../utils";
import { StyledTrackList } from "../styles";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { catchErrors } from "../utils";
import UserInteract from "./UserInteract";

const TrackList = ({ users }) => {
  return (
    <>
      {users && users.length ? (
        <StyledTrackList>
          {users.map((user, i) => (
            <li className="track__item" key={i}>
              <div className="track__item__num">{i + 1}</div>
              <Link
                className="track__item__title-group"
                to={`/user/${user.spotify}`}
              >
                <div className="track__item__name-artist">
                  <div className="track__item__name overflow-ellipsis">
                    {user.spotify}
                  </div>
                </div>
              </Link>
              <div className="track__item__duration">
                <UserInteract mongoUser={user} />
              </div>
            </li>
          ))}
        </StyledTrackList>
      ) : (
        <p className="empty-notice">No users available</p>
      )}
    </>
  );
};

export default TrackList;
