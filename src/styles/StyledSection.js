import styled from "styled-components/macro";

const StyledSection = styled.section`
  &:first-of-type {
    .section__inner {
      padding-top: 0;
    }
  }

  .section__inner {
    width: 100%;
    position: relative;
    padding: var(--spacing-lg) var(--spacing-md);

    @media (min-width: 768px) {
      padding: var(--spacing-xl) var(--spacing-xxl);
    }
  }

  .section__top {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
  }

  .section__heading {
    display: flex;
    margin: 0;
    font-size: var(--fz-xxl);
    margin-bottom: 5px;
  }

  .section__breadcrumb {
    display: flex;
    color: var(--light-grey);

    &::after {
      content: "/";
      display: block;
      margin: 0 var(--spacing-sm);
    }

    a {
      &:hover,
      &:focus {
        color: var(--white);
      }
    }
  }

  .section__sub {
    margin: 0;
    color: var(--light-grey);
    margin-bottom: 10px;
  }

  .section__see-all {
    display: flex;
    align-items: flex-end;
    text-transform: uppercase;
    color: var(--light-grey);
    font-size: var(--fz-xxs);
    font-weight: 700;
    letter-spacing: 0.1em;
    padding-bottom: 2px;
  }
`;

export default StyledSection;
