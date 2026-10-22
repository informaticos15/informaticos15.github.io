// script.js - Informáticos 15 · portal educativo con Google Sheets como gestor de contenido
// Cada FILA de la pestaña "Articulos" es un artículo. Ver GUIA_ARTICULOS.md

const SPREADSHEET_ID = '1dHUk2XI6hkfz0yESTpG6x1tVjXgrOWLoOqMUzrmSVwQ';
const NOMBRE_SITIO = 'Informáticos 15';

// =====================================================================
//  PENSUM: el menú sale de aquí. En la columna "materia" del Sheet se escribe
//  el nombre tal cual (sin importar tildes ni mayúsculas) y el artículo cae en su sección.
// =====================================================================
const MENU = [
  { nombre: 'Heurística', icono: 'fa-search', clase: 'nav-heuristica',
    items: ['Intro Investigación', 'Investigación Educativa'] },
  { nombre: 'Programación', glifo: '{ }', clase: 'nav-programacion',
    items: ['Estructura de Datos I', 'Estructura de Datos II', 'Estructura de Datos III', 'Bases de Datos', 'Lenguajes de Programación Web', 'Internet y HTML'] },
  { nombre: 'Matemática', glifo: '∑', clase: 'nav-matematica',
    items: ['Intro al Cálculo', 'Intro al Álgebra', 'Estadística', 'Cálculo Integral', 'Álgebra Lineal', 'Matemática Discreta'] },
  { nombre: 'Sistemas', glifo: 'ㅱ', clase: 'nav-sistemas',
    items: ['Electrónica Digital', 'Redes de Computadoras', 'Sistemas de Información', 'Sistemas de Computación', 'Redes Informáticas'] },
  { nombre: 'Biblioteca', icono: 'fa-book', clase: 'nav-biblioteca',
    items: ['Pensum UPEL', 'Recursos', 'Libros de Texto', 'Reglamentos', 'Planes de Curso'] },
  { nombre: 'Workshops', icono: 'fa-code', clase: 'nav-workshops',
    items: ['Rey de Redes', 'Google Sheets', 'Automatización', 'Web Dev'] }
];

// ===== utilidades puras (se pueden probar sin navegador) =====
const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sinTildes = t => String(t == null ? '' : t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const slug = t => sinTildes(t).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const normKey = k => sinTildes(k).replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

const MATERIAS = {};   // slug -> { nombre, area }
const AREAS = {};      // slug -> { nombre, clase, ... }
MENU.forEach(a => {
  a.id = slug(a.nombre);
  AREAS[a.id] = a;
  a.items.forEach(n => { MATERIAS[slug(n)] = { nombre: n, area: a.id }; });
});

// Nombres de columna aceptados (así tu hoja puede llamarlas como prefieras)
const ALIAS = {
  id_art: ['id_art', 'id', 'idart', 'id_articulo'],
  estado: ['estado', 'status'],
  titulo: ['titulo', 'title'],
  subtitulo: ['subtitulo', 'subtitle'],
  imagen_banner: ['imagen_banner', 'banner', 'banner_url', 'imagen_url', 'imagen'],
  resumen: ['resumen', 'descripcion'],
  parrafo_intro: ['parrafo_intro', 'intro', 'introduccion', 'parrafo_introduccion'],
  parrafo_1: ['parrafo_1', 'parrafo1', 'primer_parrafo', 'primerparrafo'],
  imagen_derecha: ['imagen_derecha', 'imagen_lateral_derecha', 'imagen_lat_derecha', 'imagen_lat_der', 'img_derecha'],
  parrafo_2: ['parrafo_2', 'parrafo2', 'segundo_parrafo'],
  parrafo_3: ['parrafo_3', 'parrafo3', 'tercer_parrafo'],
  imagen_izquierda: ['imagen_izquierda', 'imagen_lateral_izquierda', 'imagen_lat_izquierda', 'imagen_lat_izq', 'imagne_lat_izq', 'img_izquierda'],
  parrafo_4: ['parrafo_4', 'parrafo4', 'cuarto_parrafo'],
  conclusion: ['conclusion', 'conclusiones'],
  otros_links: ['otros_links', 'parrafo_otros_links', 'links', 'enlaces', 'otros_enlaces'],
  fuentes: ['fuentes', 'parrafo_fuentes', 'referencias', 'bibliografia'],
  materia: ['materia', 'asignatura', 'tema'],
  area: ['area', 'categoria'],
  etiquetas: ['etiquetas', 'etiqueta', 'tags'],
  fecha: ['fecha', 'fecha_publicacion'],
  autor: ['autor', 'autores'],
  destacado: ['destacado', 'portada', 'carrusel']
};
const ALIAS_INV = {};
Object.keys(ALIAS).forEach(k => ALIAS[k].forEach(a => { ALIAS_INV[a] = k; }));

function parseFecha(s) {
  s = String(s || '').trim();
  if (!s) return 0;
  let m = s.match(/^Date\((\d+),(\d+),(\d+)/);
  if (m) return new Date(+m[1], +m[2], +m[3]).getTime();
  m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]).getTime();
  m = s.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})/); // dd/mm/aaaa
  if (m) return new Date(+m[3], +m[2] - 1, +m[1]).getTime();
  const t = Date.parse(s);
  return isNaN(t) ? 0 : t;
}

