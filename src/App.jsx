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

  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

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
    setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id));
  };

  // 파비콘 URL 생성 함수
  const getFaviconUrl = (url) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch (error) {
      return null;
    }
  };

  // 파비콘 로드 에러 처리
  const handleFaviconError = (id) => {
    setFaviconErrors(prev => ({
      ...prev,
      [id]: true
    }));
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
    <div className="app-container">
      <div className="weather-container">
        <WeatherWidget />
      </div>
      
      <header>
        <h1>픽앤고</h1>
        <button className="add-button" onClick={() => setShowModal(true)}>
          ➕ 새 북마크 추가
        </button>
      </header>

      <div className="search-container">
        <input
          type="text"
          placeholder="검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="main-content">
        <div className="sidebar">
          <h2>카테고리</h2>
          <ul className="category-list">
            <li
              className={selectedCategory === null ? "active" : ""}
              onClick={() => setSelectedCategory(null)}
            >
              📑 모든 북마크
            </li>
            {categories.map((category) => (
              <li
                key={category}
                className={selectedCategory === category ? "active" : ""}
                onClick={() => setSelectedCategory(category)}
              >
                📁 {category}
              </li>
            ))}
          </ul>
        </div>

        <div className="bookmark-grid">
          {filteredBookmarks.length === 0 ? (
            <div className="empty-state">
              북마크가 없습니다. 새 북마크를 추가해보세요!
            </div>
          ) : (
            filteredBookmarks.map((bookmark) => (
              <div className="bookmark-card" key={bookmark.id}>
                <div className="bookmark-header">
                  <div className="bookmark-title-container">
                    {!faviconErrors[bookmark.id] && (
                      <img
                        src={getFaviconUrl(bookmark.url) || "/placeholder.svg"}
                        alt=""
                        className="bookmark-favicon"
                        onError={() => handleFaviconError(bookmark.id)}
                      />
                    )}
                    {faviconErrors[bookmark.id] && (
                      <div className="bookmark-favicon-fallback">
                        {bookmark.title.charAt(0)}
                      </div>
                    )}
                    <h3>{bookmark.title}</h3>
                  </div>
                  <button
                    className="delete-button"
                    onClick={() => deleteBookmark(bookmark.id)}
                  >
                    ❌
                  </button>
                </div>
                <div className="bookmark-category">{bookmark.category}</div>
                <div className="bookmark-url">{bookmark.url}</div>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="visit-button"
                >
                  🔗 방문하기
                </a>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>새 북마크 추가</h2>
            <div className="form-group">
              <label htmlFor="title">제목</label>
              <input
                id="title"
                type="text"
                value={newBookmark.title}
                onChange={(e) =>
                  setNewBookmark({ ...newBookmark, title: e.target.value })
                }
                placeholder="웹사이트 이름"
              />
            </div>
            <div className="form-group">
              <label htmlFor="url">URL</label>
              <input
                id="url"
                type="text"
                value={newBookmark.url}
                onChange={(e) =>
                  setNewBookmark({ ...newBookmark, url: e.target.value })
                }
                placeholder="https://example.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">카테고리</label>
              <input
                id="category"
                type="text"
                value={newBookmark.category}
                onChange={(e) =>
                  setNewBookmark({ ...newBookmark, category: e.target.value })
                }
                placeholder="예: 쇼핑, 뉴스, 소셜미디어"
              />
            </div>
            <div className="modal-actions">
              <button
                className="cancel-button"
                onClick={() => setShowModal(false)}
              >
                취소
              </button>
              <button className="submit-button" onClick={addBookmark}>
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
