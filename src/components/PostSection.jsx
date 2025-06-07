import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { getPosts } from "../lib/posts";
import { useProfile } from "../context/ProfileContext";

// Define aquí el usuario demo
const DEMO_USER = "roberto3101";

export default function PostSection() {
  const [latest, setLatest] = useState([]);
  const { profile } = useProfile();

  useEffect(() => {
    getPosts()
      .then((data) => {
        // Si está logueado, muestra SUS artículos; si no, los del DEMO
        const username = profile?.username || DEMO_USER;
        const filtered = data.filter((p) => p.author === username);
        const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
        setLatest(sorted.slice(0, 3));
      })
      .catch(console.error);
  }, [profile]);

  return (
    <section className="posts-preview" id="posts">
      <div className="container">
        <h2>
          {profile?.username ? "Tus últimos artículos" : "Últimos artículos de demostración"}
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