function fechaLinda(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleDateString('es-VE', { day: 'numeric', month: 'long', year: 'numeric' });
}

function normalizarFila(row, orden) {
  const a = { _orden: orden };
  Object.keys(ALIAS).forEach(k => { a[k] = ''; });
  Object.keys(row || {}).forEach(k => {
    const campo = ALIAS_INV[normKey(k)];
    const val = row[k] == null ? '' : String(row[k]).trim();
    if (campo && !a[campo]) a[campo] = val;
  });
  a._id = a.id_art || slug(a.titulo);
  a._materia = slug(a.materia);
  const areaDeclarada = slug(a.area);
  a._area = AREAS[areaDeclarada] ? areaDeclarada
    : (MATERIAS[a._materia] ? MATERIAS[a._materia].area : (AREAS[a._materia] ? a._materia : ''));
  a._tags = a.etiquetas.split(/[,;]/).map(t => t.trim()).filter(Boolean);
  a._ts = parseFecha(a.fecha);
  a._borrador = ['borrador', 'oculto', 'no', 'draft', 'despublicado'].indexOf(slug(a.estado)) > -1;
  a._destacado = ['si', 'x', '1', 'true', 'destacado'].indexOf(slug(a.destacado)) > -1;
  a._hay = sinTildes([a.titulo, a.subtitulo, a.resumen, a.parrafo_intro, a.parrafo_1, a.parrafo_2, a.parrafo_3, a.parrafo_4,
    a.conclusion, a.materia, a.area, a.etiquetas, a.autor].join(' '));
  return a;
}

// "https://...png | Figura 1: texto del pie"  ->  { url, pie }
function splitImg(celda) {
  const partes = String(celda || '').split('|');
  return { url: (partes.shift() || '').trim(), pie: partes.join('|').trim() };
}

