title: "Primeros pasos con React"
date: "2025-07-17"
slug: "primeros-pasos-react"
---

## Introducción

React es una de las bibliotecas más populares para construir interfaces de usuario modernas y reactivas. En este artículo repasaremos desde la instalación hasta conceptos básicos como JSX, componentes, estado y efectos. Al finalizar tendrás una base sólida para comenzar a crear tus propias aplicaciones con React.

---

## 1. Instalación del entorno

1. **Node.js y npm**  
   Asegúrate de tener instalado Node.js (v14+) junto con npm o yarn:  
   ```bash
   node -v
   npm -v
   ```

2. **Crear un proyecto con Vite**  
   Vite ofrece un arranque ultrarrápido para React:
   ```bash
   npm create vite@latest mi-app-react -- --template react
   cd mi-app-react
   npm install
   npm run dev
   ```
   Esto levanta el servidor en http://localhost:5173/.

3. **Estructura básica de carpetas**  
   Tras crear tu proyecto verás una estructura similar a:
   ```
   mi-app-react/
   ├─ public/
   │  └─ favicon.svg
   ├─ src/
   │  ├─ App.jsx
   │  ├─ main.jsx
   │  ├─ assets/
   │  └─ components/
   └─ index.html
   ```
   - **main.jsx**: punto de entrada que monta `<App />`.
   - **App.jsx**: componente raíz donde definirás tu router o layout.
   - **components/**: aquí crearás tus componentes reutilizables.

---

## 2. JSX: JavaScript + HTML

En React escribimos JSX, que combina sintaxis HTML con poder de JavaScript:

```jsx
function Saludo({ nombre }) {
  return <h1>¡Hola, {nombre}!</h1>;
}

export default function App() {
  return (
    <div>
      <Saludo nombre="Roberto" />
    </div>
  );
}
```
⚠️ No uses `class`, usa `className`.  
🔄 Las expresiones JS se incluyen entre `{}`.

---

## 3. Componentes y Props

Los componentes son funciones que reciben props y retornan UI:

```jsx
// src/components/Button.jsx
export default function Button({ texto, onClick }) {
  return (
    <button className="btn-cta" onClick={onClick}>
      {texto}
    </button>
  );
}
```

Y en tu `App.jsx`:

```jsx
import Button from "./components/Button";

function App() {
  return <Button texto="Clic aquí" onClick={() => alert("¡Hola!")} />;
}
```

---

## 4. Estado local con useState

Para interactuar y actualizar la UI con datos dinámicos:

```jsx
import { useState } from "react";

export default function Contador() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Clics: {count}</p>
      <button onClick={() => setCount(count + 1)}>Incrementar</button>
    </div>
  );
}
```
✅ El hook `useState` devuelve un valor y su setter.

---

## 5. Efectos secundarios con useEffect

Útil para peticiones, suscripciones o manipular el DOM:

```jsx
import { useState, useEffect } from "react";

export default function Datos() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("https://api.example.com/items")
      .then(res => res.json())
      .then(json => setData(json));
  }, []); // ← array de dependencias vacío: se ejecuta una sola vez

  if (!data) return <p>Cargando...</p>;
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

---

## 6. Navegación con React Router

Para rutas de cliente:

```bash
npm install react-router-dom
```

En `App.jsx`:

```jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Blog from "./pages/Blog";

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/blog">Blog</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## Conclusión

Hemos repasado los primeros pasos en React:

- Configuración rápida con Vite  
- JSX y componentes  
- Props y estado con `useState`  
- Efectos con `useEffect`  
- Navegación con React Router  

A partir de aquí, explora conceptos más avanzados como Context, hooks personalizados, optimización de performance y más.  
💡 **Tip profesional**: organiza tu proyecto separando secciones (`pages/`), componentes (`components/`) y utilidades (`hooks/`, `utils/`) para mantener tu código limpio y escalable.
