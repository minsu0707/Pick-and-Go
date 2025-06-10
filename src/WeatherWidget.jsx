"use client";

import { useState, useEffect } from "react";
import "./WeatherWidget.css";

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState("서울");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

              // 더미 데이터로 폴백
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
              setLoading(false);
            }
          );
        } else {
          // 더미 데이터로 폴백
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

  // 날씨 아이콘 이모지 매핑
  const getWeatherEmoji = (iconCode) => {
    const emojiMap = {
      "01d": "☀️",
      "01n": "🌙",
      "02d": "⛅",
      "02n": "☁️",
      "03d": "☁️",
      "03n": "☁️",
      "04d": "☁️",
      "04n": "☁️",
      "09d": "🌧️",
      "09n": "🌧️",
      "10d": "🌦️",
      "10n": "🌧️",
      "11d": "⛈️",
      "11n": "⛈️",
      "13d": "❄️",
      "13n": "❄️",
      "50d": "🌫️",
      "50n": "🌫️",
    };
    return emojiMap[iconCode] || "🌤️";
  };

  // 날짜 포맷팅
  const formatDate = () => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    };
    return currentTime.toLocaleDateString("ko-KR", options);
  };

  // 시간 포맷팅
  const formatTime = () => {
    return currentTime.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // 배경 그라디언트 결정
  const getWeatherGradient = (iconCode) => {
    const gradients = {
      "01d": "linear-gradient(135deg, #FFD700, #FFA500)", // 맑은 낮
      "01n": "linear-gradient(135deg, #2C3E50, #34495E)", // 맑은 밤
      "02d": "linear-gradient(135deg, #87CEEB, #98D8E8)", // 구름 조금 낮
      "02n": "linear-gradient(135deg, #34495E, #2C3E50)", // 구름 조금 밤
      "03d": "linear-gradient(135deg, #95A5A6, #BDC3C7)", // 구름 많음
      "03n": "linear-gradient(135deg, #2C3E50, #34495E)",
      "04d": "linear-gradient(135deg, #7F8C8D, #95A5A6)", // 흐림
      "04n": "linear-gradient(135deg, #2C3E50, #34495E)",
      "09d": "linear-gradient(135deg, #3498DB, #5DADE2)", // 비
      "09n": "linear-gradient(135deg, #2C3E50, #3498DB)",
      "10d": "linear-gradient(135deg, #3498DB, #F39C12)", // 햇빛과 비
      "10n": "linear-gradient(135deg, #2C3E50, #3498DB)",
      "11d": "linear-gradient(135deg, #8E44AD, #3498DB)", // 뇌우
      "11n": "linear-gradient(135deg, #2C3E50, #8E44AD)",
      "13d": "linear-gradient(135deg, #ECF0F1, #BDC3C7)", // 눈
      "13n": "linear-gradient(135deg, #34495E, #ECF0F1)",
      "50d": "linear-gradient(135deg, #95A5A6, #BDC3C7)", // 안개
      "50n": "linear-gradient(135deg, #2C3E50, #95A5A6)",
    };
    return gradients[iconCode] || "linear-gradient(135deg, #6e8efb, #a777e3)";
  };

  if (loading) {
    return (
      <div className="weather-widget loading">
        <div className="loading-spinner"></div>
        <p>날씨 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error && !weather) {
    return (
      <div className="weather-widget error">
        <div className="error-icon">⚠️</div>
        <p>{error}</p>
        <button
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div
      className="weather-widget"
      style={{ background: getWeatherGradient(weather?.weather?.[0]?.icon) }}
    >
      <div className="weather-particles">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="weather-overlay"></div>

      <div className="weather-content">
        <div className="weather-date-time">
          <div className="weather-date">{formatDate()}</div>
          <div className="weather-time">
            <span className="time-display">{formatTime()}</span>
            <div className="time-dots">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        </div>

        <div className="weather-info">
          <div className="weather-location">
            <span className="location-icon">📍</span>
            <span className="location-name">{location}</span>
          </div>

          <div className="weather-details">
            <div className="weather-icon-container">
              <div className="weather-icon">
                {getWeatherEmoji(
                  weather?.weather?.[0]?.icon,
                  weather?.weather?.[0]?.description
                )}
              </div>
              <div className="icon-glow"></div>
            </div>

            <div className="weather-temp-container">
              <div className="weather-temp">
                <span className="temp-value">
                  {Math.round(weather.main.temp)}
                </span>
                <span className="temp-unit">°C</span>
              </div>
              <div className="weather-description">
                {weather.weather?.[0]?.description || "맑음"}
              </div>
            </div>

            <div className="weather-extra-info">
              <div className="extra-item">
                <span className="extra-icon">🌡️</span>
                <span className="extra-label">체감</span>
                <span className="extra-value">
                  {Math.round(weather.main.feels_like)}°C
                </span>
              </div>
              <div className="extra-item">
                <span className="extra-icon">💧</span>
                <span className="extra-label">습도</span>
                <span className="extra-value">{weather.main.humidity}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="weather-footer">
        <div className="last-updated">
          마지막 업데이트:{" "}
          {new Date().toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