// Acepta enlaces de Google Drive (compartidos como "cualquiera con el enlace"), URLs normales y rutas del repositorio
function imgUrl(u) {
  u = String(u || '').trim();
  if (!u) return '';
  const m = u.match(/drive\.google\.com\/file\/d\/([\w-]+)/) || u.match(/drive\.google\.com\/(?:open|uc)\?[^#]*\bid=([\w-]+)/);
  if (m) return 'https://drive.google.com/thumbnail?id=' + m[1] + '&sz=w1600';
  if (/^[a-z][a-z0-9+.-]*:/i.test(u) && !/^https?:/i.test(u)) return ''; // nada de javascript:, data:, etc.
  return u;
}
const cssUrl = u => String(u).replace(/["'()\\\s]/g, c => encodeURIComponent(c));
function hrefSeguro(u) {
  u = String(u || '').trim();
  if (!u) return '#';
  if (/^[a-z][a-z0-9+.-]*:/i.test(u) && !/^https?:/i.test(u)) return '#';
  return u;
}

// ---- mini-markdown seguro para las celdas ----
function mdInline(raw) {
  const fichas = [];
  const guardar = html => { fichas.push(html); return '\u0000' + (fichas.length - 1) + '\u0000'; };
  let s = esc(raw);
  s = s.replace(/`([^`]+)`/g, (_, c) => guardar('<code>' + c + '</code>'));
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, t, u) => guardar('<a href="' + u + '" target="_blank" rel="noopener">' + t + '</a>'));
  s = s.replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, (_, pre, u) => pre + guardar('<a href="' + u + '" target="_blank" rel="noopener">' + u + '</a>'));
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*\w])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => fichas[i]);
}

function md(texto) {
  const L = String(texto || '').replace(/\r\n?/g, '\n').split('\n');
  const esBloque = l => /^(```|#{1,3}\s|>\s?|\s*[-*•]\s|\s*\d+[.)]\s)/.test(l);
  let html = '', i = 0;
  while (i < L.length) {
    const l = L[i];
    if (/^\s*$/.test(l)) { i++; continue; }
    if (/^```/.test(l)) {
      const buf = []; i++;
      while (i < L.length && !/^```/.test(L[i])) buf.push(L[i++]);
      i++;
      html += '<pre><code>' + esc(buf.join('\n')) + '</code></pre>';
    } else if (/^#{1,3}\s+/.test(l)) {
      html += '<h4>' + mdInline(l.replace(/^#{1,3}\s+/, '')) + '</h4>'; i++;
    } else if (/^>\s?/.test(l)) {
      const buf = [];
      while (i < L.length && /^>\s?/.test(L[i])) buf.push(L[i++].replace(/^>\s?/, ''));
      html += '<blockquote>' + buf.map(mdInline).join('<br>') + '</blockquote>';
    } else if (/^\s*[-*•]\s+/.test(l)) {
      const buf = [];
      while (i < L.length && /^\s*[-*•]\s+/.test(L[i])) buf.push(L[i++].replace(/^\s*[-*•]\s+/, ''));
      html += '<ul>' + buf.map(x => '<li>' + mdInline(x) + '</li>').join('') + '</ul>';
    } else if (/^\s*\d+[.)]\s+/.test(l)) {
      const buf = [];
      while (i < L.length && /^\s*\d+[.)]\s+/.test(L[i])) buf.push(L[i++].replace(/^\s*\d+[.)]\s+/, ''));
      html += '<ol>' + buf.map(x => '<li>' + mdInline(x) + '</li>').join('') + '</ol>';
    } else {
      const buf = [];
      while (i < L.length && !/^\s*$/.test(L[i]) && (buf.length === 0 || !esBloque(L[i]))) buf.push(L[i++]);
      html += '<p>' + buf.map(mdInline).join('<br>') + '</p>';
    }
  }
  return html;
}

// texto plano (sin marcas) para resúmenes
function plano(t) {
  return String(t || '').replace(/```[\s\S]*?```/g, ' ').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*`#>]/g, '').replace(/\s+/g, ' ').trim();
}
function recortar(t, n) { t = String(t || ''); return t.length > n ? t.slice(0, n).replace(/\s+\S*$/, '') + '…' : t; }

// ===== FIN utilidades puras =====

// =====================================================================
//  Datos
// =====================================================================
const $ = id => document.getElementById(id);
let ARTS = [];
let LISTO = false;   // true cuando ya se leyeron los artículos
let WORKSHOPS = null;
let PRESENTACIONES = null;

// Devuelve las filas de una pestaña, o null si no se pudo leer (para distinguir "vacía" de "sin conexión")
async function fetchSheetTab(nombre) {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&headers=1&sheet=${encodeURIComponent(nombre)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const text = await res.text();
    const m = text.match(/setResponse\(([\s\S]*)\);?\s*$/);
    if (!m) throw new Error('respuesta inesperada');
    const json = JSON.parse(m[1]);
    if (json.status === 'error') throw new Error((json.errors && json.errors[0] && json.errors[0].detailed_message) || 'error de Google Sheets');
    const cols = json.table.cols.map(c => (c && c.label) ? c.label.trim() : '');
    return (json.table.rows || []).map(r => {
      const o = {};
      ((r && r.c) || []).forEach((cel, i) => {
        o[cols[i] || 'col_' + i] = cel ? ((cel.f !== undefined && cel.f !== null) ? cel.f : (cel.v == null ? '' : cel.v)) : '';
      });
      return o;
    });
  } catch (err) {
    console.error('Error leyendo la pestaña ' + nombre + ':', err);
    return null;
  }
}

// Para pestañas SIN fila de encabezados (Workshops, Presentaciones): devuelve filas como listas, por posición de columna.
// Si la hoja sí trae encabezados, se detectan y se descartan. Devuelve null si no se pudo leer.
async function fetchSheetFilas(nombre) {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&headers=0&sheet=${encodeURIComponent(nombre)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const m = (await res.text()).match(/setResponse\(([\s\S]*)\);?\s*$/);
    if (!m) throw new Error('respuesta inesperada');
    const json = JSON.parse(m[1]);
    if (json.status === 'error') throw new Error((json.errors && json.errors[0] && json.errors[0].detailed_message) || 'error de Google Sheets');
    const filas = (json.table.rows || []).map(r => ((r && r.c) || []).map(cel =>
      String(cel ? ((cel.f !== undefined && cel.f !== null) ? cel.f : (cel.v == null ? '' : cel.v)) : '').trim()));
    // ¿la primera fila es un encabezado? (la columna 2 dice "titulo")
    if (filas.length && normKey(filas[0][1]) === 'titulo') filas.shift();
    return filas;
  } catch (err) {
    console.error('Error leyendo la pestaña ' + nombre + ':', err);
    return null;
  }
}

async function cargarArticulos() {
  let filas = await fetchSheetTab('Articulos');
  let sinConexion = false;
  if (filas === null) {
    sinConexion = true;
    try { filas = JSON.parse(localStorage.getItem('i15_articulos') || 'null'); } catch (e) { filas = null; }
  } else {
    try { localStorage.setItem('i15_articulos', JSON.stringify(filas)); } catch (e) { /* almacenamiento lleno: no pasa nada */ }
  }
  ARTS = (filas || []).map(normalizarFila).filter(a => a.titulo || a.id_art);
  ARTS.forEach(a => { if (!a.titulo) a.titulo = a.id_art; });
  ARTS.sort((x, y) => (y._ts - x._ts) || (y._orden - x._orden)); // más reciente primero
  const aviso = $('avisoOffline');
  if (aviso) aviso.classList.toggle('oculto', !(sinConexion && ARTS.length));
}

const publicados = () => ARTS.filter(a => !a._borrador);
const buscarArt = id => ARTS.find(a => a._id === id) || ARTS.find(a => slug(a._id) === slug(id));

// =====================================================================
//  Menú, barra lateral
// =====================================================================
function iconoMenu(a) { return a.icono ? `<i class="fa ${a.icono}"></i>` : esc(a.glifo || ''); }

function pintarMenu() {
  $('navMenu').innerHTML =
    '<li class="nav-home"><a href="#/"><i class="fa fa-home"></i> Home</a></li>' +
    MENU.map(a => `
      <li class="${a.clase}">
        <a href="#/area/${a.id}">${iconoMenu(a)} ${esc(a.nombre)}</a>
        <ul>
          <li><a href="#/area/${a.id}"><strong>Ver todo en ${esc(a.nombre)}</strong></a></li>
          ${a.items.map(n => `<li><a href="#/materia/${slug(n)}">${esc(n)}</a></li>`).join('')}
        </ul>
      </li>`).join('');
}

function pintarSidebar() {
  const rec = publicados().slice(0, 5);
  const conteo = {};
  publicados().forEach(a => a._tags.forEach(t => { const s = slug(t); if (s) { conteo[s] = conteo[s] || { n: 0, t }; conteo[s].n++; } }));
  const tags = Object.keys(conteo).sort((x, y) => conteo[y].n - conteo[x].n).slice(0, 14);
  $('sidebarRecientes').innerHTML = rec.length
    ? rec.map(a => `<li><a href="#/articulo/${encodeURIComponent(a._id)}">${esc(a.titulo)}</a></li>`).join('')
    : '<li class="vacio">Aún no hay artículos.</li>';
  $('sidebarTags').innerHTML = tags.map(s => `<a class="chip-tag" href="#/etiqueta/${s}">${esc(conteo[s].t)}</a>`).join('');
}

// =====================================================================
//  Tarjetas, carrusel, listas
// =====================================================================
const claseArea = a => 'area-' + (a._area || 'otros');
const nombreMateria = a => (MATERIAS[a._materia] && MATERIAS[a._materia].nombre) || a.materia || '';

function tarjeta(a) {
  const img = imgUrl(splitImg(a.imagen_banner).url);
  const ini = esc((a.titulo || '?').charAt(0).toUpperCase());
  const resumen = a.resumen || recortar(plano(a.parrafo_intro), 110);
  const mat = nombreMateria(a);
  return `
    <a class="article-card ${claseArea(a)}" href="#/articulo/${encodeURIComponent(a._id)}">
      ${img ? `<img src="${esc(img)}" alt="" loading="lazy" data-fb="card">` : `<div class="img-ph">${ini}</div>`}
      <div class="article-card-body">
        ${mat ? `<span class="chip">${esc(mat)}</span>` : ''}
        <h4>${esc(a.titulo)}</h4>
        <p>${esc(resumen)}</p>
        ${a._ts ? `<small class="fecha">${esc(fechaLinda(a._ts))}</small>` : ''}
      </div>
    </a>`;
}

let slideActual = 0, slidesTotal = 0, timerCarrusel = null;

function mostrarSlide(n) {
  const s = document.querySelectorAll('.carousel-slide');
  if (!s.length) return;
  s[slideActual].classList.remove('active');
  slideActual = (n + s.length) % s.length;
  s[slideActual].classList.add('active');
}

function pintarCarrusel() {
  const pub = publicados();
  const dest = pub.filter(a => a._destacado);
  const items = dest.concat(pub.filter(a => !a._destacado)).slice(0, 3);
  slidesTotal = items.length;
  slideActual = 0;
  clearInterval(timerCarrusel);
  const cont = $('carouselContainer');
  if (!items.length) {
    cont.innerHTML = `<div class="carousel-slide active area-otros sin-img"><h2>Bienvenido a ${NOMBRE_SITIO}</h2><p>Pronto publicaremos nuevos artículos del pensum de Educación Informática.</p></div>`;
    return;
  }
  cont.innerHTML = items.map((a, i) => {
    const img = imgUrl(splitImg(a.imagen_banner).url);
    const fondo = img
      ? `background-image: linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.1) 70%), url('${esc(cssUrl(img))}');`
      : '';
    return `
      <div class="carousel-slide ${claseArea(a)} ${img ? '' : 'sin-img'} ${i === 0 ? 'active' : ''}" style="${fondo}">
        <h2>${esc(a.titulo)}</h2>
        <p>${esc(a.resumen || recortar(plano(a.parrafo_intro), 160))}</p>
        <a href="#/articulo/${encodeURIComponent(a._id)}" class="btn-read">Leer artículo</a>
      </div>`;
  }).join('');
  if (items.length > 1) timerCarrusel = setInterval(() => mostrarSlide(slideActual + 1), 7000);
}

function pintarInicio() {
  if (!LISTO) {
    $('carouselContainer').innerHTML = '<div class="carousel-slide active area-otros sin-img"><h2>Cargando…</h2></div>';
    $('articlesGrid').innerHTML = '<p class="vacio-grande">Cargando artículos…</p>';
    return;
  }
  pintarCarrusel();
  const pub = publicados().slice(0, 6);
  $('articlesGrid').innerHTML = pub.length ? pub.map(tarjeta).join('')
    : '<p class="vacio-grande">Aún no hay artículos publicados.</p>';
  const mas = $('verTodos');
  if (mas) mas.classList.toggle('oculto', publicados().length <= 6);
}

function migas(partes) {
  return '<nav class="migas"><a href="#/">Inicio</a>' + partes.map(p => ' › ' + (p[1] ? `<a href="${p[1]}">${esc(p[0])}</a>` : esc(p[0]))).join('') + '</nav>';
}

function pintarLista(titulo, items, partesMigas, nota) {
  $('vistaLista').innerHTML = `
    ${migas(partesMigas)}
    <h3 class="section-title">${esc(titulo)}</h3>
    ${nota ? `<p class="nota-lista">${esc(nota)}</p>` : ''}
    ${items.length ? `<section class="articles-grid">${items.map(tarjeta).join('')}</section>`
      : '<p class="vacio-grande">No hay artículos para mostrar aquí todavía.</p>'}`;
  document.title = titulo + ' · ' + NOMBRE_SITIO;
}

// =====================================================================
//  Artículo
// =====================================================================
function bloque(texto, celdaImg, lado) {
  const im = splitImg(celdaImg), url = imgUrl(im.url);
  if (!texto && !url) return '';
  const fig = url ? `
      <figure class="fig fig-${lado}">
        <img src="${esc(url)}" alt="${esc(im.pie)}" loading="lazy" data-fb="fig">
        ${im.pie ? `<figcaption>${esc(im.pie)}</figcaption>` : ''}
      </figure>` : '';
  return `<section class="bloque">${fig}${md(texto)}</section>`;
}

let promesaMath = null;
function renderMath(el) {
  if (!promesaMath) {
    promesaMath = new Promise((ok, fallo) => {
      window.MathJax = {
        tex: { inlineMath: [['$', '$'], ['\\(', '\\)']], displayMath: [['$$', '$$'], ['\\[', '\\]']] },
        options: { skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'] },
        startup: { typeset: false }
      };
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-mml-chtml.js';
      s.async = true;
      s.onload = () => window.MathJax.startup.promise.then(ok, fallo);
      s.onerror = fallo;
      document.head.appendChild(s);
    });
  }
  promesaMath.then(() => window.MathJax.typesetPromise([el])).catch(() => {});
}

function pintarArticulo(a, preview) {
  const mat = MATERIAS[a._materia], area = AREAS[a._area];
  const ban = splitImg(a.imagen_banner), bannerUrl = imgUrl(ban.url);
  const partes = [];
  if (area) partes.push([area.nombre, '#/area/' + area.id]);
  if (a._materia) partes.push([mat ? mat.nombre : a.materia, '#/materia/' + a._materia]);
  partes.push([a.titulo]);

  const relacionados = publicados().filter(x => x !== a && ((a._materia && x._materia === a._materia) || (!a._materia && a._area && x._area === a._area))).slice(0, 3);
  const texto = [a.parrafo_intro, a.parrafo_1, a.parrafo_2, a.parrafo_3, a.parrafo_4, a.conclusion].join(' ');

  $('vistaArticulo').innerHTML = `
    <article class="art ${claseArea(a)}">
      ${migas(partes)}
      ${(preview || a._borrador) ? '<div class="aviso-borrador">Vista previa: este artículo está en <b>borrador</b> y no aparece en el sitio.</div>' : ''}
      <header class="art-head">
        <h1>${esc(a.titulo)}</h1>
        ${a.subtitulo ? `<p class="art-sub">${esc(a.subtitulo)}</p>` : ''}
        <div class="art-meta">
          ${area ? `<a class="chip" href="#/area/${area.id}">${esc(area.nombre)}</a>` : ''}
          ${a._materia ? `<a class="chip chip-claro" href="#/materia/${a._materia}">${esc(mat ? mat.nombre : a.materia)}</a>` : ''}
          ${a._ts ? `<span>📅 ${esc(fechaLinda(a._ts))}</span>` : ''}
          ${a.autor ? `<span>✍️ ${esc(a.autor)}</span>` : ''}
        </div>
      </header>
      ${bannerUrl ? `<figure class="art-banner"><img src="${esc(bannerUrl)}" alt="${esc(ban.pie || a.titulo)}" data-fb="fig">${ban.pie ? `<figcaption>${esc(ban.pie)}</figcaption>` : ''}</figure>` : ''}
      ${a.parrafo_intro ? `<div class="lead">${md(a.parrafo_intro)}</div>` : ''}
      ${bloque(a.parrafo_1, a.imagen_derecha, 'der')}
      ${bloque(a.parrafo_2, '', 'der')}
      ${bloque(a.parrafo_3, a.imagen_izquierda, 'izq')}
      ${bloque(a.parrafo_4, '', 'der')}
      ${a.conclusion ? `<section class="conclusion"><h3>Conclusión</h3>${md(a.conclusion)}</section>` : ''}
      ${a.otros_links ? `<section class="art-extra"><h3>Para seguir explorando</h3>${md(a.otros_links)}</section>` : ''}
      ${a.fuentes ? `<section class="art-extra fuentes"><h3>Fuentes y referencias</h3>${md(a.fuentes)}</section>` : ''}
      <footer class="art-pie">
        <button type="button" class="btn-copiar" data-copiar>🔗 Copiar enlace</button>
        ${a._tags.map(t => `<a class="chip-tag" href="#/etiqueta/${slug(t)}">${esc(t)}</a>`).join('')}
      </footer>
      ${relacionados.length ? `<h3 class="section-title">Sigue leyendo</h3><section class="articles-grid">${relacionados.map(tarjeta).join('')}</section>` : ''}
    </article>`;
  document.title = a.titulo + ' · ' + NOMBRE_SITIO;
  if (/\$[^$\n]+\$|\\\(|\\\[/.test(texto)) renderMath($('vistaArticulo'));
}

// =====================================================================
//  Diagnóstico para quien redacta: #/diagnostico
// =====================================================================
function pintarDiagnostico() {
  const ids = {};
  ARTS.forEach(a => { ids[a._id] = (ids[a._id] || 0) + 1; });
  const filas = ARTS.map(a => {
    const prob = [];
    if (!a.id_art) prob.push('sin id_art (se usa el título)');
    if (ids[a._id] > 1) prob.push('id repetido');
    if (!a._materia) prob.push('sin materia');
    else if (!MATERIAS[a._materia]) prob.push('materia no está en el menú: «' + a.materia + '»');
    if (!a._area) prob.push('sin área');
    if (!a.parrafo_intro) prob.push('sin parrafo_intro');
    if (!a.imagen_banner) prob.push('sin banner');
    if (a.fecha && !a._ts) prob.push('fecha no reconocida (usa aaaa-mm-dd)');
    return `<tr class="${prob.length ? 'mal' : ''}">
      <td>${a._orden + 2}</td>
      <td><a href="#/preview/${encodeURIComponent(a._id)}">${esc(a._id)}</a></td>
      <td>${esc(a.titulo)}</td>
      <td>${a._borrador ? '📝 borrador' : '✅ publicado'}</td>
      <td>${prob.length ? '⚠️ ' + esc(prob.join(' · ')) : '✔️'}</td></tr>`;
  }).join('');
  $('vistaDiag').innerHTML = `
    ${migas([['Diagnóstico']])}
    <h3 class="section-title">Diagnóstico de artículos</h3>
    <p class="nota-lista">${ARTS.length} fila(s) leída(s) de la pestaña «Articulos». La primera columna es el número de fila en la hoja.</p>
    <div class="scroll-x"><table class="tabla-diag">
      <tr><th>Fila</th><th>id_art</th><th>Título</th><th>Estado</th><th>Revisión</th></tr>${filas}</table></div>`;
  document.title = 'Diagnóstico · ' + NOMBRE_SITIO;
}

// =====================================================================
//  Workshops y presentaciones (pestañas del mismo Sheet)
// =====================================================================
// Workshops: id | título | imagen | módulo 1 | módulo 2 | módulo 3 | enlace
function pintarWorkshops() {
  const cont = $('workshopsGrid');
  if (!cont || WORKSHOPS === null) return;
  const items = WORKSHOPS.map(r => ({
    titulo: r[1] || '', imagen: r[2] || '', mods: [r[3], r[4], r[5]].filter(Boolean), link: r[6] || ''
  })).filter(w => w.titulo);
  if (!items.length) { cont.innerHTML = '<p class="vacio-grande">No hay workshops disponibles.</p>'; return; }
  cont.innerHTML = items.map(w => {
    const href = hrefSeguro(w.link);
    const ext = /^https?:/i.test(href);
    const img = imgUrl(w.imagen);
    return `
      <div class="workshop-card">
        ${img ? `<img src="${esc(img)}" alt="${esc(w.titulo)}" data-fb="ws">` : '<div class="ws-ph">W</div>'}
        <h4>${esc(w.titulo)}</h4>
        <ul>${w.mods.map(m => `<li>• ${esc(m)}</li>`).join('')}</ul>
        <a href="${esc(href)}" ${ext ? 'target="_blank" rel="noopener"' : ''} class="btn-read btn-chico">Ver más</a>
      </div>`;
  }).join('');
}

// Presentaciones: id | título | categoría | enlace de Google Slides (o su ID) | miniatura
function urlSlides(v) {
  v = String(v || '').trim();
  if (!v) return '';
  if (/^https?:/i.test(v)) return v;
  return 'https://docs.google.com/presentation/d/e/' + v + '/embed?start=false&loop=false&delayms=3000';
}

function pintarPresentaciones() {
  const cont = $('presentacionesGrid');
  if (!cont || PRESENTACIONES === null) return;
  const items = PRESENTACIONES.map(r => ({
    titulo: r[1] || '', cat: r[2] || '', slide: urlSlides(r[3]), thumb: r[4] || ''
  })).filter(p => p.titulo);
  if (!items.length) { cont.innerHTML = '<p class="vacio-grande">No hay presentaciones disponibles.</p>'; return; }
  for (let i = items.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [items[i], items[j]] = [items[j], items[i]]; }
  cont.innerHTML = items.slice(0, 8).map(p => {
    const img = imgUrl(p.thumb);
    const area = AREAS[slug(p.cat)] ? slug(p.cat) : 'otros';
    return `
      <div class="pptx-thumb area-${area}" data-url="${esc(p.slide)}" data-title="${esc(p.titulo)}" role="button" tabindex="0">
        ${img ? `<img src="${esc(img)}" alt="${esc(p.titulo)}" loading="lazy" data-fb="ppt">` : '<div class="ppt-ph">📊</div>'}
        <div class="title-overlay">${esc(p.titulo)}</div>
      </div>`;
  }).join('');
}

function abrirPresentacion(url, titulo) {
  if (!/^https?:/i.test(url || '')) { alert('Esta presentación no tiene un enlace de Google Slides configurado en la hoja.'); return; }
  if (url.includes('/edit')) url = url.split('/edit')[0] + '/embed';
  else if (url.includes('/pub') && !url.includes('/embed')) url = url.replace('/pub', '/embed');
  $('modalTitle').textContent = titulo;
  $('modalIframe').src = url;
  $('pptxModal').classList.add('active');
}
function cerrarModal() {
  $('pptxModal').classList.remove('active');
  $('modalIframe').src = '';
}

// =====================================================================
//  Rutas  (#/  #/articulo/ID  #/area/x  #/materia/x  #/etiqueta/x  #/buscar/texto  #/preview/ID  #/diagnostico)
// =====================================================================
function decodificar(t) { try { return decodeURIComponent(t); } catch (e) { return t; } }

function rutaActual() {
  const partes = location.hash.replace(/^#\/?/, '').split('/').map(decodificar);
  return { tipo: partes[0] || 'inicio', valor: partes.slice(1).join('/') };
}

function mostrarVista(id) {
  ['vistaInicio', 'vistaLista', 'vistaArticulo', 'vistaDiag'].forEach(v => $(v).classList.toggle('oculto', v !== id));
}

function noEncontrado(msg) {
  $('vistaLista').innerHTML = `${migas([['No encontrado']])}<p class="vacio-grande">${esc(msg)} <a href="#/">Volver al inicio</a></p>`;
  mostrarVista('vistaLista');
  document.title = NOMBRE_SITIO;
}

function render() {
  const r = rutaActual();
  clearInterval(timerCarrusel);
  if (!LISTO && r.tipo !== 'inicio') {
    $('vistaLista').innerHTML = '<p class="vacio-grande">Cargando…</p>';
    mostrarVista('vistaLista');
    return;
  }
  switch (r.tipo) {
    case 'articulo':
    case 'preview': {
      const a = buscarArt(r.valor);
      if (!a || (a._borrador && r.tipo !== 'preview')) return noEncontrado('No encontramos ese artículo.');
      pintarArticulo(a, r.tipo === 'preview');
      mostrarVista('vistaArticulo');
      break;
    }
    case 'area': {
      const ar = AREAS[r.valor];
      if (!ar) return noEncontrado('Esa sección no existe.');
      pintarLista(ar.nombre, publicados().filter(a => a._area === r.valor), [[ar.nombre]],
        'Materias: ' + ar.items.join(' · '));
      mostrarVista('vistaLista');
      break;
    }
    case 'materia': {
      const m = MATERIAS[r.valor], ar = m && AREAS[m.area];
      const items = publicados().filter(a => a._materia === r.valor);
      if (!m && !items.length) return noEncontrado('Esa materia no existe.');
      pintarLista(m ? m.nombre : items[0].materia, items, ar ? [[ar.nombre, '#/area/' + ar.id], [m.nombre]] : [[items[0].materia]]);
      mostrarVista('vistaLista');
      break;
    }
    case 'etiqueta': {
      const items = publicados().filter(a => a._tags.some(t => slug(t) === r.valor));
      const nombre = items.length ? (items[0]._tags.find(t => slug(t) === r.valor) || r.valor) : r.valor;
      pintarLista('Etiqueta: ' + nombre, items, [['Etiquetas'], [nombre]]);
      mostrarVista('vistaLista');
      break;
    }
    case 'buscar': {
      const palabras = sinTildes(r.valor).split(/\s+/).filter(Boolean);
      const items = palabras.length ? publicados().filter(a => palabras.every(p => a._hay.indexOf(p) > -1)) : [];
      pintarLista('Resultados para «' + r.valor + '»', items, [['Búsqueda']], items.length + ' resultado(s)');
      mostrarVista('vistaLista');
      break;
    }
    case 'todos':
      pintarLista('Todos los artículos', publicados(), [['Todos los artículos']]);
      mostrarVista('vistaLista');
      break;
    case 'diagnostico':
      pintarDiagnostico();
      mostrarVista('vistaDiag');
      break;
    default:
      pintarInicio();
      mostrarVista('vistaInicio');
      document.title = NOMBRE_SITIO + ' - Educación Informática UPEL';
  }
  window.scrollTo(0, 0);
}

// =====================================================================
//  Eventos
// =====================================================================
const esMovil = () => window.matchMedia('(max-width: 900px)').matches;

function conectarEventos() {
  window.addEventListener('hashchange', render);

  // botón del navbar: menú en móvil, panel lateral en escritorio
  $('toggleSidebarBtn').addEventListener('click', () => {
    if (esMovil()) $('navMenu').classList.toggle('active');
    else $('sidebar').classList.toggle('hidden');
  });

  // en móvil, tocar una sección abre/cierra sus materias; al elegir una página se cierra el menú
  $('navMenu').addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a || !esMovil()) return;
    const li = a.parentElement;
    if (li.parentElement === $('navMenu') && li.querySelector('ul')) {
      e.preventDefault();
      li.classList.toggle('abierto');
    } else {
      $('navMenu').classList.remove('active');
    }
  });

  $('prevSlide').addEventListener('click', () => { clearInterval(timerCarrusel); mostrarSlide(slideActual - 1); });
  $('nextSlide').addEventListener('click', () => { clearInterval(timerCarrusel); mostrarSlide(slideActual + 1); });

  $('formBuscar').addEventListener('submit', e => {
    e.preventDefault();
    const q = $('inputBuscar').value.trim();
    if (q) location.hash = '#/buscar/' + encodeURIComponent(q);
  });

  document.addEventListener('click', e => {
    const copiar = e.target.closest('[data-copiar]');
    if (copiar) {
      const fin = () => { copiar.textContent = '✅ Enlace copiado'; setTimeout(() => { copiar.textContent = '🔗 Copiar enlace'; }, 2000); };
      if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(fin, () => prompt('Copia este enlace:', location.href));
      else prompt('Copia este enlace:', location.href);
      return;
    }
    const thumb = e.target.closest('.pptx-thumb');
    if (thumb) abrirPresentacion(thumb.getAttribute('data-url'), thumb.getAttribute('data-title'));
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') cerrarModal();
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('pptx-thumb')) {
      e.preventDefault(); abrirPresentacion(e.target.getAttribute('data-url'), e.target.getAttribute('data-title'));
    }
  });
  $('closeModal').addEventListener('click', cerrarModal);
  $('pptxModal').addEventListener('click', e => { if (e.target === $('pptxModal')) cerrarModal(); });

  // imágenes que no cargan: se reemplazan por un recuadro de color en vez de dejar un icono roto
  document.addEventListener('error', e => {
    const img = e.target;
    if (!img || img.tagName !== 'IMG' || !img.dataset.fb) return;
    if (img.dataset.fb === 'card' || img.dataset.fb === 'ws' || img.dataset.fb === 'ppt') {
      const d = document.createElement('div');
      d.className = { card: 'img-ph', ws: 'ws-ph', ppt: 'ppt-ph' }[img.dataset.fb];
      d.textContent = img.dataset.fb === 'ppt' ? '📊' : '📘';
      img.replaceWith(d);
    } else {
      const fig = img.closest('figure');
      (fig || img).remove();
    }
  }, true);
}

// =====================================================================
//  Inicio
// =====================================================================
async function iniciar() {
  pintarMenu();
  conectarEventos();
  render(); // muestra la estructura enseguida
  const pesWork = fetchSheetFilas('Workshops').then(f => { WORKSHOPS = f || []; pintarWorkshops(); });
  const pesPres = fetchSheetFilas('Presentaciones').then(f => { PRESENTACIONES = f || []; pintarPresentaciones(); });
  await cargarArticulos();
  LISTO = true;
  pintarSidebar();
  render();
  await Promise.all([pesWork, pesPres]);
}

if (typeof window !== 'undefined' && typeof document !== 'undefined' && document.getElementById('navMenu')) {
  window.addEventListener('DOMContentLoaded', iniciar);
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
}
