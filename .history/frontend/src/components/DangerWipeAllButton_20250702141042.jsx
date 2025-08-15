import React from "react";

export default function DangerWipeAllButton() {
  const handleClick = async () => {
    if (
      !window.confirm(
        "¡PELIGRO! ¿Estás seguro de borrar TODOS los datos del sistema? (usuarios, posts, chats, proyectos, perfiles, TODO)\n\nEsto no se puede deshacer. Hazlo solo si sabes lo que haces."
      )
    ) return;
    try {
      const res = await fetch(
        "https://redsocial-api.eba-33ex33fi.us-east-1.elasticbeanstalk.com/danger-wipe-all",
        { method: "POST" }
      );
      const data = await res.json();
      if (data.ok) {
        alert("¡Todos los datos han sido borrados!");
      } else {
        alert("Hubo errores al borrar algunos archivos:\n" + JSON.stringify(data.errors));
      }
    } catch (err) {
      alert("Error al llamar al backend: " + err.message);
    }
  };

  return (
    <button
      style={{
        background: "#d90429",
        color: "white",
        fontWeight: "bold",
        fontSize: "1.1em",
        padding: "1em 2.5em",
        border: "none",
        borderRadius: "12px",
        boxShadow: "0 2px 6px #3333",
        margin: "3em auto 0",
        display: "block",
        cursor: "pointer"
      }}
      onClick={handleClick}
    >
      🛑 BORRAR TODO (USUARIOS, CHATS, ETC.)
    </button>
  );
}
