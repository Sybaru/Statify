import { StyledGrid } from "../styles";
import { Link } from "react-router-dom";

const ArtistsGrid = ({ artists, rows = 1 }) => {
  const gridRows = `repeat(${rows}, 1fr)`;

  return (
  <>
    {artists && artists.length ? (
      <StyledGrid type="artist" style={{gridTemplateRows : gridRows}}>
        {artists.map((artist, i) => (
          <li className="grid__item" key={i}>
            <Link className="grid__item__inner" to={`/artist/${artist.id}`}>
              {artist.images && artist.images[0] ? (
                <div className="grid__item__img">
                  <img src={artist.images[0].url} alt={artist.name} />
                </div>
              ) : (
                <div className="grid__item__img">
                  <img src="/default.jpg" alt={artist.name} />
                </div>
              )}
              <h3 className="grid__item__name overflow-ellipsis">
                {artist.name}
              </h3>
              <p className="grid__item__label">Artist</p>
            </Link>
          </li>
        ))}
      </StyledGrid>
    ) : (
      <p className="empty-notice">No artists available</p>
    )}
  </>
  );
};

export default ArtistsGrid;
