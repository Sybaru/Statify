import "./App.css";
import { Sidebar } from "./components";
import Body from "./pages/Body";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { useEffect } from "react";
import styled from "styled-components";
import { GlobalStyle } from "./styles";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Container className="app">
      <GlobalStyle />
      <div className="spotify__body">
        <Router>
          <ScrollToTop />
          <Sidebar />
          <div className="body__contents">
            <Body />
          </div>
        </Router>
      </div>
    </Container>
  );
}

const Container = styled.div`
  max-width: 100vw;
  max-height: 100vh;
  display: grid;
  grid-template-rows: 100vh 0vh;
  .spotify__body {
    display: grid;
    grid-template-columns: 240px auto;
    height: 100%;
    width: 100%;
    .body {
      height: 100%;
      width: 100%;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 0.7rem;
        max-height: 2rem;
        &-thumb {
          background-color: rgba(255, 255, 255, 0.6);
        }
      }
    }
  }
`;

export default App;
