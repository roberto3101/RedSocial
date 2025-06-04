/*****************  src/components/PostSection.jsx  *****************/
import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { getPosts } from "../lib/posts";  // usa la función que trae posts del backend

export default function PostSection() {
  const [latest, setLatest] = useState([]);

  useEffect(() => {
    getPosts()
      .then((data) => {
        const sorted = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
        setLatest(sorted.slice(0, 3)); // ← últimos 3
      })
      .catch(console.error);
  }, []);

  return (
    <section className="posts-preview" id="posts">
      <div className="container">
        <h2>Últimos artículos</h2>

        <div className="posts-grid">
          {latest.map((p) => (
            <PostCard key={p.slug} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}
