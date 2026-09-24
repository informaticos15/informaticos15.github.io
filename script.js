// URL base de tu Google Sheet publicado en la web
const SPREADSHEET_PUB_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS-eRTNJZ0pF-U7ZVzv7-Kq2QbQQVLd3jPepl1B7kxYPovsIUE6TohtfAWPbO4etMOCE7B-FOI7NET2/pubhtml';

// Función para consultar pestañas vía la API pública GViz
async function fetchSheetTab(sheetName) {
  const idMatch = SPREADSHEET_PUB_URL.match(/\/d\/e\/([^\/]+)/);
  if (!idMatch) return [];
  const pubId = idMatch[1];
  const gvizUrl = `https://docs.google.com/spreadsheets/d/e/${pubId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;

  try {
    const res = await fetch(gvizUrl);
    const text = await res.text();
    const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);/);
    if (!jsonMatch) return [];
    const json = JSON.parse(jsonMatch[1]);
    const rows = json.table.rows;
    const cols = json.table.cols.map(c => c ? c.label : '');

    return rows.map(r => {
      let obj = {};
      r.c.forEach((val, idx) => {
        let key = cols[idx] || `col_${idx}`;
        obj[key] = val ? val.v : '';
      });
      return obj;
    });
  } catch (err) {
    console.error("Error leyendo pestaña " + sheetName, err);
    return [];
  }
}

// TOGGLE SIDEBAR
document.getElementById('toggleSidebarBtn').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('hidden');
});

// CARGAR ARTÍCULOS (CARRUSEL + GRID DE 6 CAJAS)
let currentSlide = 0;
let slidesCount = 0;

async function loadArticles() {
  const articles = await fetchSheetTab('Articulos');
  const carouselContainer = document.getElementById('carouselContainer');
  const gridContainer = document.getElementById('articlesGrid');

  // Datos por defecto de respaldo
  const data = articles.length > 0 ? articles : [
    { Titulo: 'Conexión a Internet y Redes', Resumen: 'Aprende sobre capas, protocolos TCP/IP y cómo viajan los datos.', Banner_URL: 'https://picsum.photos/800/320?random=1' },
    { Titulo: 'Evolución del Concepto de Límite', Resumen: 'Un recorrido histórico desde Arquímedes hasta Cauchy y Weierstrass.', Banner_URL: 'https://picsum.photos/800/320?random=2' },
    { Titulo: 'Introducción a DevOps', Resumen: 'Metodología colaborativa entre desarrollo y operaciones de software.', Banner_URL: 'https://picsum.photos/800/320?random=3' }
  ];

  // CARRUSEL (PRIMEROS 3)
  const carouselItems = data.slice(0, 3);
  slidesCount = carouselItems.length;
  carouselContainer.innerHTML = carouselItems.map((item, idx) => `
    <div class="carousel-slide ${idx === 0 ? 'active' : ''}" style="background-image: url('${item.Banner_URL || 'https://picsum.photos/800/320'}')">
      <h2>${item.Titulo || 'Sin Título'}</h2>
      <p>${item.Resumen || ''}</p>
      <a href="#" class="btn-read">Ir al artículo</a>
    </div>
  `).join('');

  // GRID (HASTA 6 CAJAS RECIENTES)
  const gridItems = data.slice(0, 6);
  gridContainer.innerHTML = gridItems.map(item => `
    <article class="article-card">
      <img src="${item.Banner_URL || 'https://picsum.photos/300/150'}" alt="${item.Titulo}">
      <div class="article-card-body">
        <h4>${item.Titulo || 'Artículo sin título'}</h4>
        <p>${item.Resumen ? item.Resumen.substring(0, 80) + '...' : ''}</p>
      </div>
    </article>
  `).join('');
}

// CONTROLES DEL CARRUSEL
document.getElementById('nextSlide').addEventListener('click', () => {
  if (slidesCount === 0) return;
  const slides = document.querySelectorAll('.carousel-slide');
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slidesCount;
  slides[currentSlide].classList.add('active');
});

document.getElementById('prevSlide').addEventListener('click', () => {
  if (slidesCount === 0) return;
  const slides = document.querySelectorAll('.carousel-slide');
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide - 1 + slidesCount) % slidesCount;
  slides[currentSlide].classList.add('active');
});

// CARGAR WORKSHOPS (4 EQUITATIVOS)
async function loadWorkshops() {
  const workshops = await fetchSheetTab('Workshops');
  const container = document.getElementById('workshopsGrid');

  const data = workshops.length >= 4 ? workshops.slice(0, 4) : [
    { Titulo: 'Rey de Redes', Modulo_1: 'Protocolos', Modulo_2: 'Dispositivos', Modulo_3: 'Topologías' },
    { Titulo: 'Google Sheets', Modulo_1: 'Funciones', Modulo_2: 'Tablas', Modulo_3: 'Gráficos' },
    { Titulo: 'Web Dev', Modulo_1: 'HTML5', Modulo_2: 'CSS3', Modulo_3: 'JavaScript' },
    { Titulo: 'Automatización', Modulo_1: 'Sensores', Modulo_2: 'PLC', Modulo_3: 'Control' }
  ];

  container.innerHTML = data.map(item => `
    <div class="workshop-card">
      <img src="https://via.placeholder.com/80/3499fe/ffffff?text=W" alt="${item.Titulo}">
      <h4>${item.Titulo}</h4>
      <ul>
        <li>• ${item.Modulo_1 || 'Módulo 1'}</li>
        <li>• ${item.Modulo_2 || 'Módulo 2'}</li>
        <li>• ${item.Modulo_3 || 'Módulo 3'}</li>
      </ul>
      <a href="#" class="btn-read" style="padding: 4px 10px; font-size: 11px;">Ver más</a>
    </div>
  `).join('');
}

// CARGAR PRESENTACIONES (8 UNIDADES CON RANDOMIZACIÓN Y MODAL)
async function loadPresentaciones() {
  const pptxList = await fetchSheetTab('Presentaciones');
  const container = document.getElementById('presentacionesGrid');

  const defaultData = [
    { Titulo: 'Datos No Agrupados', Slide_Embed_URL: 'https://docs.google.com/presentation/d/e/2PACX-1vRndRh69UxkKMdnXo-8NJuSvBFVhPO-vALoLAyaacHHZVURx8OxoYz-jZB30PoLCX65PiN6oJyoqfo3/embed' },
    { Titulo: 'Electrónica Digital', Slide_Embed_URL: 'https://docs.google.com/presentation/d/e/2PACX-1vRCdEw85JiDkLsdGDjVVrpFDcH6LuojqAz1mFoUstDeq6tGMqHmp-FPmtmEsxrKz2eDYLChZzOK40h2/embed' },
    { Titulo: 'Estructura de Datos 2', Slide_Embed_URL: 'https://docs.google.com/presentation/d/e/2PACX-1vTvtZBStPW16UbZ9pm_eiW4ClMdjDyuINHmPNSrfpEHMUQeFfozknVf_f0HMbaPiHwxsTBayHZFo2NU/embed' },
    { Titulo: 'Didáctica Informática', Slide_Embed_URL: 'https://docs.google.com/presentation/d/e/2PACX-1vSrG0GkskW6HR6z9hgkoQmq61UE_K81Stogr5Gwished9Sdox20PcrAhxSQOUgkB8bgsG6ZE4puXZ01/embed' },
    { Titulo: 'Álgebra Lineal', Slide_Embed_URL: 'https://docs.google.com/presentation/d/e/2PACX-1vQigbVB0nQvCYmtF98IFbdtMBvPW_dXVKOyUSL5JSm-BHBV3_aWVDAFfFJnZ97N7OfPAztX8bDoa8gS/embed' },
    { Titulo: 'Redes Informáticas', Slide_Embed_URL: 'https://docs.google.com/presentation/d/e/2PACX-1vRAlK7AeyzoJK5lwLl1hWMmMEC8I5UNCqmYKEP9qVR7ouxsbCdX6b8-OxDop1m6mhO19qD3isMGcLxA/embed' },
    { Titulo: 'Seguridad Informática', Slide_Embed_URL: 'https://docs.google.com/presentation/d/e/2PACX-1vTln-XIH3L6AA91-Wt06pqcIN2GRXL2zrdYEC6JGfqy84qeab7V0ncvbOWwCYuhYDi8UO2a1xvWmdBc/embed' },
    { Titulo: 'HTML5 Avanzado', Slide_Embed_URL: 'https://docs.google.com/presentation/d/e/2PACX-1vQHrgHWROF9aBOBFFVIsHSAH8JEaKBTTym0SvWLFwbLY-fux7zqb9SHVodZcGgG_jSELyLfCI_57BRU/embed' }
  ];

  let data = pptxList.length > 0 ? pptxList : defaultData;
  
  // Mezclar aleatoriamente y seleccionar exactamente 8
  data = data.sort(() => Math.random() - 0.5).slice(0, 8);

  container.innerHTML = data.map((item, i) => `
    <div class="pptx-thumb" data-url="${item.Slide_Embed_URL || ''}" data-title="${item.Titulo || 'Presentación'}">
      <img src="${item.Thumbnail_URL || 'https://picsum.photos/300/200?random=' + (i+10)}" alt="${item.Titulo}">
      <div class="title-overlay">${item.Titulo || 'Presentación'}</div>
    </div>
  `).join('');

  // VINCULAR CLIC PARA ABRIR EL MODAL
  document.querySelectorAll('.pptx-thumb').forEach(thumb => {
    thumb.addEventListener('click', function() {
      const url = this.getAttribute('data-url');
      const title = this.getAttribute('data-title');
      if (url) {
        document.getElementById('modalIframe').src = url;
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('pptxModal').classList.add('active');
      }
    });
  });
}

// CERRAR MODAL
document.getElementById('closeModal').addEventListener('click', () => {
  document.getElementById('pptxModal').classList.remove('active');
  document.getElementById('modalIframe').src = '';
});

// INICIALIZACIÓN AL CERRAR LA CARGA DEL DOM
window.addEventListener('DOMContentLoaded', () => {
  loadArticles();
  loadWorkshops();
  loadPresentaciones();
});
