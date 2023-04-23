import { useState, useEffect } from "react";
import axios from "axios";
import {
  getCurrentUserPlaylists,
  createNewPlaylist,
  getCurrentUserProfile,
  accessToken,
} from "../Spotify/spotify";
import { catchErrors } from "../utils";
import { SectionWrapper, PlaylistsGridWrap } from "../components";

const Playlists = () => {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const [playlistsData, setPlaylistsData] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  const [newPlaylist, setNewPlaylist] = useState(null);

  const removeDuplicates = (arr) => {
    var map = new Map(arr.map((o) => [o.id, o]));
    return [...map.values()];
  };

  const handleCreateNewPlaylist = async () => {
    const { data } = await createNewPlaylist(profile.data.id);
    console.log(data);
    window.location.href = `/playlists/${data.id}`;
  };

  useEffect(() => {
    setToken(accessToken);

    const fetchData = async () => {
      const profile = await getCurrentUserProfile();
      setProfile(profile);

      const { data } = await getCurrentUserPlaylists();
      setPlaylistsData(data);

      console.log(data);
    };
    catchErrors(fetchData());
  }, []);

  useEffect(() => {
    if (!playlistsData) {
      return;
    }

    const fetchMoreData = async () => {
      if (playlistsData.next) {
        const { data } = await axios.get(playlistsData.next);
        setPlaylistsData(data);
      }
    };

    setPlaylists((playlists) => [
      ...(playlists ? playlists : []),
      ...playlistsData.items,
    ]);

    catchErrors(fetchMoreData());
  }, [playlistsData]);

  return (
    <main>
      <SectionWrapper title="Public Playlists" breadcrumb={true} returnlink="/profile">
        <button onClick={handleCreateNewPlaylist}>Create New Playlist</button>

        {playlists && <PlaylistsGridWrap playlists={removeDuplicates(playlists)} wr={true} />}
      </SectionWrapper>
    </main>
  );
};

export default Playlists;
