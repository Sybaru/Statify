import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faUser,
  faMagnifyingGlass,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { getCurrentUserProfile } from "../Spotify/spotify";
import { user } from "../mongo";
import { useState, useEffect } from "react";
import { catchErrors } from "../utils";

const Sidebar = () => {
  const [mongoUser, setmongoUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getCurrentUserProfile();
      setProfile(data);

      if (data) {
        const data2 = await user(data.id);
        setmongoUser(data2);
      }
    };
    fetchData();
  }, []);

  return (
    <Container>
      <div className="top__links">
        <div className="logo">
          <img src="/statify2.png" alt="spotify" />
        </div>
        <ul>
          <li>
            <NavLink to="/" className="sidebar_item">
              <FontAwesomeIcon icon={faHouse} className="sidebar_icon" />
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/search" className="sidebar_item">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="sidebar_icon"
              />
              Search
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile" className="sidebar_item">
              <FontAwesomeIcon icon={faUser} className="sidebar_icon" />
              Profile
            </NavLink>
          </li>
          {mongoUser && mongoUser.admin && (
            <li>
              <NavLink to="/admin" className="sidebar_item">
                <FontAwesomeIcon icon={faLock} className="sidebar_icon" />
                Admin
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </Container>
  );
};

const Container = styled.div`
  background-color: black;
  color: #b3b3b3;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 240px;
  .top__links {
    display: flex;
    flex-direction: column;
    .logo {
      text-align: center;
      margin: 1rem 0;
      img {
        position: relative;
        right: 10%;
        max-inline-size: 60%;
        block-size: auto;
      }
    }
    ul {
      list-style-type: none;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
      .sidebar_item {
        display: flex;
        gap: 1rem;
        cursor: pointer;
        transition: 0.3s ease-in-out;
        text-decoration: none;
        font-size: 15px;
        font-weight: bold;
        &:hover {
          color: white;
        }
      }
      .sidebar_item.active {
        color: white;
      }
      .sidebar_icon {
        font-size: 20px;
      }
    }
  }
`;

export default Sidebar;
