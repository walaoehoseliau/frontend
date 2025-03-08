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
    <div className={`min-h-screen flex flex-col items-center justify-center p-5 transition-all ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <div className="w-full max-w-md text-center">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-bold">✨ Walaoe ✨</h1>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-md text-sm transition-all ${darkMode ? "bg-gray-200 text-black" : "bg-gray-800 text-white"}`}
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
          className={`w-full p-3 text-lg border rounded-md mb-3 text-center transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-white text-black" : "bg-black text-white"}`}
        />
        {error && <p className="text-red-500 mb-3">{error}</p>}
        <button
          onClick={generateArticle}
          disabled={loading}
          className={`w-full p-3 text-lg font-semibold rounded-md transition-all ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
        >
          {loading ? "⏳ Generating..." : "✨ GENERATE ✨"}
        </button>
      </div>
      {loading && (
        <div className="flex flex-col items-center mt-5">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-400 border-t-transparent"></div>
          <p className="mt-2 text-sm text-gray-400">Artikel sedang dibuat...</p>
        </div>
      )}
      {article && (
        <>
          <button
            onClick={copyToClipboard}
            className="mt-3 p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all"
          >
            {copied ? "✅ Copied!" : "📋 Copy Article"}
          </button>
          <div
            ref={articleRef}
            className="mt-5 p-5 w-full max-w-2xl border rounded-md shadow-lg bg-white text-black"
            dangerouslySetInnerHTML={{ __html: article }}
          />
        </>
      )}
    </div>
  );
}

export default App;
