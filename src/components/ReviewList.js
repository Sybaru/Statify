import { formatDuration } from "../utils";
import { StyledReviewList } from "../styles";
import user from "../mongo";
import { accessToken, getCurrentUserProfile } from "../Spotify/spotify";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faHeartCrack } from "@fortawesome/free-regular-svg-icons";
import SaveInteract from "./SaveInteract";
import { useEffect, useState } from "react";
import { catchErrors } from "../utils";
import ReviewItemInfo from "./ReviewItemInfo";
import ReviewItemActions from "./ReviewItemActions";

const ReviewList = ({ reviews }) => {

  return (
    <>
      {reviews && reviews.length ? (
        <StyledReviewList>
          {reviews.map((review, i) => (
            <li className="review__item" key={i}>
              <div>
                <div className="review__item__item">
                  <ReviewItemInfo review={review} />
                </div>
              </div>
              <div>
                <Link
                  className="review__item__title-group"
                  to={`/user/${review.user}`}
                >
                  <div className="review__item__name-artist">
                    <div className="review__item__name overflow-ellipsis">
                      Review by: {review.user}
                    </div>
                  </div>
                </Link>
                {review.review}
                <br />
                <br />
                {review.liked ? (
                  <span className="review__item__rec">Recommended</span>
                ) : (
                  <span className="review__item__rec">Not Recommended</span>
                )}
                <br />
                <br />
                <ReviewItemActions editedReview={review} />
              </div>
            </li>
          ))}
        </StyledReviewList>
      ) : (
        <p className="empty-notice">No Reviews available</p>
      )}
    </>
  );
};

export default ReviewList;
