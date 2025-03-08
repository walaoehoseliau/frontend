import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
function App() {
  const [keyword, setKeyword] = useState("");
  const [article, setArticle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const articleRef = useRef(null);
  // Dummy login function
  const handleLogin = () => {
    if (username === "admin" && password === "walaoe") {
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
    } else {
      alert("Login gagal! Periksa username dan password.");
    }
  };
  // Logout function (hidden by default)
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn === "true") {
      setIsLoggedIn(true);
    }
  }, []);
  // Generate Artikel
  const generateArticle = async () => {
    if (!keyword.trim()) {
      setError("❌ Keyword tidak boleh kosong!");
      return;
    }
    if (keyword.length > 100) {
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
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <h1 className="text-xl font-bold mb-4">🔒 Login</h1>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 mb-3 border rounded-md dark:bg-gray-700 dark:text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-3 border rounded-md dark:bg-gray-700 dark:text-white"
          />
          <button onClick={handleLogin} className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all">Login</button>
        </div>
      </div>
    );
  }
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center transition-all ${darkMode ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-900"}`}>
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">✨ Hoseliau ✨</h1>
          <button onClick={toggleDarkMode} className="px-4 py-2 rounded-md bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 transition-all text-gray-900 dark:text-white">
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
        {/* Hidden Logout Button */}
        <button onClick={handleLogout} className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all opacity-0 hover:opacity-100">Logout</button>
        {/* Input Keyword */}
        <input
          type="text"
          placeholder="Masukkan keyword artikel..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white text-gray-900"
        />
        {/* Generate button */}
        <button onClick={generateArticle} className="w-full mt-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all">✨ GENERATE ✨</button>
      </div>
      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center mt-4">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="ml-3">Sedang memproses...</p>
        </div>
      )}
      {/* Hasil Artikel */}
      {article && (
        <div ref={articleRef} className="w-full max-w-2xl mt-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-left leading-relaxed text-gray-900 dark:text-white" dangerouslySetInnerHTML={{ __html: article }} />
      )}
    </div>
  );
}

export default App;
