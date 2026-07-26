function TopBar({ user, onOpenLogin, onOpenSignup, onAvatarClick }) {
  const initial = user?.username ? user.username.charAt(0).toUpperCase() : null;

  return (
    <div className="topbar">
      <button
        type="button"
        className="avatar"
        onClick={user ? onAvatarClick : undefined}
        aria-label={user ? "Open menu" : "Account"}
      >
        {initial ? (
          <span className="avatar__initial">{initial}</span>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" className="avatar__icon">
            <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
            <path
              d="M4.5 19.5c1.6-3.4 4.4-5 7.5-5s5.9 1.6 7.5 5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>

      {!user && (
        <div className="topbar__auth">
          <button type="button" className="link" onClick={onOpenSignup}>
            Create account
          </button>
          <span className="topbar__divider">/</span>
          <button type="button" className="link" onClick={onOpenLogin}>
            Login
          </button>
        </div>
      )}
    </div>
  );
}

export default TopBar;
