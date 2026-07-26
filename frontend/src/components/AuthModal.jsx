import { useState } from "react";

const USERNAME_MIN = 5;
const USERNAME_MAX = 25;

function AuthModal({ mode, onClose, onSwitchMode, onSubmitLogin, onSubmitSignup }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shakeUsername, setShakeUsername] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isSignup = mode === "signup";

  const triggerShake = () => {
    setShakeUsername(true);
    window.setTimeout(() => setShakeUsername(false), 400);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSignup && username.trim().length === 0) {
      setError("Username is required.");
      triggerShake();
      return;
    }
    if (isSignup && username.length < USERNAME_MIN) {
      setError(`Username must be at least ${USERNAME_MIN} characters.`);
      triggerShake();
      return;
    }
    if (isSignup && username.length > USERNAME_MAX) {
      setError(`Username must be ${USERNAME_MAX} characters or fewer.`);
      triggerShake();
      return;
    }
    if (!email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      if (isSignup) {
        await onSubmitSignup({ username, email, password });
      } else {
        await onSubmitLogin({ email, password });
      }
    } catch {
      setError(isSignup ? "Could not create account. Try again." : "Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <h2 className="modal__title">{isSignup ? "Create account" : "Login"}</h2>

        <form className="modal__form" onSubmit={handleSubmit}>
          {isSignup && (
            <div className="field">
              <input
                type="text"
                className={`input ${shakeUsername ? "input--shake" : ""}`}
                placeholder="Username"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  setError("");
                }}
              />
              <p className={`field__hint ${error ? "field__hint--error" : ""}`}>
                {error || `${USERNAME_MIN}–${USERNAME_MAX} characters`}
              </p>
            </div>
          )}

          <div className="field">
            <input
              type="email"
              className="input"
              placeholder="Email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
            />
          </div>

          <div className="field">
            <input
              type="password"
              className="input"
              placeholder="Password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
            />
          </div>

          {!isSignup && error && <p className="field__error">{error}</p>}

          <button type="submit" className="btn" disabled={submitting}>
            {submitting ? (
              <span className="loading" aria-label="Please wait">
                <span></span><span></span><span></span>
              </span>
            ) : isSignup ? (
              "Create account"
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="modal__switch">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <button type="button" className="link" onClick={() => onSwitchMode("login")}>
                Log in
              </button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <button type="button" className="link" onClick={() => onSwitchMode("signup")}>
                Create account
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default AuthModal;
