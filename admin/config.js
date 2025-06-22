// public/admin/config.js
window.CMS_MANUAL_INIT = true;

window.CMS.init({
  backend: {
    name: "git-gateway",
    branch: "main",
  },
  media_folder: "imagenes/uploads",
  public_folder: "/imagenes/uploads",
  collections: [
    {
      name: "blog",
      label: "Blog",
      folder: "src/posts",
      create: true,
      slug: "{{slug}}",
      fields: [
        { label: "Título", name: "title", widget: "string" },
        { label: "Fecha", name: "date", widget: "datetime" },
        { label: "Descripción", name: "excerpt", widget: "text" },
        { label: "Contenido", name: "body", widget: "markdown" },
      ],
    },
  ],
});
