import { useState, useEffect } from 'react';
import { getFollowedArtists } from '../Spotify/spotify';
import { catchErrors } from '../utils';
import { ArtistsGridWrap, SectionWrapper, TimeRangeButtons } from '../components';

const TopArtists = () => {
  const [followedArtists, setFollowedArtists] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getFollowedArtists();
      setFollowedArtists(data.artists.items);
    };

    catchErrors(fetchData());
  }, []);

  return (
    <main>
      <SectionWrapper title="Followed Artists" breadcrumb={true} returnlink="/profile">

        {followedArtists && followedArtists.items && (
          <ArtistsGridWrap artists={followedArtists.items} wr={true} />
        )}
      </SectionWrapper>
    </main>
  );
};

export default TopArtists;