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
    if (keyword.length > 200) {
      setError("❌ Keyword terlalu panjang! Maksimal 200 karakter.");
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
        color: darkMode ? "#80ff00" : "#000000",
        transition: "background-color 0.3s ease, color 0.3s ease",
        padding: "20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "500px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: "bold" }}>✨ Hoseliau ✨</h1>
          <button
            onClick={toggleDarkMode}
            style={{
              padding: "14px 14px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              backgroundColor: darkMode ? "#f0f0f0" : "#00004d",
              color: darkMode ? "#00004d" : "#fff",
              fontSize: "15px",
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
            width: "90%",
            padding: "15px",
            fontSize: "15px",
            marginBottom: "15px",
            borderRadius: "15px",
            border: "2px solid #ccc",
            backgroundColor: darkMode ? "#333" : "#091b30",
            color: darkMode ? "#fff" : "#000",
            transition: "background-color 0.3s ease, color 0.3s ease",
            textAlign: "center",
          }}
        />
        {error && <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>}
        <button
          onClick={generateArticle}
          style={{
            width: "60%",
            padding: "12px",
            fontSize: "16px",
            borderRadius: "10px",
            border: "fixed",
            cursor: loading ? "allowed" : "fixed",
            backgroundColor: loading ? "#3333ff" : "#ff4000",
            color: "#ffffff",
            transition: "opacity 0.3s ease",
          }}
          enabled={loading}
        >
          {loading ? "⏳ Generating..." : "✨ GENERATE ✨"}
        </button>
      </div>
      {article && (
        <button
          onClick={copyToClipboard}
          style={{
            marginTop: "10px",
            padding: "10px 10px",
            borderRadius: "10px",
            border: "none",
            cursor: "fixed",
            backgroundColor: "#ff4000",
            color: "#ffffff",
            fontSize: "15px",
            transition: "background-color 0.3s ease",
          }}
        >
          {copied ? "✅ Copied!" : "📋 Copy "}
        </button>
      )}
      {article && (
        <div
          ref={articleRef}
          style={{
            marginTop: "10px",
            padding: "10px",
            borderRadius: "10px",
            backgroundColor: darkMode ? "#222" : "#fff",
            color: darkMode ? "#fff" : "#000",
            border: "2px solid #ccc",
            maxWidth: "500px",
            textAlign: "left",
            lineHeight: "1.6",
            whiteSpace: "fixed",
          }}
          dangerouslySetInnerHTML={{ __html: article.trim() !== "" ? article : "<p>Artikel belum tersedia.</p>" }}
        />
      )}
    </div>
  );
}

export default App;
