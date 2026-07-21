import { useState } from "react";
import axios from "axios";

function App() {

    const [description, setDescription] = useState("");
    const [platform, setPlatform] = useState("YouTube");
    const [tone, setTone] = useState("Professional");
    const [language, setLanguage] = useState("English");
    const [hooks, setHooks] = useState([]);
    const [generated, setGenerated] = useState(false);
    const [isRegenerating, setIsRegenerating] = useState(false)

    const API_URL = "http://127.0.0.1:8000/generate"

    const generateHooks = async () => {
        try {
            const response = await axios.post(
                API_URL,
                {
                    description,
                    platform,
                    tone,
                    language,
                    previous_hooks: isRegenerating ? hooks : null,
                }
            );

            setHooks(response.data.hooks);
            setGenerated(true);
            setIsRegenerating(true);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={{ maxWidth: "700px", margin: "50px auto" }}>
            <h1>ScrollStop</h1>

            <br />

            <textarea
                placeholder="Describe your content..."
                rows="6"
                value={description}
                onChange={(e) => {
                    setDescription(e.target.value);
                    setGenerated(false);
                    setIsRegenerating(false)
                }}
                style={{
                    width: "100%",
                    padding: "10px",
                }}
            ></textarea>

            <br />
            <br />

            <select
                value={platform}
                onChange={(e) => {
                    setPlatform(e.target.value);
                    setGenerated(false)
                    setIsRegenerating(false)
                }}
            >
                <option>YouTube</option>
                <option>Instagram</option>
                <option>TikTok</option>
                <option>LinkedIn</option>
                <option>X</option>
            </select>

            <br />
            <br />

            <select
                value={tone}
                onChange={(e) => {
                    setTone(e.target.value);
                    setGenerated(false);
                    setIsRegenerating(false)
                }}
            >
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

            <br />
            <br />

            <input
                type="text"
                list="languages"
                value={language}
                onChange={(e) => {
                    setLanguage(e.target.value);
                    setGenerated(false);
                    setIsRegenerating(false);
                }}
            />

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
                <option value="Italian" />
                <option value="Portuguese" />
                <option value="Japanese" />
                <option value="Korean" />
                <option value="Chinese" />
                <option value="Arabic" />
            </datalist>

            <br />
            <br />

            <button onClick={generateHooks}>
                {generated ? "Generate Again" : "Generate Hooks"}
            </button>

            <div className="results">
                {hooks.map((hook, index) => (
                    <p key={index}>
                        • {hook}
                    </p>
                ))}
            </div>

        </div>
    );
}

export default App;