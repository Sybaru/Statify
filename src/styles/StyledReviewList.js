import styled from "styled-components/macro";

const StyledReviewList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  .review__item {
    display: grid;
    align-items: center;
    grid-template-columns: 200px 1fr;
    grid-gap: 50px;
    padding: var(--spacing-xs);
    color: var(--light-grey);
    font-size: var(--fz-sm);
    border-radius: var(--border-radius-subtle);
    transition: background-color 0.3s ease;
    cursor: default;

    &:hover,
    &:focus {
      background-color: var(--dark-grey);
    }

    @media (max-width: 900px) {
        grid-template-columns: 75px 75px 1fr;
    }
  }

  .review__item__title-group {
    display: flex;
    align-items: center;
  }

  .review__item__img {
    margin-right: var(--spacing-sm);
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    background-color: var(--dark-grey);
  }

  .review__item__name {
    color: var(--white);
    font-size: var(--fz-md);
  }

  .review__item__item {
    display: block;
    white-space: nowrap;
  }

  .review__item__duration {
    display: none;

    @media (min-width: 768px) {
      display: flex;
      justify-content: flex-end;
      font-variant-numeric: tabular-nums;
    }
  }

  .review__item__interact {
    justify-content: flex-end;
    font-variant-numeric: tabular-nums;
    margin-right: 10px;
  }
  .review__item__rec{
    color: var(--white);
    font-size: var(--fz-md);
  }
`;

export default StyledReviewList;
