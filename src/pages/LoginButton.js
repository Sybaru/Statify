import styled from "styled-components/macro";
import { API_BASE } from "../Spotify/spotifyGen";

const StyledLoginButton = styled.a`
  display: inline-block;
  background-color: var(--green);
  color: var(--white);
  border-radius: var(--border-radius-pill);
  font-weight: 700;
  font-size: var(--fz-lg);
  padding: var(--spacing-sm) var(--spacing-xl);

  &:hover,
  &:focus {
    text-decoration: none;
    filter: brightness(1.1);
  }
`;

const LoginButton = (text) => (
  <StyledLoginButton href={API_BASE + "/login"}>
    {!text.text ? (
      <>
        <span>Log in with Spotify </span>
      </>
    ) : (
      <span>{text.text}</span>
    )}
  </StyledLoginButton>
);

export default LoginButton;
