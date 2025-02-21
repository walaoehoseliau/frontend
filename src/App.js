import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
function App() {
    const [keyword, setKeyword] = useState("");
    const [article, setArticle] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });
    const articleRef = useRef(null);
    // Handle Generate Artikel
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
            const { data } = await axios.post('https://backend-q1oq.onrender.com/generate', { keyword });
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
        <div style={{
            maxWidth: "800px",
            margin: "20px auto",
            fontFamily: "Roboto, sans-serif",
            textAlign: "center",
            backgroundColor: darkMode ? "#1a1a1a" : "#ffffff",
            color: darkMode ? "#f0f0f0" : "#000000",
            minHeight: "100vh",
            padding: "20px",
            transition: "background-color 0.3s ease, color 0.3s ease"
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>✨Walaoe✨</h1>
                <button
                    onClick={toggleDarkMode}
                    style={{
                        padding: "8px 12px",
                        borderRadius: "5px",
                        border: "none",
                        cursor: "pointer",
                        backgroundColor: darkMode ? "#f0f0f0" : "#333",
                        color: darkMode ? "#000" : "#fff",
                        fontSize: "14px",
                        transition: "background-color 0.3s ease, color 0.3s ease"
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
					style={{
						width: "80%",
						padding: "10px",
						fontSize: "16px",
						marginBottom: "10px",
						borderRadius: "5px",
						border: `1px solid ${darkMode ? "#444" : "#ddd"}`,
						backgroundColor: darkMode ? "#333" : "#fff",
						color: darkMode ? "#f0f0f0" : "#000",
						transition: "background-color 0.3s ease, color 0.3s ease"
					}}
					maxLength={100}
				/>
				<button
					onClick={generateArticle}
					style={{
						backgroundColor: loading ? "#6c757d" : "#007bff",
						color: "white",
						padding: "10px 20px",
						fontSize: "16px",
						borderRadius: "5px",
						border: "none",
						cursor: loading ? "not-allowed" : "pointer",
						opacity: loading ? 0.7 : 1,
						transition: "opacity 0.3s ease"
					}}
					disabled={loading}
				>
					{loading ? "⏳ Generating..." : "✨ Generate Article ✨"}
				</button>
            {article && (
                <div ref={articleRef} style={{ marginTop: "20px", textAlign: "left" }}>
                    <div
                        style={{
                            border: `2px solid ${darkMode ? "#444" : "#ddd"}`,
                            padding: "15px",
                            borderRadius: "5px",
                            background: darkMode ? "#222" : "#f9f9f9",
                            color: darkMode ? "#f0f0f0" : "#000",
                            whiteSpace: "normal",
                            transition: "background-color 0.3s ease, color 0.3s ease"
                        }}
                        dangerouslySetInnerHTML={{ __html: article }}
                    />
	                    <button
                        onClick={copyToClipboard}
                        style={{
                            backgroundColor: copied ? "#28a745" : "#007bff",
                            color: "white",
                            padding: "10px",
                            fontSize: "16px",
                            borderRadius: "5px",
                            border: "none",
                            cursor: "pointer",
                            marginTop: "10px",
                            transition: "background-color 0.3s ease"
                        }}
                    >
                        {copied ? "✅ Copied!" : "📋 Copy HTML"}
                    </button>
						{article && (
							<div style={{ marginTop: "20px" }}>
								<button
									onClick={() => {
										navigator.clipboard.writeText(article);
										window.open("https://rentry.co", "_blank");
									}}
									style={{
										backgroundColor: "#28a745",
										color: "white",
										padding: "10px",
										fontSize: "16px",
										borderRadius: "5px",
										border: "none",
										cursor: "pointer",
										marginBottom: "10px",
										transition: "background-color 0.3s ease"
									}}
								>
								📋 EDITOR
								</button>
							</div>
						)}
                </div>
            )}
        </div>
    );
}
export default App;
