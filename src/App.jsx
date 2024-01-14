import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SearchBar } from "./components/SearchBar";
import { WeatherDetailPage } from "./components/WeatherDetailPage";
import { Col, Container, Row } from "react-bootstrap";
import { Welcome } from "./components/Welcome";
import { Footer } from "./components/Footer";

function App() {
  const [weatherId, setWeatherId] = useState(null);
  const [animateBackground, setAnimateBackground] = useState(false);

  useEffect(() => {
    setAnimateBackground(true);

    const timer = setTimeout(() => {
      setAnimateBackground(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [weatherId]);

  return (
    <Container
      fluid
      className={`d-flex justify-content-center align-items-center font-monospace vh-100 ${getBackgroundClass(
        weatherId
      )} ${animateBackground ? "fade-in-background" : ""}`}
    >
      <Row className="bg-dark bg-opacity-25 rounded pt-2 p-3 mx-1">
        <Col className="d-flex flex-column align-items-center">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Welcome />} />
            </Routes>
            <SearchBar />
            <Routes>
              <Route path="/weather/:city" element={<WeatherDetailPage setWeatherId={setWeatherId} />} />
            </Routes>
          </BrowserRouter>
        </Col>
      </Row>
      <Footer />
    </Container>
  );
}

function getBackgroundClass(id) {
  if (id >= 200 && id < 300) return "bg-thunder";
  if (id >= 300 && id < 400) return "bg-drizzle";
  if (id >= 500 && id < 600) return "bg-rain";
  if (id >= 600 && id < 700) return "bg-snow";
  if (id >= 700 && id < 800) return "bg-atmos";
  if (id == 800) return "bg-clear";
  if (id > 800 && id < 900) return "bg-clouds";
  return "bg-start";
}

export default App;
