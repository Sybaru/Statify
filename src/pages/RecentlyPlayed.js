import { useState, useEffect } from "react";
import { getRecentlyPlayed, accessToken } from "../Spotify/spotify";
import { catchErrors } from "../utils";
import { SectionWrapper, TrackList } from "../components";

const RecentlyPlayed = () => {
  const [token, setToken] = useState(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getRecentlyPlayed(50);
      setRecentlyPlayed(data.items);
    };

    catchErrors(fetchData());
  }, []);

  return (
    <main>
      <SectionWrapper title="Recently Played" breadcrumb={true} returnlink="/profile">
        {recentlyPlayed && (
          <TrackList tracks={recentlyPlayed.map((o) => o.track)} />
        )}
      </SectionWrapper>
    </main>
  );
};

export default RecentlyPlayed;
