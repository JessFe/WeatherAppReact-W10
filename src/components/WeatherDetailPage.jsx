import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Row, Col } from "react-bootstrap";
import { Droplet, GeoAlt, Sunrise, Sunset, Wind } from "react-bootstrap-icons";
import { CollapsibleText } from "./CollapsibleText";

function WeatherDetailPage({ setWeatherId }) {
  const { city } = useParams();
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // api
  const apiKey = "cc442d8e1aa8678d9173b2404746f36d";

  // kelv cels
  const kelvinToCelsius = (kelvin) => (kelvin - 273.15).toFixed(1);

  // conv time
  const timeToLocaleTime = (timestamp, timezoneOffsetInSeconds) => {
    const date = new Date(timestamp * 1000);

    const localTime = new Date(date.getTime() + timezoneOffsetInSeconds * 1000);

    // x formattare l'orario
    const timeOpt = {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    };

    return localTime.toLocaleTimeString("it-IT", timeOpt);
  };

  const getDailyForecasts = (forecasts) => {
    const dailyForecasts = [];
    const processedDays = new Set();
    const today = new Date().getUTCDate();

    for (const forecast of forecasts.list) {
      const date = new Date(forecast.dt * 1000);
      const day = date.getUTCDate();

      if (day !== today && !processedDays.has(day)) {
        processedDays.add(day);
        dailyForecasts.push(forecast);

        // opz forecast mobile
        if (
          (windowWidth < 375 && dailyForecasts.length === 2) ||
          (windowWidth >= 375 && windowWidth < 470 && dailyForecasts.length === 3) ||
          (windowWidth >= 470 && windowWidth < 576 && dailyForecasts.length === 4) ||
          dailyForecasts.length === 5
        ) {
          break;
        }
      }
    }

    return dailyForecasts;
  };

  const getShortWeekday = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-EN", { weekday: "short" });
  };

  // verificare se giorno o notte
  const isDaytime = (sunrise, sunset, currentTime) => {
    return currentTime >= sunrise && currentTime < sunset;
  };

  const capCityName = (cityName) => {
    return cityName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // gestione resize finestra
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [fadeIn, setFadeIn] = useState(false);
  useEffect(() => {
    setFadeIn(true);
  }, [city]);

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

          // aggiorna id meteo
          if (weatherData) {
            setWeatherId(weatherData.weather[0].id);
          }

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
    <div className={fadeIn ? "fade-in" : ""}>
      {weatherData && (
        <>
          <Row className="d-flex justify-content-between m-2">
            <Col className="d-flex flex-column align-items-start col-12 col-sm-auto bg-white bg-opacity-50 rounded me-0 me-sm-4 p-4 mb-3">
              <h2 className="fs-6 fw-bold opacity-75 brk-long-txt">
                <GeoAlt className="fs-5 my-2" /> {capCityName(city)}
              </h2>
              <div className="align-self-center text-center text-sm-start">
                <img
                  className="weather-icon my-2"
                  src={`${process.env.PUBLIC_URL}/assets/images/icons/weather/${
                    isDaytime(weatherData.sys.sunrise, weatherData.sys.sunset, Date.now() / 1000)
                      ? weatherData.weather[0].icon.replace("n", "d")
                      : weatherData.weather[0].icon.replace("d", "n")
                  }.png`}
                  alt="Weather icon"
                />
                <p className="d-inline fs-3 align-middle ms-3">{kelvinToCelsius(weatherData.main.temp)}°</p>
                <p className="fs-5 brk-long-txt">{weatherData.weather[0].description}</p>
                <p className="badge text-black fw-normal">
                  <span className="text-secondary">▲</span> {kelvinToCelsius(weatherData.main.temp_max)}°C |{" "}
                  <span className="text-secondary">▼</span> {kelvinToCelsius(weatherData.main.temp_min)}°C
                </p>
              </div>
            </Col>
            <Col className="d-none d-sm-flex align-items-end justify-content-end col-sm-auto bg-white bg-opacity-50 rounded ms-0 ms-sm-4 p-4 mb-3">
              <div className="text-end">
                <p>
                  <Droplet className="text-secondary fs-5" /> {weatherData.main.humidity}%
                </p>
                <p>
                  <Wind className="text-secondary fs-5" /> {(weatherData.wind.speed * 3.6).toFixed(1)} km/h
                </p>
                <p>
                  <span className="text-secondary">Feels like: </span>
                  {kelvinToCelsius(weatherData.main.feels_like)}°C
                </p>
                <p>
                  <Sunrise className="text-secondary fs-5" />{" "}
                  {timeToLocaleTime(weatherData.sys.sunrise, weatherData.timezone)}
                </p>
                <p>
                  <Sunset className="text-secondary fs-5" />{" "}
                  {timeToLocaleTime(weatherData.sys.sunset, weatherData.timezone)}
                </p>
              </div>
            </Col>

            <Col className="d-flex d-sm-none align-items-end justify-content-center col-sm-auto bg-white bg-opacity-50 rounded ms-0 ms-sm-4 mb-3">
              <CollapsibleText triggerText="More info">
                <div className="text-center m-2">
                  <p className="m-0">
                    <span className="text-secondary">Feels like: </span>
                    {kelvinToCelsius(weatherData.main.feels_like)}°C
                  </p>
                  <p className="m-0">
                    <Wind className="text-secondary fs-5" /> {(weatherData.wind.speed * 3.6).toFixed(1)} km/h |{" "}
                    <Droplet className="text-secondary fs-5" /> {weatherData.main.humidity}%
                  </p>
                  <p className="m-0">
                    <Sunrise className="text-secondary fs-5" />{" "}
                    {timeToLocaleTime(weatherData.sys.sunrise, weatherData.timezone)} |{" "}
                    <Sunset className="text-secondary fs-5" />{" "}
                    {timeToLocaleTime(weatherData.sys.sunset, weatherData.timezone)}
                  </p>
                </div>
              </CollapsibleText>
            </Col>
          </Row>
        </>
      )}
      <Row className="d-flex flex-column m-1">
        <Col>
          <h2 className="d-inline fs-4 text-shadow">Forecast</h2>
        </Col>
        <Col>
          <Row className="d-flex justify-content-between ">
            {forecastData &&
              getDailyForecasts(forecastData).map((forecast, index) => (
                <Col className="bg-white bg-opacity-50 text-center rounded m-2" key={index}>
                  <p className="fw-bold my-1">{getShortWeekday(forecast.dt)}</p>
                  <img
                    className="forecast-icon"
                    src={`${process.env.PUBLIC_URL}/assets/images/icons/weather/${forecast.weather[0].icon.replace(
                      "n",
                      "d"
                    )}.png`}
                    alt="Weather icon"
                  />
                  <p>{kelvinToCelsius(forecast.main.temp)}°C</p>
                </Col>
              ))}
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export { WeatherDetailPage };
