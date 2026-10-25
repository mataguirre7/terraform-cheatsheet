# Terraform Cheatsheets

Cheatsheets visuales de Terraform en español: diagramas, comandos con buscador, HCL resaltado, botón copiar y tema claro/oscuro.
Sitio 100 % estático (HTML + CSS + JS, sin build ni dependencias). Todo aplica también a OpenTofu (`tofu`).

| Hoja | Contenido |
|---|---|
| `index.html` | Portada, buscador “Quiero…” y descargas en PNG |
| `01-conceptos.html` | Flujo init → plan → apply, providers, estado deseado vs real, cómo leer un plan, glosario |
| `02-cli.html` | CLI completa: plan/apply, init, outputs, `state`, `import`, workspaces, variables de entorno, CI |
| `03-lenguaje-hcl.html` | Bloques, tipos, referencias, expresiones, `count` vs `for_each`, `dynamic`, `lifecycle`, `moved`, funciones |
| `04-variables-estado.html` | Variables y precedencia, outputs, locals, archivo de estado, bloqueo, backends, secretos |
| `05-modulos-proyecto.html` | Módulos, fuentes, versiones de providers, estructura con un entorno por carpeta |
| `06-practica-docker.html` | Práctica sin cuenta de cloud: app Node + MongoDB con el provider `kreuzwerker/docker` |
| `07-problemas.html` | Errores comunes con causa y solución |

## Estructura

```
terraform-cheatsheets/
├── index.html, 01-…07-*.html   # páginas
├── 404.html                    # página de error (Netlify la usa sola)
├── assets/
│   ├── style.css               # estilos y temas
│   └── app.js                  # navegación, buscador, copiar, resaltado (sh, hcl, yaml)
├── img/                        # cada hoja exportada a PNG (oscuro y claro)
└── netlify.toml                # config de deploy
```

## Verlo en local

Doble clic en `index.html` funciona. Para probarlo igual que en Netlify (rutas absolutas del 404, portapapeles):

```bash
python -m http.server 8080
```

y abrí <http://localhost:8080>.

## Subir a GitHub

1. Creá un repositorio **vacío** en <https://github.com/new> (sin README ni .gitignore), por ejemplo `terraform-cheatsheets`.
2. Desde esta carpeta:

```bash
git remote add origin https://github.com/<tu-usuario>/terraform-cheatsheets.git
git push -u origin main
```

## Publicar en Netlify

1. <https://app.netlify.com> → **Add new site → Import an existing project → GitHub**.
2. Elegí el repo `terraform-cheatsheets`.
3. Dejá **Build command** vacío y **Publish directory** en `.` (ya lo define `netlify.toml`).
4. **Deploy**. Cada `git push` a `main` vuelve a publicar solo.
5. Opcional: **Site configuration → Change site name** para tener `terraform-cheatsheets.netlify.app` (si está libre).

## Enlazar con otras cheatsheets

En `assets/app.js`, completá la URL de otro sitio y aparece el botón en la barra:

```js
other: { label: "Docker", href: "https://<tu-sitio-docker>.netlify.app/", icon: "whale" },
```

## Editar contenido

- Cada página es HTML plano: agregá tarjetas copiando una existente (`<div class="card t-cont">…</div>`).
- Los bloques `<pre><code>` se resaltan y reciben el botón copiar solos. `data-lang="hcl"`, `"yaml"`, `"dockerfile"` o `"plain"` cambia el resaltado (por defecto, shell).
- Los valores a reemplazar se escriben como `&lt;nombre&gt;` y se ven en rosa.
- Las imágenes de `img/` **no se regeneran solas**: si cambiás una hoja, volvé a exportarla (por ejemplo, con la captura de página completa de las DevTools del navegador, abriendo la hoja con `?theme=dark` o `?theme=light`).
