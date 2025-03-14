import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function App() {
  const [keyword, setKeyword] = useState("");
  const [article, setArticle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const articleRef = useRef(null);

  const handleLogin = () => {
    if (username === "admin" && password === "password123") {
      setIsLoggedIn(true);
    } else {
      alert("Username atau password salah!");
    }
  };

  const generateArticle = async () => {
    if (!keyword.trim()) {
      setError("Keyword tidak boleh kosong!");
      return;
    }
    if (keyword.length > 200) {
      setError("Keyword terlalu panjang! Maksimal 200 karakter.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setCopied(false);
    
    try {
      const { data } = await axios.post("https://hoseliau.onrender.com/generate", { keyword });
      setArticle(data.text);
    } catch (error) {
      console.error("Error saat mengambil data:", error.response ? error.response.data : error.message);
      setArticle("<p>Terjadi kesalahan saat memproses permintaan.</p>");
      setError("Gagal menghasilkan artikel. Coba lagi nanti.");
    }
    setLoading(false);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(article);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-black">
        <div className="p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-3"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-3"
          />
          <button
            onClick={handleLogin}
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center font-poppins transition-all duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}
    >
      <div className="w-full max-w-md text-center p-5 flex justify-between items-center">
        <img src="/logo.png" alt="Logo" className="h-10" />
        <h1 className="text-2xl font-bold">✨ Hoseliau ✨</h1>
        <button
          onClick={toggleDarkMode}
          className="py-2 px-4 rounded-lg transition-all duration-300 bg-yellow-500 hover:bg-yellow-600 text-white"
        >
          {darkMode ? "🌙" : "☀️"}
        </button>
      </div>
      <input
        type="text"
        placeholder="Masukkan keyword artikel..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        maxLength={100}
        className="w-full max-w-md p-3 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <button
        onClick={generateArticle}
        className={`mt-4 w-full max-w-md py-3 rounded-lg text-white transition-all duration-300 ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
        disabled={loading}
      >
        {loading ? <span className="animate-spin">🔄</span> : "✨ GENERATE ✨"}
      </button>
      {article && (
        <div className="w-full max-w-md p-4 mt-4 bg-white text-black rounded-lg shadow-md">
          <button
            onClick={copyToClipboard}
            className="mb-2 py-2 px-4 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-all duration-300"
          >
            {copied ? "✅ Copied!" : "📋 Copy"}
          </button>
          <div
            ref={articleRef}
            className="mt-2 text-left text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.trim() !== "" ? article : "<p>Artikel belum tersedia.</p>" }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
