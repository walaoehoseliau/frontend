import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

// Object untuk menyimpan style yang digunakan
const styles = {
  container: (darkMode) => ({
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
  }),
  title: {
    fontSize: "30px",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  input: (darkMode) => ({
    width: "100%",
    maxWidth: "400px",
    padding: "14px",
    fontSize: "16px",
    marginBottom: "16px",
    borderRadius: "10px",
    border: `1px solid ${darkMode ? "#555" : "#ccc"}`,
    backgroundColor: darkMode ? "#333" : "#fff",
    color: darkMode ? "#fff" : "#000",
    transition: "all 0.3s ease",
    textAlign: "center",
  }),
  button: (loading) => ({
    width: "80%",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "none",
    cursor: loading ? "not-allowed" : "pointer",
    backgroundColor: loading ? "#6c757d" : "#007bff",
    color: "#ffffff",
    fontWeight: "bold",
    transition: "opacity 0.3s ease",
    marginBottom: "10px",
  }),
  copyButton: {
    marginTop: "10px",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#28a745",
    color: "#fff",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  },
  toggleButton: (darkMode) => ({
    padding: "10px 14px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    backgroundColor: darkMode ? "#f0f0f0" : "#333",
    color: darkMode ? "#000" : "#fff",
    fontSize: "14px",
    transition: "background-color 0.3s ease, color 0.3s ease",
    marginBottom: "15px",
  }),
};


function App() {
  const [keyword, setKeyword] = useState("");
  const [article, setArticle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const articleRef = useRef(null);

  // Fungsi untuk menghasilkan artikel
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
    } catch (err) {
      console.error("❌ Error saat mengambil data:", err.response ? err.response.data : err.message);
      setArticle("<p>Terjadi kesalahan saat memproses permintaan.</p>");
      setError("❌ Gagal menghasilkan artikel. Coba lagi nanti.");
    }
    setLoading(false);
  };

  // Fungsi untuk menyalin artikel ke clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(article);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Auto-scroll ke hasil artikel ketika artikel tersedia
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
    <div style={styles.container(darkMode)}>
      <div style={{ width: "100%", maxWidth: "500px", textAlign: "center" }}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.title}>✨Hoseliau✨</h1>
          <button onClick={toggleDarkMode} style={styles.toggleButton(darkMode)}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </header>
        {/* Input Keyword */}
        <input
          type="text"
          placeholder="Masukkan keyword artikel..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          maxLength={100}
          style={styles.input(darkMode)}
        />
        {/* Tampilkan error jika ada */}
        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
        {/* Tombol Generate */}
        <button
          onClick={generateArticle}
          style={styles.button(loading)}
          disabled={loading}
        >
          {loading ? "⏳ Generating..." : "✨GENERATE✨"}
        </button>
        {/* Tombol Copy */}
        {article && (
          <button onClick={copyToClipboard} style={styles.copyButton}>
            {copied ? "✅ Copied!" : "📋 Copy Article"}
          </button>
        )}
        {/* Indikator Loading */}
        {loading && (
          <div style={{ marginTop: "15px", textAlign: "center" }}>
            <div className="loading-spinner"></div>
            <p style={{ fontSize: "14px", marginTop: "5px", opacity: "0.8" }}>
              Artikel sedang dibuat...
            </p>
          </div>
        )}
      </div>
      {/* CSS untuk animasi spinner */}
      <style>
        {`
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid #007bff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: auto;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      {/* Hasil Artikel */}
      {article && (
        <div
          ref={articleRef}
          style={styles.article(darkMode)}
          dangerouslySetInnerHTML={{
            __html: article.trim() !== "" ? article : "<p>Artikel belum tersedia.</p>",
          }}
        />
      )}
    </div>
  );
}

export default App;
