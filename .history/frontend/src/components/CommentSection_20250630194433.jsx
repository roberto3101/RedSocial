import { useState } from "react";
import axios from "axios";
import { useProfile } from "../context/ProfileContext";

export default function CommentSection({ postSlug, initialComments = [] }) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { profile } = useProfile();

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!profile || !profile.username) {
      alert("Debes iniciar sesión para comentar");
      return;
    }

    if (!newComment.trim()) {
      alert("El comentario no puede estar vacío");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("jwt");
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/posts/${postSlug}/comment`,
        { content: newComment },
        { headers: