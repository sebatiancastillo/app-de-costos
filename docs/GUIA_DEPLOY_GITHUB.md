# Guía de Deploy a GitHub — App de Costos

## Paso a paso del proceso completo, errores encontrados y soluciones

---

## 1. Situación inicial

El proyecto existía localmente con Git inicializado y commits locales, pero tenía un archivo **`backend/credentials.json`** con credenciales reales de Google OAuth (client_id, client_secret) que fueron comiteadas en los primeros commits.

```json
{
  "installed": {
    "client_id": "712556270833-...apps.googleusercontent.com",
    "client_secret": "GOCSPX-..."
  }
}
```

---

## 2. Primer intento de push — ERROR

```bash
git push origin main
```

**Resultado:** GitHub bloqueó el push automáticamente con:

```
GitHub detectó que en tu push estás subiendo algo que parece un secreto...
```

**Causa:** GitHub Secret Scanning Protection detectó las credenciales de Google OAuth en `backend/credentials.json` y bloqueó el push por seguridad.

---

## 3. Solución: Reorganizar estructura del proyecto (MVC)

Antes de limpiar el historial, se reorganizó la estructura del proyecto siguiendo el patrón MVC:

### Estructura original (desordenada):
```
public/
├── index.html
├── main.js
├── estilos.css
├── pages/
│   ├── html/        (cotizar.html, proyectos.html, etc.)
│   ├── Css/         (cotizacion.css, catalogo.css)
│   └── js/          (catalogo.js, catalogoo.js)
├── components/
│   ├── navbar.js
│   ├── form-material.js
│   ├── lista-materiales.js
│   └── estilos/
│       └── formulario.css
├── modules/quotations/
│   ├── Model.js
│   ├── Controller.js
│   ├── View.js
│   ├── Storage.js
│   ├── PDFGenerator.js
│   └── Utils.js
├── models/Cotizacion.js
├── controllers/CotizacionController.js
└── utils/PDFGenerator.js
db/firebase.js
backend/google_connect.py
```

### Estructura final (MVC):
```
public/
├── index.html                     # Vista principal (Dashboard)
├── main.js                        # Entry point
├── styles/                        # CSS
│   ├── estilos.css
│   ├── cotizacion.css
│   ├── catalogo.css
│   └── formulario.css
├── views/                         # Vistas HTML
│   ├── cotizar.html
│   ├── proyectos.html
│   ├── materiales.html
│   ├── catalogo.html
│   ├── ajustes.html
│   ├── cotizacion_en_proceso.html
│   ├── cotizaciones.html
│   ├── Cotizacion_List.html
│   └── ...
├── controllers/                   # Lógica de negocio
│   ├── CotizacionController.js
│   ├── CatalogController.js
│   ├── QuotationController.js
│   ├── QuotationViewController.js
│   └── catalogoo.js
├── models/                        # Modelos de datos
│   ├── Cotizacion.js
│   └── QuotationModel.js
├── components/                    # Componentes UI
│   ├── navbar.js
│   ├── form-material.js
│   └── lista-materiales.js
├── services/                      # Servicios
│   ├── FirebaseService.js
│   ├── StorageService.js
│   ├── PDFGeneratorService.js
│   └── PDFGenerator.js
└── utils/                         # Utilidades
    └── QuotationUtils.js
```

### Comandos usados:
```powershell
# Mover CSS
Move-Item -LiteralPath "public/pages/Css/cotizacion.css" "public/styles/"
Move-Item -LiteralPath "public/estilos.css" "public/styles/"

# Mover vistas HTML
Move-Item -LiteralPath "public/pages/html/cotizar.html" "public/views/"

# Mover controllers
Move-Item -LiteralPath "public/pages/js/catalogo.js" "public/controllers/CatalogController.js"

# Mover servicios
Move-Item -LiteralPath "db/firebase.js" "public/services/FirebaseService.js"

# Eliminar carpetas vacías
Remove-Item -LiteralPath "public/pages" -Recurse -Force
Remove-Item -LiteralPath "public/modules" -Recurse -Force
```

