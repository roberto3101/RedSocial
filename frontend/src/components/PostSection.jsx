import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostCard from "./PostCard";
import { getPosts } from "../lib/posts";
import { useProfile } from "../context/ProfileContext";

// Define aquí el usuario demo
const DEMO_USER = "roberto3101";

export default function PostSection() {
  const [latest, setLatest] = useState([]);
  const { profile } = useProfile();
  const { username: paramUsername } = useParams(); // username de la URL si existe

  useEffect(() => {
    getPosts()
      .then((data) => {
        // Prioridad: username de la URL > perfil logueado > demo
        const username = paramUsername || profile?.username || DEMO_USER;
        const filtered = data.filter((p) => p.author === username);
        const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
        setLatest(sorted.slice(0, 3));
      })
      .catch(console.error);
  }, [paramUsername, profile]);

  return (
    <section className="posts-preview" id="posts">
      <div className="container">
        <h2>
          {paramUsername
            ? `Últimos artículos de ${paramUsername}`
            : profile?.username
              ? "Tus últimos artículos"
              : "Últimos posts del desarrollador"}
        </h2>
        <div className="posts-grid">
          {latest.map((p) => (
            <PostCard key={p.slug} {...p} />
          ))}
          {latest.length === 0 && <p>No hay publicaciones.</p>}
        </div>
      </div>
    </section>
  );
}
// PostSection.jsx