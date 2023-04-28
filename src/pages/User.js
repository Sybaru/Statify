import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  follow,
  unfollow,
  accessToken,
  checkFollowing,
} from "../Spotify/spotify";
import { getUser, getUserPLaylists } from "../Spotify/spotifyGen";
import { catchErrors } from "../utils";
import { StyledHeader } from "../styles";
import { getUserReviews } from "../mongo";
import {
  PlaylistsGrid,
  SectionWrapper,
  Loader,
  ReviewList,
} from "../components";

export default function User() {
  const { id } = useParams();
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [userPlaylists, setUserPlaylists] = useState(null);
  const [followed, setFollowed] = useState(false);
  const [reviews, setReviews] = useState(null);

  useEffect(() => {
    setToken(accessToken);

    const fetchData = async () => {
      const { data } = await getUser(id);
      setUser(data);
      if (data && data.name !== "AxiosError") {
        document.title = `${data.display_name}'s Profile`;
      }

      const isFollowing = await checkFollowing("user", id);
      setFollowed(isFollowing.data[0]);

      const userPlaylists = await getUserPLaylists(id);
      setUserPlaylists(userPlaylists.data);

      const reviews = await getUserReviews(id);
      setReviews(reviews);
      console.log("req");
    };

    catchErrors(fetchData());
  }, [id]);

  return (
    <>
      {user && (
        <>
          <StyledHeader type="user">
            <div className="header__inner">
              {user.images.length && user.images[0].url ? (
                <img
                  className="header__img"
                  src={user.images[0].url}
                  alt="Avatar"
                />
              ) : (
                <img className="header__img" src="/default.jpg" alt="Avatar" />
              )}
              <div>
                <div className="header__overline">Profile</div>
                <h1 className="header__name">{user.display_name}</h1>
                <p className="header__meta">
                  {user && (
                    <span>
                      {user.total} Playlist
                      {user.total !== 1 ? "s" : ""}
                    </span>
                  )}
                  <span>
                    {user.followers.total} Follower
                    {user.followers.total !== 1 ? "s" : ""}
                    {token ? (
                      <>
                        {followed ? (
                          <button
                            onClick={() => {
                              catchErrors(unfollow(id, "user"));
                              setFollowed(false);
                            }}
                            style={{ marginLeft: "1rem" }}
                          >
                            Following
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              catchErrors(follow(id, "user"));
                              setFollowed(true);
                            }}
                            style={{ marginLeft: "1rem" }}
                          >
                            Follow
                          </button>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                  </span>
                </p>
              </div>
            </div>
          </StyledHeader>

          <main>
            {userPlaylists ? (
              <>
                <SectionWrapper
                  title="Public Playlists"
                  seeAllLink="/playlists"
                >
                  <PlaylistsGrid playlists={userPlaylists.items.slice(0, 10)} />
                </SectionWrapper>
                <SectionWrapper title="Reviews">
                  <ReviewList reviews={reviews} />
                </SectionWrapper>
              </>
            ) : (
              <Loader />
            )}
          </main>
        </>
      )}
    </>
  );
}
