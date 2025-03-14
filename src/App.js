import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function App() {
  const [keyword, setKeyword] = useState("");
  const [article, setArticle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [displayedText, setDisplayedText] = useState("");
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
    setDisplayedText("");
    try {
      const { data } = await axios.post("https://hoseliau.onrender.com/generate", { keyword });
      setArticle(data.text);
    } catch (error) {
      console.error("❌ Error saat mengambil data:", error.response ? error.response.data : error.message);
      setError("❌ Gagal menghasilkan artikel. Coba lagi nanti.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (article) {
      let i = 0;
      setDisplayedText("");
      const interval = setInterval(() => {
        if (i < article.length) {
          setDisplayedText((prev) => prev + article[i]);
          i++;
        } else {
          clearInterval(interval);
        }
      }, 30);
    }
  }, [article]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(article);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      <h1 style={{ fontSize: "26px", fontWeight: "bold", marginBottom: "20px" }}>✨Walaoe✨</h1>
      <input
        type="text"
        placeholder="Masukkan keyword artikel..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        maxLength={100}
        style={{
          width: "89%",
          padding: "12px",
          fontSize: "16px",
          marginBottom: "12px",
          borderRadius: "15px",
          border: "1px solid #ccc",
          backgroundColor: darkMode ? "#333" : "#fff",
          color: darkMode ? "#fff" : "#000",
          textAlign: "center",
        }}
      />
      {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
      <button
        onClick={generateArticle}
        style={{
          width: "50%",
          padding: "12px",
          fontSize: "14px",
          borderRadius: "15px",
          border: "1px solid #007bff",
          cursor: loading ? "not-allowed" : "pointer",
          backgroundColor: loading ? "#6c757d" : "#007bff",
          color: "#ffffff",
        }}
        disabled={loading}
      >
        {loading ? "⏳ Generating..." : "✨GENERATE✨"}
      </button>
      {loading && <p style={{ marginTop: "12px", color: "#007bff" }}>⏳ Generating...</p>}
      {article && (
        <motion.div
          ref={articleRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            marginTop: "20px",
            width: "100%",
            maxWidth: "400px",
            border: "2px solid #FFD700",
            borderRadius: "15px",
            padding: "20px",
            backgroundColor: darkMode ? "#222" : "#fff",
            color: darkMode ? "#fff" : "#000",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
          }}
        >
          <p>{displayedText}</p>
        </motion.div>
      )}
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
          }}
        >
          {copied ? "✅ Copied!" : "📋 Copy Article"}
        </button>
      )}
    </div>
  );
}

export default App;
