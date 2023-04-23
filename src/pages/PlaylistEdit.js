import { useState, useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { catchErrors, convertImageToJpeg } from "../utils";
import {
  getPlaylistById,
  getAudioFeaturesForTracks,
} from "../Spotify/spotifyGen";
import {
  accessToken,
  getCurrentUserProfile,
  editPlaylist,
  editPlaylistImage,
} from "../Spotify/spotify";
import { StyledHeader, StyledDropdown } from "../styles";
import { TrackList, SectionWrapper } from "../components";
import axios from "axios";
import styled from "styled-components";

const PlaylistEdit = () => {
  const { id } = useParams();
  const [token, setToken] = useState(accessToken);
  const [profile, setProfile] = useState(null);
  const [playlist, setPlaylist] = useState(null);
  const [tracksData, setTracksData] = useState(null);
  const [tracks, setTracks] = useState(null);
  const [audioFeatures, setAudioFeatures] = useState(null);
  const [sortValue, setSortValue] = useState("");
  const sortOptions = ["danceability", "tempo", "energy"];
  const [selectedImage, setSelectedImage] = useState("/defaultplaylist.png");
  const [playlistName, setPlaylistName] = useState("Playlist");
  const [newName, setNewName] = useState("Playlist");
  const hiddenFileInput = useRef(null);
  const validImageTypes = ["image/gif", "image/jpeg", "image/png"];

  const upload = async (image) => {
    const uploadImage = image.split(",")[1];
    editPlaylistImage(id, uploadImage);
  };

  const uploadImage = async () => {
    convertImageToJpeg(selectedImage, upload);
  };

  const handleEdit = () => {
    console.log(selectedImage);
    if (selectedImage !== "/defaultplaylist.png") {
      uploadImage();
    }

    editPlaylist(id, newName);
  };

  const handleNameChange = (e) => {
    if (e.currentTarget.textContent !== playlistName) {
      setNewName(e.currentTarget.textContent);
    }
  };

  const handleImage = () => {
    hiddenFileInput.current.click();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!validImageTypes.includes(file.type)) {
      alert("Please select a valid Image file");
      return;
    }
    setSelectedImage(URL.createObjectURL(file));
  };

  const tracksWithAudioFeatures = useMemo(() => {
    if (!tracks || !audioFeatures) {
      return null;
    }

    return tracks.map(({ track }) => {
      const trackToAdd = track;

      if (!track.audio_features) {
        const audioFeaturesObj = audioFeatures.find((item) => {
          if (!item || !track) {
            return null;
          }
          return item.id === track.id;
        });

        trackToAdd["audio_features"] = audioFeaturesObj;
      }

      return trackToAdd;
    });
  }, [tracks, audioFeatures]);

  const sortedTracks = useMemo(() => {
    if (!tracksWithAudioFeatures) {
      return null;
    }

    return [...tracksWithAudioFeatures].sort((a, b) => {
      const aFeatures = a["audio_features"];
      const bFeatures = b["audio_features"];

      if (!aFeatures || !bFeatures) {
        return false;
      }

      return bFeatures[sortValue] - aFeatures[sortValue];
    });
  }, [sortValue, tracksWithAudioFeatures]);

  const removeDuplicates = (arr) => {
    var map = new Map(arr.map((o) => [o.id, o]));
    return [...map.values()];
  };

  useEffect(() => {
    setToken(accessToken);

    if (!token) {
      window.location.href = `/playlist/${id}`;
    }

    const fetchData = async () => {

      const { data } = await getCurrentUserProfile();
      setProfile(data);
      if (data.id !== playlist.owner.id) {
        window.location.href = `/playlist/${id}`;
      }
    };

    catchErrors(fetchData());
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getPlaylistById(id);
      setPlaylist(data);
      setTracksData(data.tracks);
      if (data.images[0] !== undefined) {
        setSelectedImage(data.images[0].url);
      }
      if (data.name !== undefined) {
        setPlaylistName(data.name);
      }
      if (data && data.name !== "AxiosError") {
        document.title = data.name;
      }
      console.log("request");
    };

    catchErrors(fetchData());
  }, [id]);

  useEffect(() => {
    if (!tracksData) {
      return;
    }

    const fetchMoreData = async () => {
      if (tracksData.next) {
        const { data } = await axios.get(tracksData.next);
        setTracksData(data);
      }
    };
    setTracks((tracks) => [...(tracks ? tracks : []), ...tracksData.items]);
    catchErrors(fetchMoreData());

    const fetchAudioFeatures = async () => {
      const ids = tracksData.items.map(({ track }) => track.id).join(",");
      const { data } = await getAudioFeaturesForTracks(ids);
      setAudioFeatures((audioFeatures) => [
        ...(audioFeatures ? audioFeatures : []),
        ...data["audio_features"],
      ]);
    };
    catchErrors(fetchAudioFeatures());
  }, [tracksData]);

  return (
    <>
      {playlist && (
        <>
          <StyledHeader>
            <div className="header__inner">
              <StyledImageButton onClick={handleImage}>
                <img
                  className="header__img"
                  src={selectedImage}
                  alt="Playlist Artwork"
                />
              </StyledImageButton>
              <input
                type="file"
                ref={hiddenFileInput}
                onChange={(event) => {
                  handleImageUpload(event);
                }}
                style={{ display: "none" }}
              />
              <div>
                <div className="header__overline">Playlist</div>
                <div>
                  <h1
                    className="header__name edit__name"
                    contentEditable="true"
                    onInput={(e) =>
                      handleNameChange(e)
                    }
                  >
                    {playlistName}
                  </h1>
                </div>

                <p className="header__meta">
                  {playlist.owner.display_name ? (
                    <span className="artists">
                      {playlist.owner.display_name}{" "}
                    </span>
                  ) : null}
                  <span>
                    {playlist.tracks.total}{" "}
                    {`song${playlist.tracks.total !== 1 ? "s" : ""}`}
                    <button className="edit__button" onClick={handleEdit}>
                      Save
                    </button>
                  </span>
                </p>
              </div>
            </div>
          </StyledHeader>

          <main>
            <SectionWrapper title="Playlist" breadcrumb={true}>
              <StyledDropdown active={!!sortValue}>
                <label className="sr-only" htmlFor="order-select">
                  Sort tracks
                </label>
                <select
                  name="track-order"
                  id="order-select"
                  onChange={(e) => setSortValue(e.target.value)}
                >
                  <option className="dropdown__option" value="">
                    Sort tracks
                  </option>
                  {sortOptions.map((option, i) => (
                    <option className="dropdown__option" value={option} key={i}>
                      {`${option.charAt(0).toUpperCase()}${option.slice(1)}`}
                    </option>
                  ))}
                </select>
              </StyledDropdown>
              {sortedTracks && (
                <TrackList tracks={removeDuplicates(sortedTracks)} />
              )}
            </SectionWrapper>
          </main>
        </>
      )}
    </>
  );
};

export default PlaylistEdit;

const StyledImageButton = styled.button`
  border: 0;
  cursor: pointer;
  font-family: inherit;
  border-radius: var(--border-radius-pill);
  background-color: rgba(0, 0, 0, 0.7);
  color: var(--white);
  font-size: var(--fz-sm);
  font-weight: 700;
  width: 275px;
  margin-right: var(--spacing-lg);

  &:hover {
    background-color: var(--dark-grey);
    outline: 0;
  }
`;
