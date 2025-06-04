import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [click, setClick] = useState(false);

  useEffect(() => {
    const move = (e) => setPosition({ x: e.clientX, y: e.clientY });
    const down = () => setClick(true);
    const up = () => setClick(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, []);

  const styleAura = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
  };

  const styleCore = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
  };

  const cursor = (
    <>
      <div className={`cursor-aura ${click ? "cursor-click" : ""}`} style={styleAura}></div>
      <div className={`cursor-core ${click ? "cursor-click" : ""}`} style={styleCore}></div>
    </>
  );

  return ReactDOM.createPortal(cursor, document.body); // 👈 Forzado al final del DOM
}
