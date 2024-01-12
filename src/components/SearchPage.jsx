import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Form, Button } from "react-bootstrap";

function SearchPage() {
  const [city, setCity] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/weather/${city}`);
  };

  return (
    <Form onSubmit={handleSearch}>
      <Form.Group>
        <Form.Label>City</Form.Label>
        <Form.Control
          type="text"
          placeholder="Search for a city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Go!
      </Button>
    </Form>
  );
}

export default SearchPage;
