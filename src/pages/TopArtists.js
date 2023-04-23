import { useState, useEffect } from 'react';
import { getTopArtists } from '../Spotify/spotify';
import { catchErrors } from '../utils';
import { ArtistsGridWrap, SectionWrapper, TimeRangeButtons } from '../components';

const TopArtists = () => {
  const [topArtists, setTopArtists] = useState(null);
  const [activeRange, setActiveRange] = useState('short');

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getTopArtists(`${activeRange}_term`);
      setTopArtists(data);
    };

    catchErrors(fetchData());
  }, [activeRange]);

  return (
    <main>
      <SectionWrapper title="Top Artists" breadcrumb={true} returnlink="/profile">
        <TimeRangeButtons
          activeRange={activeRange}
          setActiveRange={setActiveRange}
        />

        {topArtists && topArtists.items && (
          <ArtistsGridWrap artists={topArtists.items} wr={true} />
        )}
      </SectionWrapper>
    </main>
  );
};

export default TopArtists;