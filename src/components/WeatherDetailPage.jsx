import React, { useState, useEffect } from "react";
import { useParams } from "react-router";

function WeatherDetailPage() {
  const { city } = useParams();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // api
  const apiKey = "1a8f2f303043e63ebf047e72a70095ba";

  // kelv cels
  const kelvinToCelsius = (kelvin) => (kelvin - 273.15).toFixed(2);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // chiamata geocoding
        const geocodingResponse = await fetch(
          `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
        );
        const [locationData] = await geocodingResponse.json();

        // chiamata api principale
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${locationData.lat}&lon=${locationData.lon}&appid=${apiKey}`
        );
        const weatherData = await weatherResponse.json();

        setWeatherData(weatherData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [city, apiKey]);

  if (loading) return <div>Loading..</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{city}</h1>
      {weatherData && (
        <div>
          <p>T now: {kelvinToCelsius(weatherData.main.temp)}°C</p>
          <p>T min: {kelvinToCelsius(weatherData.main.temp_min)}°C</p>
          <p>T max: {kelvinToCelsius(weatherData.main.temp_max)}°C</p>
          <p>w: {weatherData.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}

export default WeatherDetailPage;
