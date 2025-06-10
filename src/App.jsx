import React, { useState, useEffect } from "react";
import "./App.css";
import WeatherWidget from "./WeatherWidget";

function App() {
  const [bookmarks, setBookmarks] = useState(() => {
    const savedBookmarks = localStorage.getItem("bookmarks");
    return savedBookmarks
      ? JSON.parse(savedBookmarks)
      : [
          {
            id: "1",
            title: "네이버",
            url: "https://www.naver.com",
            category: "검색",
          },
          {
            id: "2",
            title: "구글",
            url: "https://www.google.com",
            category: "검색",
          },
          {
            id: "3",
            title: "유튜브",
            url: "https://www.youtube.com",
            category: "미디어",
          },
          {
            id: "4",
            title: "깃허브",
            url: "https://github.com",
            category: "저장소",
          },
          {
            id: "5",
            title: "Daum",
            url: "https://www.daum.net/",
            category: "검색",
          },
        ];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newBookmark, setNewBookmark] = useState({
    title: "",
    url: "",
    category: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [faviconErrors, setFaviconErrors] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const addBookmark = () => {
    if (!newBookmark.title || !newBookmark.url) return;

    let url = newBookmark.url;
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }

    const bookmark = {
      id: Date.now().toString(),
      title: newBookmark.title,
      url: url,
      category: newBookmark.category || "기타",
    };

    setBookmarks([...bookmarks, bookmark]);
    setNewBookmark({ title: "", url: "", category: "" });
    setShowModal(false);
  };

  const deleteBookmark = (id) => {
    setDeletingId(id);
    setTimeout(() => {
      setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id));
      setDeletingId(null);
    }, 300);
  };

  const getFaviconUrl = (url) => {
    try {
      if (!url || typeof url !== "string") {
        return null;
      }

      // URL이 프로토콜 없이 시작하는 경우 https:// 추가
      let fullUrl = url;
      if (!/^https?:\/\//i.test(url)) {
        fullUrl = "https://" + url;
      }

      const urlObj = new URL(fullUrl);
      const domain = urlObj.hostname;

      if (!domain) {
        return null;
      }

      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch (error) {
      console.warn("Failed to generate favicon URL:", error);
      return null;
    }
  };

  const handleFaviconError = (id) => {
    setFaviconErrors((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  const getCategoryIcon = (category) => {
    const icons = {
      검색: "🔍",
      미디어: "🎬",
      저장소: "💾",
      쇼핑: "🛒",
      뉴스: "📰",
      소셜미디어: "💬",
      개발: "⚡",
      기타: "📁",
    };
    return icons[category] || "📁";
  };

  const categories = [
    ...new Set(bookmarks.map((bookmark) => bookmark.category)),
  ].filter(Boolean);

  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const matchesSearch =
      bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? bookmark.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={`app-container ${isLoaded ? "loaded" : ""}`}>
      <div className="background-animation">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="floating-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="weather-container">
        <WeatherWidget />
      </div>

      <header>
        <div className="header-content">
          <h1>
            <span className="logo-icon">🚀</span>
            픽앤고
            <div className="title-glow"></div>
          </h1>
          <div className="header-stats">
            <span className="bookmark-count">{bookmarks.length} 북마크</span>
          </div>
        </div>
        <button className="add-button" onClick={() => setShowModal(true)}>
          <span className="button-icon">✨</span>새 북마크 추가
          <div className="button-ripple"></div>
        </button>
      </header>

      <div className="search-container">
        <div className="search-wrapper">
          <div className="search-icon">🔍</div>
          <input
            type="text"
            placeholder="북마크 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm("")}>
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="main-content">
        <div className="sidebar">
          <div className="sidebar-header">
            <h2>
              <span className="sidebar-icon">📂</span>
              카테고리
            </h2>
          </div>
          <ul className="category-list">
            <li
              className={`category-item ${
                selectedCategory === null ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(null)}
            >
              <span className="category-icon">📑</span>
              <span className="category-name">모든 북마크</span>
              <span className="category-count">{bookmarks.length}</span>
            </li>
            {categories.map((category) => (
              <li
                key={category}
                className={`category-item ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                <span className="category-icon">
                  {getCategoryIcon(category)}
                </span>
                <span className="category-name">{category}</span>
                <span className="category-count">
                  {bookmarks.filter((b) => b.category === category).length}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bookmark-grid">
          {filteredBookmarks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>북마크가 없습니다</h3>
              <p>새 북마크를 추가해보세요!</p>
              <button
                className="empty-action-button"
                onClick={() => setShowModal(true)}
              >
                첫 북마크 추가하기
              </button>
            </div>
          ) : (
            filteredBookmarks.map((bookmark, index) => (
              <div
                className={`bookmark-card ${
                  deletingId === bookmark.id ? "deleting" : ""
                }`}
                key={bookmark.id}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bookmark-header">
                  <div className="bookmark-title-container">
                    {!faviconErrors[bookmark.id] ? (
                      <img
                        src={getFaviconUrl(bookmark.url)}
                        alt=""
                        className="bookmark-favicon"
                        onError={() => handleFaviconError(bookmark.id)}
                      />
                    ) : (
                      <div className="bookmark-favicon-fallback">
                        {bookmark.title.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <h3 className="bookmark-title">{bookmark.title}</h3>
                  </div>
                  <button
                    className="delete-button"
                    onClick={() => deleteBookmark(bookmark.id)}
                    title="삭제"
                  >
                    <span className="delete-icon">🗑️</span>
                  </button>
                </div>

                <div className="bookmark-category">
                  <span className="category-badge">
                    {getCategoryIcon(bookmark.category)}
                    {bookmark.category}
                  </span>
                </div>

                <div className="bookmark-url">{bookmark.url}</div>

                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="visit-button"
                >
                  <span className="visit-icon">🔗</span>
                  방문하기
                  <div className="visit-button-glow"></div>
                </a>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <span className="modal-icon">✨</span>새 북마크 추가
              </h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="title">
                  <span className="label-icon">📝</span>
                  제목
                </label>
                <input
                  id="title"
                  type="text"
                  value={newBookmark.title}
                  onChange={(e) =>
                    setNewBookmark({ ...newBookmark, title: e.target.value })
                  }
                  placeholder="웹사이트 이름을 입력하세요"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="url">
                  <span className="label-icon">🌐</span>
                  URL
                </label>
                <input
                  id="url"
                  type="text"
                  value={newBookmark.url}
                  onChange={(e) =>
                    setNewBookmark({ ...newBookmark, url: e.target.value })
                  }
                  placeholder="https://example.com"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">
                  <span className="label-icon">🏷️</span>
                  카테고리
                </label>
                <input
                  id="category"
                  type="text"
                  value={newBookmark.category}
                  onChange={(e) =>
                    setNewBookmark({ ...newBookmark, category: e.target.value })
                  }
                  placeholder="예: 쇼핑, 뉴스, 소셜미디어"
                  className="form-input"
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="cancel-button"
                onClick={() => setShowModal(false)}
              >
                취소
              </button>
              <button
                className="submit-button"
                onClick={addBookmark}
                disabled={!newBookmark.title || !newBookmark.url}
              >
                <span className="submit-icon">🚀</span>
                추가하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
