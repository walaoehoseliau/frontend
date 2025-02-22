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
        color: darkMode ? "#ffffff" : "#000000",
        transition: "background-color 0.3s ease, color 0.3s ease",
        padding: "20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "500px", textAlign: "center" }}>
        {/* Header */}
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
        {/* Input Keyword */}
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
        {/* Error Handling */}
        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
        {/* Button Generate */}
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

		{/* Tombol Editor */}
		<button
		  onClick={async () => {
			try {
			  await navigator.clipboard.writeText(article);
			  setCopied(true); // Set state copied agar user tahu berhasil
			  setTimeout(() => {
				window.open("https://rentry.co", "_blank");
			  }, 1000); // Delay 1 detik agar user melihat efek copy
			} catch (err) {
			  console.error("❌ Gagal menyalin teks:", err);
			  alert("Gagal menyalin artikel. Silakan coba lagi!");
			}
		  }}
		  style={{
			width: "60%",
			padding: "12px",
			marginTop: "10px",
			fontSize: "14px",
			borderRadius: "5px",
			border: "none",
			cursor: "pointer",
			backgroundColor: copied ? "#218838" : "#28a745", // Warna hijau lebih gelap jika sudah disalin
			color: "white",
			transition: "background-color 0.3s ease",
		  }}
		  
		>
		  {copied ? "✨EDITOR✨" : "✨EDITOR✨"}
		</button>
		{/* Hasil Artikel */}
		{article && (
		  <div
			ref={articleRef}
			style={{
			  marginTop: "20px",
			  padding: "15px",
			  borderRadius: "8px",
			  backgroundColor: darkMode ? "#222" : "#fff",
			  color: darkMode ? "#fff" : "#000",
			  border: "1px solid #ccc",
			  maxWidth: "1280px",
			  textAlign: "left",
			  lineHeight: "1.6",
			  whiteSpace: "normal",
			}}
			dangerouslySetInnerHTML={{ __html: article.trim() !== "" ? article : "<p>Artikel belum tersedia.</p>" }}
		  />
		)}
		{/* Tombol Copy */}
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
        {/* Efek Loading */}
        {loading && (
          <div style={{ marginTop: "15px", textAlign: "center" }}>
            <div className="loading-spinner"></div>
            <p style={{ fontSize: "14px", marginTop: "5px", opacity: "0.8" }}>Artikel sedang dibuat...</p>
          </div>
        )}
      </div>
      {/* Animasi CSS */}
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
    </div>
  );
}
export default App;
