function Sidebar({ open, user, onClose, onLogout, history, onSelectHistory }) {
  const initial = user?.username ? user.username.charAt(0).toUpperCase() : "?";

  return (
    <>
      <div className={`sidebar-overlay ${open ? "is-open" : ""}`} onClick={onClose} />
      <aside className={`sidebar ${open ? "is-open" : ""}`}>
        <button type="button" className="sidebar__close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="sidebar__profile">
          <div className="avatar avatar--lg">
            <span className="avatar__initial">{initial}</span>
          </div>
          <p className="sidebar__username">{user?.username}</p>
        </div>

        <div className="sidebar__history">
          <p className="sidebar__label">History</p>
          <div className="sidebar__history-list">
            {history.length === 0 ? (
              <p className="sidebar__empty">No history yet</p>
            ) : (
              history.map((item) => (
                <button
                  key={item.id ?? item.description}
                  type="button"
                  className="sidebar__history-item"
                  title={item.description}
                  onClick={() => onSelectHistory(item.description)}
                >
                  {item.description}
                </button>
              ))
            )}
          </div>
        </div>

        <button type="button" className="sidebar__logout" onClick={onLogout}>
          Log out
        </button>
      </aside>
    </>
  );
}

export default Sidebar;
