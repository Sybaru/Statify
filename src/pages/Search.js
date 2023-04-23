import React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { search } from "../Spotify/spotifyGen";
import { catchErrors } from "../utils";
import {
  TextField,
  ThemeProvider,
  createTheme,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
  PlaylistsGrid,
  SectionWrapper,
  ArtistsGrid,
  AlbumGrid,
  TrackList,
} from "../components";

export default function Search() {
  const navigate = useNavigate();
  const { query } = useParams(null);
  const [searchResults, setSearchResults] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const searchSpotify = async () => {
    const { data } = await search(searchQuery);
    setSearchResults(data);
    navigate(`/search/${searchQuery}`);
  };

  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlekeyPress = (e) => {
    if (e.key === "Enter") {
      searchSpotify();
    }
  };

  useEffect(() => {
    if (query) {
      catchErrors(search(query).then((res) => setSearchResults(res.data)));
      setSearchQuery(query);
    }
  }, [query]);

  return (
    <main>
      <header>
        <ThemeProvider theme={searchTheme}>
          <TextField
            hiddenLabel
            id="outlined-basic"
            placeholder="Search Spotify"
            variant="filled"
            defaultValue={query ? query : ""}
            onChange={handleSearchInput}
            onKeyDown={handlekeyPress}
            size="small"
            sx={{
              width: "20vw",
              minWidth: "135px",
              position: "absolute",
              left: "130px",
              top: "13px",
              backgroundColor: "white",
              borderRadius: 25,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <button onClick={searchSpotify}>Search</button>
                </InputAdornment>
              ),
              disableUnderline: true,
            }}
          />
        </ThemeProvider>
      </header>
      <div>
        {searchResults && searchResults.artists && (
          <SectionWrapper title="Artists">
            <ArtistsGrid artists={searchResults.artists.items}/>
          </SectionWrapper>
        )}
        {searchResults && searchResults.albums && (
          <SectionWrapper title="Albums">
            <AlbumGrid albums={searchResults.albums.items} rows = "2"/>
          </SectionWrapper>
        )}
        {searchResults && searchResults.playlists && (
          <SectionWrapper title="Playlists">
            <PlaylistsGrid playlists={searchResults.playlists.items} rows = "2"/>
          </SectionWrapper>
        )}
        {searchResults && searchResults.tracks && (
          <SectionWrapper title="Tracks">
            <TrackList tracks={searchResults.tracks.items} />
          </SectionWrapper>
        )}
      </div>
    </main>
  );
}

const searchTheme = createTheme({
  palette: {
    primary: {
      main: "#1DB954",
    },
  },
});
