import { Link } from "react-router-dom";

export default function SearchDropDown({ results, type, onClose }) {
  const safeResults = Array.isArray(results) ? results : [];

  if (!safeResults.length) {
    return (
      <div className="search-dropdown">
        <div className="search-no-results">No hay resultados.</div>
      </div>
    );
  }
  return (
    <div className="search-dropdown">
      {safeResults.map((item) =>
        type === "users" ? (
          <Link
            key={item._id}
            to={`/user/${item.username}`}
            className="search-result user"
            onClick={onClose}
          >
            <img
              src={item.avatar || "/default-avatar.png"}
              alt={item.username}
              className="search-avatar"
            />
            <div>
              <span className="search-username">{item.username}</span>
              <span className="search-name">{item.name}</span>
              {item.about && (
                <span className="search-user-about">
                  {item.about.slice(0, 54)}
                  {item.about.length > 54 ? "..." : ""}
                </span>
              )}
            </div>
          </Link>
        ) : (
          <Link
            key={item._id}
            to={`/posts/${item._id}`}
            className="search-result post"
            onClick={onClose}
          >
            <div>
              <span className="search-post-title">{item.title}</span>
              <span className="search-post-author">por {item.authorUsername}</span>
            </div>
          </Link>
        )
      )}
    </div>
  );
}