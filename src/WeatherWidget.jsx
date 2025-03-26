"use client";

import { useState, useEffect } from "react";
import "./WeatherWidget.css";

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState("서울");

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              const MY_API_KEY = "cc8fc50faefca217efc4aa07af3753ef";

              const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${MY_API_KEY}&units=metric&lang=kr`
              );

              if (!response.ok) {
                throw new Error("날씨 정보를 가져오는데 실패했습니다.");
              }

              const data = await response.json();
              setWeather(data);
              setLocation(data.name);
              setLoading(false);
            },
            async (err) => {
              console.error("위치 정보를 가져오는데 실패했습니다:", err);

              // 위치 정보를 가져오지 못한 경우 기본 위치(서울)의 날씨 정보 가져오기
              const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=YOUR_API_KEY&units=metric&lang=kr`
              );

              if (!response.ok) {
                throw new Error("날씨 정보를 가져오는데 실패했습니다.");
              }

              const data = await response.json();
              setWeather(data);
              setLoading(false);
            }
          );
        } else {
          // 위치 정보를 지원하지 않는 브라우저의 경우 기본 위치(서울)의 날씨 정보 가져오기
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=YOUR_API_KEY&units=metric&lang=kr`
          );

          if (!response.ok) {
            throw new Error("날씨 정보를 가져오는데 실패했습니다.");
          }

          const data = await response.json();
          setWeather(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("날씨 정보를 가져오는데 오류가 발생했습니다:", error);
        setError("날씨 정보를 가져오는데 실패했습니다.");
        setLoading(false);

        // 오류 발생 시 더미 데이터 사용
        setWeather({
          name: "서울",
          main: {
            temp: 22,
            feels_like: 21,
            humidity: 65,
          },
          weather: [
            {
              main: "맑음",
              description: "맑음",
              icon: "01d",
            },
          ],
        });
      }
    };

    fetchWeather();

    // 1시간마다 날씨 정보 업데이트
    const intervalId = setInterval(fetchWeather, 3600000);

    return () => clearInterval(intervalId);
  }, []);

  // 날씨 아이콘 URL 생성
  const getWeatherIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  // 날짜 포맷팅
  const formatDate = () => {
    const now = new Date();
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    };
    return now.toLocaleDateString("ko-KR", options);
  };

  // 시간 포맷팅
  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="weather-widget loading">
        <p>날씨 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-widget error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="weather-widget">
      <div className="weather-date-time">
        <div className="weather-date">{formatDate()}</div>
        <div className="weather-time">{formatTime()}</div>
      </div>

      <div className="weather-info">
        <div className="weather-location">
          <span>📍 {location}</span>
        </div>

        <div className="weather-details">
          {weather.weather && weather.weather[0] && (
            <img
              src={
                getWeatherIconUrl(weather.weather[0].icon) || "/placeholder.svg"
              }
              alt={weather.weather[0].description}
              className="weather-icon"
            />
          )}

          <div className="weather-temp-container">
            <div className="weather-temp">
              {Math.round(weather.main.temp)}°C
            </div>
            <div className="weather-description">
              {weather.weather && weather.weather[0]
                ? weather.weather[0].description
                : ""}
            </div>
          </div>

          <div className="weather-extra-info">
            <div>체감온도: {Math.round(weather.main.feels_like)}°C</div>
            <div>습도: {weather.main.humidity}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
