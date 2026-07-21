import { useState } from "react";
import axios from "axios";

function App() {
    const [description, setDescription] = useState("");
    const [platform, setPlatform] = useState("");
    const [tone, setTone] = useState("");
    const [language, setLanguage] = useState("");
    const [hooks, setHooks] = useState([]);
    const [generated, setGenerated] = useState(false);
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ description: "", platform: "", tone: "", language: "" });
    const API_URL = "http://127.0.0.1:8000/generate";

    const reset = () => { setGenerated(false); setIsRegenerating(false); };

    const validate = () => {
        const e = {};
        if (!description.trim()) e.description = "Description is required.";
        if (!platform) e.platform = "Please select a platform.";
        if (!tone) e.tone = "Please select a tone.";
        if (!language.trim()) e.language = "Please select a language.";
        setErrors({
            description: e.description || "",
            platform: e.platform || "",
            tone: e.tone || "",
            language: e.language || ""
        });
        return Object.keys(e).length === 0;
    };

    const generateHooks = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            const response = await axios.post(API_URL, {
                description, platform, tone, language,
                previous_hooks: isRegenerating ? hooks : null
            });
            setHooks(response.data.hooks);
            setGenerated(true);
            setIsRegenerating(true);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    return (
        <div className={generated ? "app generated" : "app"}>
            <div className="left-panel">
                <h1>ScrollStop</h1>
                <p className="subtitle">Generate viral hooks with AI</p>

                <textarea placeholder="Describe your content..." value={description}
                    onChange={(e) => {
                        setDescription(e.target.value);
                        setErrors({ ...errors, description: "" });
                        reset();
                    }} />
                {errors.description && <p className="error">{errors.description}</p>}

                <select value={platform}
                    onChange={(e) => {
                        setPlatform(e.target.value);
                        setErrors({ ...errors, platform: "" });
                        reset();
                    }}>
                    <option value="">Select Platform</option>
                    <option>YouTube</option>
                    <option>Instagram</option>
                    <option>TikTok</option>
                    <option>LinkedIn</option>
                    <option>X</option>
                </select>
                {errors.platform && <p className="error">{errors.platform}</p>}

                <select value={tone}
                    onChange={(e) => { setTone(e.target.value); setErrors({ ...errors, tone: "" }); reset(); }}>
                    <option value="">Select Tone</option>
                    <option>Professional</option>
                    <option>Sarcastic</option>
                    <option>Funny</option>
                    <option>Controversial</option>
                    <option>Curiosity</option>
                    <option>Emotional</option>
                    <option>Storytelling</option>
                    <option>Bold</option>
                    <option>Luxury</option>
                    <option>Dark Humor</option>
                    <option>Shocking</option>
                    <option>Motivational</option>
                    <option>Educational</option>
                </select>
                {errors.tone && <p className="error">{errors.tone}</p>}

                <input type="text" list="languages" placeholder="Select language" value={language}
                    onChange={(e) => {
                        setLanguage(e.target.value);
                        setErrors({ ...errors, language: "" });
                        reset();
                    }} />
                <datalist id="languages">
                    <option value="English" />
                    <option value="Tamil" />
                    <option value="Hindi" />
                    <option value="Telugu" />
                    <option value="Malayalam" />
                    <option value="Kannada" />
                    <option value="Spanish" />
                    <option value="French" />
                    <option value="German" />
                    <option value="Japanese" />
                </datalist>
                {errors.language && <p className="error">{errors.language}</p>}

                <button onClick={generateHooks} disabled={loading}>
                    {loading ? <div className="loading">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div> : generated ? "Generate Again" : "Generate Hooks"}
                </button>
            </div>

            {generated && (
                <div className="right-panel">
                    <div className="results">
                        {hooks.map((hook, index) => (
                            <p key={index} className="hook" style={{ animationDelay: `${index * 150}ms` }}>• {hook}</p>
                        ))}
                    </div>
                </div>)}
        </div>
    );
}
export default App;