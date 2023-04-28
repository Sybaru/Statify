import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { catchErrors } from "../utils";
import { StyledHeader } from "../styles";
import { Loader, SectionWrapper, TrackList, AlbumGrid } from "../components";
import {
  getArtistById,
  getArtistTopTracks,
  getArtistAlbums,
} from "../Spotify/spotifyGen";
import {
  follow,
  unfollow,
  accessToken,
  checkFollowing,
} from "../Spotify/spotify";

const Artist = () => {
  const { id } = useParams();
  const [token, setToken] = useState(accessToken);
  const [followed, setFollowed] = useState(false);
  const [artist, setArtist] = useState();
  const [topTracks, setTopTracks] = useState(null);
  const [albums, setAlbums] = useState(null);

  const removeDuplicates = (arr) => {
    var map = new Map(arr.map((o) => [o.name, o]));
    return [...map.values()];
  };

  useEffect(() => {
    setToken(accessToken);

    const fetchData = async () => {
      const { data } = await getArtistById(id);
      setArtist(data);
      if (data && data.name !== "AxiosError") {
        document.title = data.name;
      }

      const isFollowing = await checkFollowing("artist", id);
      setFollowed(isFollowing.data[0]);

      const artistTopTracks = await getArtistTopTracks(id);
      setTopTracks(artistTopTracks.data);

      const artistAlbums = await getArtistAlbums(id);
      setAlbums(artistAlbums.data);
      console.log("request");
    };

    catchErrors(fetchData());
  }, [id]);

  return (
    <div>
      <>
        <>
          <StyledHeader type="user">
            {artist ? (
              <div className="header__inner">
                {artist.images &&
                artist.images.length &&
                artist.images[0].url ? (
                  <img
                    className="header__img"
                    src={artist.images[0].url}
                    alt="Avatar"
                  />
                ) : (
                  <img className="header__img" src="default.jpg" alt="Avatar" />
                )}
                <div>
                  <div className="header__overline">Artist</div>
                  <h1 className="header__name">{artist.name}</h1>
                  <p className="header__meta">
                    <span>
                      {artist.followers ? (
                        <>
                          {artist.followers.total.toLocaleString("en-US")}{" "}
                          Follower
                          {artist.followers.total !== 1 ? "s" : ""}
                        </>
                      ) : (
                        <>0 Followers</>
                      )}
                      {token ? (
                        <>
                          {followed ? (
                            <button
                              onClick={() => {
                                catchErrors(unfollow(id, "artist"));
                                setFollowed(false);
                              }}
                              style={{ marginLeft: "1rem" }}
                            >
                              Following
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                catchErrors(follow(id, "artist"));
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
            ) : (
              <>
                <Loader />
              </>
            )}
          </StyledHeader>

          <main>
            {topTracks && albums && topTracks.tracks && albums.items ? (
              <>
                <SectionWrapper title="Popular">
                  <TrackList tracks={topTracks.tracks.slice(0, 5)} />
                </SectionWrapper>
                <SectionWrapper title="Albums">
                  <AlbumGrid albums={removeDuplicates(albums.items)} />
                </SectionWrapper>
              </>
            ) : (
              <Loader />
            )}
          </main>
        </>
      </>
    </div>
  );
};

export default Artist;
