import { Link } from 'react-router-dom';
import { StyledGrid } from '../styles';

const AlbumGrid = ({ albums }) => (
  <>
    {albums && albums.length ? (
      <StyledGrid>
        {albums.map((album, i) => (
          <li className="grid__item" key={i}>
            <Link className="grid__item__inner" to={`/album/${album.id}`}>
              {album.images.length && album.images[0] && (
                <div className="grid__item__img">
                  <img src={album.images[0].url} alt={album.name} />
                </div>
              )}
              <h3 className="grid__item__name overflow-ellipsis">{album.name}</h3>
              <p className="grid__item__label">Album</p>
            </Link>
          </li>
        ))}
      </StyledGrid>
    ) : (
      <p className="empty-notice">No albums available</p>
    )}
  </>
);

export default AlbumGrid;