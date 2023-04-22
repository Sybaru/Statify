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

const Artist = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState();
  const [topTracks, setTopTracks] = useState(null);
  const [albums, setAlbums] = useState(null);

  const removeDuplicates = (arr) => {
    var map = new Map(arr.map((o) => [o.name, o]));
    return [...map.values()];
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getArtistById(id);
      setArtist(data);
      console.log(data);

      const artistTopTracks = await getArtistTopTracks(id);
      setTopTracks(artistTopTracks.data);
      console.log(artistTopTracks.data);

      const artistAlbums = await getArtistAlbums(id);
      setAlbums(artistAlbums.data);
      console.log(artistAlbums.data);
    };

    catchErrors(fetchData());
  }, []);

  return (
    <div>
      <>
        <>
          <StyledHeader type="user">
            {artist ? (
              <div className="header__inner">
                {artist.images &&
                  artist.images.length &&
                  artist.images[0].url && (
                    <img
                      className="header__img"
                      src={artist.images[0].url}
                      alt="Avatar"
                    />
                  )}
                <div>
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
