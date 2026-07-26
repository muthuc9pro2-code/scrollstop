import { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";
import "./index.css";
import TopBar from "./components/TopBar";
import AuthModal from "./components/AuthModal";
import Sidebar from "./components/Sidebar";

const PLATFORMS = ["YouTube", "Instagram", "TikTok", "LinkedIn", "X"];

const TONES = [
  "Professional", "Sarcastic", "Funny", "Controversial", "Curiosity",
  "Emotional", "Storytelling", "Bold", "Luxury", "Dark Humor",
  "Shocking", "Motivational", "Educational",
];

const LANGUAGES = [
  "English", "Tamil", "Hindi", "Telugu", "Malayalam",
  "Kannada", "Spanish", "French", "German", "Japanese",
];

const API_URL = "http://127.0.0.1:8000/generate";
const LOGIN_URL = "http://127.0.0.1:8000/auth/login";
const ME_URL = "http://127.0.0.1:8000/auth/me";
const SIGNUP_URL = "http://127.0.0.1:8000/auth/signingup";

const EXIT_DURATION_MS = 260;

const EMPTY_ERRORS = { description: "", platform: "", tone: "", language: "" };

function App() {
  
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState("");
  const [tone, setTone] = useState("");
  const [language, setLanguage] = useState("");
  const [errors, setErrors] = useState(EMPTY_ERRORS);

 
  const [hooks, setHooks] = useState([]);
  const [resultsBatch, setResultsBatch] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState(false);
  const [hasFreshResults, setHasFreshResults] = useState(false);

  const previousHooksRef = useRef(null);

  
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState(null); 
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const signup = async ({ username, email, password }) => {
    await axios.post(SIGNUP_URL, { username, email, password });
    await login({ email, password });
  };


  const login = async ({ email, password }) => {
    const response = await axios.post(LOGIN_URL, { email, password });
    localStorage.setItem("access_token", response.data.access_token);
    await getMe();
  };

  const getMe = async () => {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(ME_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(response.data);
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      getMe().catch(() => localStorage.removeItem("access_token"));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    setSidebarOpen(false);
  };

  const handleAuthSuccess = () => setAuthMode(null);

  const handleSignupSubmit = async (payload) => {
    await signup(payload);
    handleAuthSuccess();
  };

  const handleLoginSubmit = async (payload) => {
    await login(payload);
    handleAuthSuccess();
  };

 
  const validate = () => {
    const next = {
      description: description.trim() ? "" : "Description is required.",
      platform: platform ? "" : "Please select a platform.",
      tone: tone ? "" : "Please select a tone.",
      language: language.trim() ? "" : "Please select a language.",
    };
    setErrors(next);
    return Object.values(next).every((message) => !message);
  };

  const clearFieldError = (field) =>
    setErrors((prev) => (prev[field] ? { ...prev, [field]: "" } : prev));

  const handleFieldChange = (setter, field) => (event) => {
    setter(event.target.value);
    clearFieldError(field);
    if (hasFreshResults) {
      setHasFreshResults(false);
    }
  };

  const requestHooks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.post(API_URL, {
        description,
        platform,
        tone,
        language,
        previous_hooks: previousHooksRef.current,
      });
      previousHooksRef.current = response.data.hooks;
      setHooks(response.data.hooks);
      setResultsBatch((n) => n + 1);
      setHasGeneratedOnce(true);
      setHasFreshResults(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setIsExiting(false);
    }
  }, [description, platform, tone, language]);

  const handleGenerate = () => {
    if (!validate()) return;
    if (hooks.length > 0) {
      setIsExiting(true);
      window.setTimeout(requestHooks, EXIT_DURATION_MS);
    } else {
      requestHooks();
    }
  };

  const isSplit = hasGeneratedOnce;

  return (
    <div className="shell">
      <TopBar
        user={user}
        onOpenLogin={() => setAuthMode("login")}
        onOpenSignup={() => setAuthMode("signup")}
        onAvatarClick={() => setSidebarOpen((open) => !open)}
      />

      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSwitchMode={(mode) => setAuthMode(mode)}
          onSubmitLogin={handleLoginSubmit}
          onSubmitSignup={handleSignupSubmit}
        />
      )}

      <Sidebar
        open={sidebarOpen}
        user={user}
        onClose={() => setSidebarOpen(false)}
        onLogout={logout}
      />

      <main className={`layout ${isSplit ? "layout--split" : "layout--centered"}`}>
        <section className={`panel panel--form ${isSplit ? "panel--form-compact" : ""}`}>
          <div className="brand">
            <span className="brand__mark">ScrollStop</span>
            <p className="brand__subtitle">Generate viral hooks with AI</p>
          </div>

          <div className="field">
            <textarea
              className={`input input--textarea ${isSplit ? "input--textarea-compact" : ""}`}
              placeholder="Describe your content..."
              value={description}
              onChange={handleFieldChange(setDescription, "description")}
            />
            {errors.description && <p className="field__error">{errors.description}</p>}
          </div>

          <div className="field-row">
            <div className="field">
              <select
                className="input"
                value={platform}
                onChange={handleFieldChange(setPlatform, "platform")}
              >
                <option value="" disabled hidden>Select platform</option>
                {PLATFORMS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
              {errors.platform && <p className="field__error">{errors.platform}</p>}
            </div>

            <div className="field">
              <select
                className="input"
                value={tone}
                onChange={handleFieldChange(setTone, "tone")}
              >
                <option value="" disabled hidden>Select tone</option>
                {TONES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              {errors.tone && <p className="field__error">{errors.tone}</p>}
            </div>
          </div>

          <div className="field">
            <input
              type="text"
              list="languages"
              className="input"
              placeholder="Select language"
              value={language}
              onChange={handleFieldChange(setLanguage, "language")}
            />
            <datalist id="languages">
              {LANGUAGES.map((l) => (
                <option key={l} value={l} />
              ))}
            </datalist>
            {errors.language && <p className="field__error">{errors.language}</p>}
          </div>

          <button className="btn" onClick={handleGenerate} disabled={loading}>
            {loading ? (
              <span className="loading" aria-label="Generating">
                <span></span><span></span><span></span>
              </span>
            ) : hasFreshResults ? (
              "Generate again"
            ) : (
              "Generate hooks"
            )}
          </button>
        </section>

        {hasGeneratedOnce && (
          <section className={`panel panel--results ${isExiting ? "is-exiting" : ""}`}>
            <div className="results" key={resultsBatch}>
              {hooks.map((hook, index) => (
                <p
                  key={index}
                  className="hook"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <span className="hook__index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="hook__text">{hook}</span>
                </p>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