### Error encontrado — Rutas rotas:
Después de mover los archivos, las referencias en los HTMLs seguían apuntando a las ubicaciones antiguas (`../../estilos.css`, `pages/html/...`, etc.).

**Solución:** Actualizar todas las rutas en cada archivo HTML:
```powershell
# Ejemplo: en index.html
# Antes:  <link rel="stylesheet" href="estilos.css"/>
# Después: <link rel="stylesheet" href="styles/estilos.css"/>
# Antes:  <a href="pages/html/cotizar.html">
# Después: <a href="views/cotizar.html">
```

---

## 4. Solución definitiva: Limpiar historial de Git

### Paso 1: Verificar qué commits tienen el archivo sensible
```bash
git log --all --full-history -- "backend/credentials.json"
```
**Resultado:** Aparecía en 2 commits: el inicial y el "Primer commit".

### Paso 2: Eliminar el archivo del historial con filter-branch
```bash
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch backend/credentials.json" --prune-empty --tag-name-filter cat -- --all
```

**Output esperado:**
```
Rewrite a37b7ff... (1/6) rm 'backend/credentials.json'
Rewrite 8a4d7ac... (2/6) rm 'backend/credentials.json'
...
Ref 'refs/heads/main' was rewritten
```

### Paso 3: Limpiar referencias de respaldo y reflog
```bash
git update-ref -d refs/original/refs/heads/main
git reflog expire --expire=now --all
git gc --prune=now
```

### Paso 4: Verificar que se eliminó correctamente
```bash
git log --all --full-history -- "backend/credentials.json"
```
**Resultado:** Sin output = archivo eliminado del historial.

### Error encontrado — filter-branch warning:
```
WARNING: git-filter-branch has a glut of gotchas generating mangled history rewrites.
```
**Solución:** Es solo una advertencia, no un error. El proceso funcionó correctamente.

### Error encontrado — refs/original no se eliminaba:
```powershell
git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin
# Fallaba con: fatal: expected SP but got: ?
```
**Solución:** Usar `git update-ref -d refs/original/refs/heads/main` directamente.

---

## 5. Actualizar .gitignore

### Contenido original:
```
backend/credentials.json
backend/credentials.json
```

### Contenido final:
```
# Archivos sensibles
backend/credentials.json
*.env
.env.local
.env.*.local

# Node
node_modules/

# IDE
.vscode/
.continue/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
```

---

## 6. Push exitoso a GitHub

```bash
git push --force origin main
```

**Output:**
```
 * [new branch]      main -> main
```

**Push exitoso.** El proyecto ahora está en:
https://github.com/sebatiancastillo/app-de-costos

---

## 7. Resumen de errores y soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| GitHub bloquea push | `credentials.json` con secrets en el historial | `git filter-branch` para eliminar del historial |
| Rutas rotas en HTML | Archivos movidos de carpeta | Actualizar `href` y `src` en cada HTML |
| filter-branch warning | Advertencia de seguridad de Git | Ignorar, el proceso funciona correctamente |
| refs/original no se eliminaba con pipe | PowerShell no parsea bien el pipe de git | Usar `git update-ref -d` directamente |
| Push rechazado en main | Historial local diferente al remoto | Usar `git push --force` (después de limpiar secrets) |

---

## 8. Verificación final

```bash
git log --oneline
```
```
4cbde38 Actualizar .gitignore con archivos sensibles
d21b5d1 Reestructuración del proyecto: nuevas carpetas y limpieza de archivos
b445738 Ignorar credenciales en el repositorio
4dc5aeb Ignorar archivo de credenciales
d136687 primer commit
2229ced Primer commit de mi app de costos
```

Sin rastro de `credentials.json` en ningún commit. Repositorio limpio y seguro.
