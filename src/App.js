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
      const { data } = await axios.post("https://hoseliau.onrender.com/generate", { keyword });
      setArticle(data.text);
    } catch (error) {
      console.error("❌ Error saat mengambil data:", error.response ? error.response.data : error.message);
      setError("❌ Gagal menghasilkan artikel. Coba lagi nanti.");
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(article);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (articleRef.current && article) {
      articleRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [article]);

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
        backgroundColor: darkMode ? "#919294" : "#919294",
        color: darkMode ? "#919294" : "#919294",
        transition: "background-color 0.3s ease, color 0.3s ease",
        padding: "20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: "bold" }}>✨Walaoe✨</h1>
          <button
            onClick={toggleDarkMode}
            style={{
              padding: "14px 14px",
              borderRadius: "15px",
              border: "none",
              cursor: "pointer",
              backgroundColor: darkMode ? "#000" : "#000",
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
            width: "89%",
            padding: "15px",
            fontSize: "15px",
            marginBottom: "15px",
            borderRadius: "15px",
            border: "1px solid #6600cc",
            backgroundColor: darkMode ? "#333" : "#fff",
            color: darkMode ? "#fff" : "#fff",
            transition: "background-color 0.3s ease, color 0.3s ease",
            textAlign: "center",
          }}
        />
        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
        <button
          onClick={generateArticle}
          style={{
            width: "50%",
            padding: "15px",
            fontSize: "15px",
            borderRadius: "15px",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            backgroundColor: loading ? "#6c757d" : "#6600cc",
            color: "#999999",
            transition: "opacity 0.3s ease",
          }}
          enable={loading}
        >
          {loading ? "⏳ Generating..." : "✨GENERATE✨"}
        </button>
      </div>
      {loading && <p style={{ marginTop: "15px", color: "#007bff" }}>⏳ Generating...</p>}
      {article && (
        <>
          <button
            onClick={copyToClipboard}
            style={{
              marginTop: "15px",
              padding: "15px 15px",
              borderRadius: "15px",
              border: "none",
              cursor: "pointer",
              backgroundColor: "#999999",
              color: "#fff",
              fontSize: "15px",
              transition: "background-color 0.3s ease",
            }}
          >
            {copied ? "✅ Copied!" : "📋 Copy Article"}
          </button>
          <div
            ref={articleRef}
            style={{
              marginTop: "15px",
              width: "100%",
              maxWidth: "500px",
              border: "2px solid #ffffff",
              borderRadius: "15px",
              padding: "15px",
              backgroundColor: darkMode ? "#595959" : "#f0f0f0",
              color: darkMode ? "#fff" : "#000",
              boxShadow: "0 2px 15px rgba(0, 0, 0, 0.2)",
              transition: "background-color 0.3s ease, color 0.3s ease",
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: article }} />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
