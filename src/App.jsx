import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL; // Netlify'da tanımladığımız değişken

  const [health, setHealth] = useState({
    loading: true,
    ok: false,
    error: null,
    data: null,
  });

  useEffect(() => {
    async function checkHealth() {
      if (!API_BASE) {
        setHealth({
          loading: false,
          ok: false,
          error:
            "VITE_API_BASE_URL bulunamadı. Netlify ortam değişkenini kontrol edin.",
          data: null,
        });
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/health`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(
            `Health isteği başarısız (HTTP ${res.status}): ${text}`
          );
        }

        const json = await res.json();
        setHealth({ loading: false, ok: true, error: null, data: json });
      } catch (err) {
        setHealth({
          loading: false,
          ok: false,
          error: err.message || "Bilinmeyen hata",
          data: null,
        });
      }
    }

    checkHealth();
  }, [API_BASE]);

  return (
    <div className="app">
      <header className="app__header">
        <h1>CRMS Frontend</h1>
        <p>Vite + React başlangıç</p>
      </header>

      <section className="card">
        <h2>API Bağlantı Testi</h2>
        <div className="row">
          <span className="label">API Base URL:</span>
          <code className="value">{API_BASE || "(tanımlı değil)"}</code>
        </div>

        {health.loading && <div className="badge badge--loading">Yükleniyor…</div>}

        {!health.loading && health.ok && (
          <div className="badge badge--ok">API OK</div>
        )}

        {!health.loading && !health.ok && (
          <div className="badge badge--err">
            API Hatası: {health.error || "Bilinmeyen hata"}
          </div>
        )}

        {health.data && (
          <pre className="pre">
            {JSON.stringify(health.data, null, 2)}
          </pre>
        )}
      </section>
    </div>
  );
}

export default App;
