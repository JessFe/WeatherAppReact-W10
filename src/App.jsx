import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SearchPage from "./components/SearchPage";
import WeatherDetailPage from "./components/WeatherDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/weather/:city" element={<WeatherDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
