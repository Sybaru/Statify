import styled from 'styled-components/macro';

const StyledHeader = styled.header`
  display: flex;
  align-items: flex-end;
  position: relative;
  background: linear-gradient(transparent, rgba(0,0,0,0.5));
  background-color: var(--grey);
  height: 30vh;
  max-height: 500px;
  min-height: 250px;

  @media (min-width: 768px) {
    min-height: 340px;
  }

  &:after {
    content: '';
    display: block;
    width: 100%;
    height: 20vh;
    background-color: var(--grey);
    background-image: linear-gradient(rgba(0,0,0,0.6), var(--black));
    position: absolute;
    top: 100%;
    z-index: -1;
  }

  .header__inner {
    display: flex;
    align-items: flex-end;
    position: absolute;
    width: 100%;
    max-width: var(--site-max-width);
    min-width: 0;
    margin: 0 auto;
    padding: var(--spacing-lg) var(--spacing-md);

    @media (min-width: 768px) {
      padding: var(--spacing-xl) var(--spacing-xxl);
    }
  }

  img.header__img {
    object-fit: cover;
    position: relative;
    width: 250px;
    min-width: 250px;
    height: 250px;
    margin-right: var(--spacing-lg);
    box-shadow: 0 4px 60px rgb(0 0 0 / 50%);
    background-color: var(--dark-grey);
    border-radius: ${props => props.type === 'user' ? '50%' : '0'};

    @media (min-width: 768px) {
      margin-right: var(--spacing-xxl);
    }
  }

  .header__overline {
    text-transform: uppercase;
    position: relative;
    top: -75px;
    font-size: var(--fz-xxs);
    font-weight: 700;
  }

  h1.header__name {
    font-size: clamp(20px, 10vw, 5rem);
    font-weight: 900;
    line-height: 1;
    margin: 10 0 0 0;
    position: relative;
    top: -50px;
    white-space: nowrap; 
    outline: 0px solid transparent;
    width: 50vw;

    @media (min-width: 768px) {
      margin: 0 0 0 -5px;
    }
  }

  .header__meta {
    display: flex;
    align-items: center;
    font-size: var(--fz-sm);
    color: var(--light-grey);
    margin: 0;

    span {
      display: flex;
      align-items: center;

      &:not(:last-of-type)::after {
        content: '•';
        display: block;
        margin: 0 var(--spacing-xs);
        color: var(--light-grey);
        font-size: 8px;
      }
    }
  }

  .artists {
    font-weight: bold;
    color: var(--white);
  }

  .year {
    font-weight: bold;
    color: var(--white);
  }

  .songs {
    font-weight: bold;
    color: var(--white);
  }

  .edit__button {
    position: relative;
    margin-left: 20px;

  }
`;

export default StyledHeader;