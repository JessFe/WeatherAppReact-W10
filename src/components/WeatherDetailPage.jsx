import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Card, Container, Row, Col } from "react-bootstrap";

function WeatherDetailPage() {
  const { city } = useParams();
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // api
  const apiKey = "1a8f2f303043e63ebf047e72a70095ba";

  // kelv cels
  const kelvinToCelsius = (kelvin) => (kelvin - 273.15).toFixed(2);

  // conv time
  const timeToLocaleTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString();
  };

  const getDailyForecasts = (forecasts) => {
    const dailyForecasts = [];
    const processedDays = new Set();
    const today = new Date().getUTCDate(); // oggi

    for (const forecast of forecasts.list) {
      const date = new Date(forecast.dt * 1000);
      const day = date.getUTCDate();

      if (day !== today && !processedDays.has(day)) {
        processedDays.add(day);
        dailyForecasts.push(forecast);

        // 3gg
        if (dailyForecasts.length === 3) break;
      }
    }

    return dailyForecasts;
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      try {
        // chiamata geocoding
        const geocodingResponse = await fetch(
          `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
        );
        const [locationData] = await geocodingResponse.json();

        // controllo x geocoding
        if (locationData) {
          // chiamata api principale
          const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${locationData.lat}&lon=${locationData.lon}&appid=${apiKey}`
          );
          const weatherData = await weatherResponse.json();
          setWeatherData(weatherData);

          // chiamata api previsioni
          const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${locationData.lat}&lon=${locationData.lon}&appid=${apiKey}`
          );
          const forecastData = await forecastResponse.json();
          setForecastData(forecastData);
        }
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
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
          <p>hum: {weatherData.main.humidity}%</p>
          <p>w: {weatherData.weather[0].description}</p>
          <p>Sunrise: {timeToLocaleTime(weatherData.sys.sunrise)}</p>
          <p>Sunset: {timeToLocaleTime(weatherData.sys.sunset)}</p>
        </div>
      )}
      <h2>Previsioni dei prossimi 3 giorni</h2>
      {forecastData &&
        getDailyForecasts(forecastData).map((forecast, index) => (
          <div key={index}>
            <p>Giorno: {new Date(forecast.dt * 1000).toLocaleDateString()}</p>
            <p>Temperatura: {kelvinToCelsius(forecast.main.temp)}°C</p>
            <p>Temperatura Minima: {kelvinToCelsius(forecast.main.temp_min)}°C</p>
            <p>Temperatura Massima: {kelvinToCelsius(forecast.main.temp_max)}°C</p>
            <p>Condizioni: {forecast.weather[0].description}</p>
          </div>
        ))}
    </div>
  );
}

export default WeatherDetailPage;
