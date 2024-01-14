import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Form, Button } from "react-bootstrap";
import { House } from "react-bootstrap-icons";

function SearchBar() {
  const [city, setCity] = useState("");
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/weather/${city}`);
  };

  useEffect(() => {
    setFadeIn(true);
  }, []);

  return (
    <Form onSubmit={handleSearch} className={`d-flex align-items-center ${fadeIn ? "fade-in" : ""}`}>
      <a href="/">
        <House className="text-dark fs-4 rad-gradient" />
      </a>

      <Form.Group className="d-flex align-items-center">
        <Form.Control
          type="text"
          placeholder="| Search for a city.. "
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="bg-input m-3"
        />
      </Form.Group>
      <Button variant="outline-dark" type="submit" className="border-2 opacity-75 my-3">
        Go!
      </Button>
    </Form>
  );
}

export { SearchBar };
