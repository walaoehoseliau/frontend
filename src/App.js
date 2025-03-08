import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function App() {
  const [keyword, setKeyword] = useState("");
  const [article, setArticle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const articleRef = useRef(null);

  // Generate Artikel
  const generateArticle = async () => {
    if (!keyword.trim()) {
      setError("❌ Keyword tidak boleh kosong!");
      return;
    }
    if (keyword.length > 100) {
      setError("❌ Keyword terlalu panjang! Maksimal 100 karakter.");
      return;
    }
    setLoading(true);
    setError(null);
    setCopied(false);
    try {
      const { data } = await axios.post("https://walaoe.onrender.com/generate", { keyword });
      setArticle(data.text);
    } catch (error) {
      console.error("❌ Error saat mengambil data:", error.response ? error.response.data : error.message);
      setArticle("<p>Terjadi kesalahan saat memproses permintaan.</p>");
      setError("❌ Gagal menghasilkan artikel. Coba lagi nanti.");
    }
    setLoading(false);
  };

  // Copy ke Clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(article);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Auto-scroll ke hasil artikel
  useEffect(() => {
    if (articleRef.current && article) {
      articleRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [article]);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: darkMode ? "#1a1a1a" : "#f8f9fa",
        color: darkMode ? "#ffffff" : "#000000",
        transition: "background-color 0.3s ease, color 0.3s ease",
        padding: "20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "500px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: "bold" }}>✨Walaoe✨</h1>
          <button
            onClick={toggleDarkMode}
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              backgroundColor: darkMode ? "#f0f0f0" : "#333",
              color: darkMode ? "#000" : "#fff",
              fontSize: "14px",
              transition: "background-color 0.3s ease, color 0.3s ease",
            }}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
        <input
          type="text"
          placeholder="Masukkan keyword artikel..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          maxLength={100}
          style={{
            width: "93%",
            padding: "12px",
            fontSize: "16px",
            marginBottom: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            backgroundColor: darkMode ? "#333" : "#fff",
            color: darkMode ? "#fff" : "#000",
            transition: "background-color 0.3s ease, color 0.3s ease",
            textAlign: "center",
          }}
        />
        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
        <button
          onClick={generateArticle}
          style={{
            width: "60%",
            padding: "12px",
            fontSize: "14px",
            borderRadius: "8px",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            backgroundColor: loading ? "#6c757d" : "#007bff",
            color: "#ffffff",
            transition: "opacity 0.3s ease",
          }}
          disabled={loading}
        >
          {loading ? "⏳ Generating..." : "✨GENERATE✨"}
        </button>
      </div>
      {article && (
        <button
          onClick={copyToClipboard}
          style={{
            marginTop: "10px",
            padding: "10px 14px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#28a745",
            color: "#fff",
            fontSize: "14px",
            transition: "background-color 0.3s ease",
          }}
        >
          {copied ? "✅ Copied!" : "📋 Copy Article"}
        </button>
      )}
      {loading && (
        <div style={{ marginTop: "15px", textAlign: "center" }}>
          <div className="fancy-loading-spinner"></div>
          <p style={{ fontSize: "14px", marginTop: "5px", opacity: "0.8" }}>Artikel sedang dibuat...</p>
        </div>
      )}
      <div ref={articleRef} style={{ marginTop: "20px", width: "100%", maxWidth: "800px" }}>
        <div dangerouslySetInnerHTML={{ __html: article }} />
      </div>
      {/* Animasi CSS untuk loading spinner yang canggih */}
      <style>
        {`
          .fancy-loading-spinner {
            margin: auto;
            width: 50px;
            height: 50px;
            border: 5px solid rgba(0, 123, 255, 0.2);
            border-top: 5px solid #007bff;
            border-radius: 50%;
            animation: fancy-spin 1s linear infinite;
            position: relative;
          }
          .fancy-loading-spinner::before {
            content: "";
            position: absolute;
            top: -10px;
            left: -10px;
            right: -10px;
            bottom: -10px;
            border: 5px solid rgba(0, 123, 255, 0.1);
            border-radius: 50%;
            animation: fancy-spin-reverse 1.5s linear infinite;
          }
          @keyframes fancy-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes fancy-spin-reverse {
            0% { transform: rotate(360deg); }
            100% { transform: rotate(0deg); }
          }
        `}
      </style>
    </div>
  );
}

export default App;
