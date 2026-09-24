// URL base de tu Google Sheet (ID normal del editor)
const SPREADSHEET_ID = '1dHUk2XI6hkfz0yESTpG6x1tVjXgrOWLoOqMUzrmSVwQ';

async function fetchSheetTab(sheetName) {
  const gvizUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;

  try {
    const res = await fetch(gvizUrl);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const text = await res.text();
    
    // Extraer el JSON del wrapper de google.visualization.Query.setResponse
    const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);/);
    if (!jsonMatch) return [];
    
    const json = JSON.parse(jsonMatch[1]);
    const table = json.table;
    
    // Extraer nombres de columnas exactamente como están en la primera fila
    const cols = table.cols.map(c => (c && c.label) ? c.label.trim() : '');

    return table.rows.map(r => {
      let obj = {};
      r.c.forEach((val, idx) => {
        let key = cols[idx] || `col_${idx}`;
        obj[key] = val ? (val.f !== undefined ? val.f : val.v) : '';
      });
      return obj;
    });
  } catch (err) {
    console.error("Error leyendo la pestaña " + sheetName + ":", err);
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

  const defaultArticles = [
    { Titulo: 'Conexión a Internet y Redes', Resumen: 'Aprende sobre capas, protocolos TCP/IP y cómo viajan los datos.', Banner_URL: './p/TCP.png', Google_Doc_ID: '' },
    { Titulo: 'Evolución del Concepto de Límite', Resumen: 'Un recorrido histórico desde Arquímedes hasta Cauchy y Weierstrass.', Banner_URL: './p/evolucion_concepto_limite.png', Google_Doc_ID: '' },
    { Titulo: 'Introducción a DevOps', Resumen: 'Metodología colaborativa entre desarrollo y operaciones de software.', Banner_URL: './p/DevOps.png', Google_Doc_ID: '' }
  ];

  const data = articles.length > 0 ? articles : defaultArticles;

  // CARRUSEL
  const carouselItems = data.slice(0, 3);
  slidesCount = carouselItems.length;

  carouselContainer.innerHTML = carouselItems.map((item, idx) => `
    <div class="carousel-slide ${idx === 0 ? 'active' : ''}" style="background-image: url('${item.Banner_URL || 'https://picsum.photos/800/320'}')">
      <h2>${item.Titulo || 'Sin Título'}</h2>
      <p>${item.Resumen || ''}</p>
      <a href="javascript:void(0)" onclick="openArticle('${item.Google_Doc_ID}')" class="btn-read">Ir al artículo</a>
    </div>
  `).join('');

  // GRID 6 ARTÍCULOS
  const gridItems = data.slice(0, 6);

  gridContainer.innerHTML = gridItems.map(item => `
    <article class="article-card" style="cursor: pointer;" onclick="openArticle('${item.Google_Doc_ID}')">
      <img src="${item.Banner_URL || 'https://picsum.photos/300/150'}" alt="${item.Titulo}">
      <div class="article-card-body">
        <h4>${item.Titulo || 'Artículo sin título'}</h4>
        <p>${item.Resumen ? item.Resumen.substring(0, 80) + '...' : ''}</p>
      </div>
    </article>
  `).join('');
}

// FUNCIÓN PARA CARGAR EL ARTÍCULO DENTRO DE LA MISMA PÁGINA (SPA)
function openArticle(docId) {
  if (!docId || docId.trim() === '') {
    alert("Este artículo no tiene un ID de Google Doc configurado en la hoja de cálculo.");
    return;
  }

  let cleanDocId = docId.trim();
  if (cleanDocId.includes('/d/')) {
    const match = cleanDocId.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match) cleanDocId = match[1];
  }

  const homeSections = document.getElementById('homeSections');
  const articleViewer = document.getElementById('articleViewer');
  const articleContent = document.getElementById('articleContent');

  homeSections.style.display = 'none';
  articleViewer.style.display = 'block';
  articleContent.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Cargando contenido del artículo...</p>';

  const docUrl = `https://docs.google.com/document/d/${cleanDocId}/pub?embedded=true`;

  articleContent.innerHTML = `
    <iframe 
      src="${docUrl}" 
      style="width: 100%; height: 800px; border: none; background: white;"
      onload="console.log('Artículo cargado con éxito');">
    </iframe>
  `;

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// BOTÓN PARA VOLVER A LA HOMEPAGE
const btnBack = document.getElementById('btnBackToHome');
if (btnBack) {
  btnBack.addEventListener('click', () => {
    document.getElementById('articleViewer').style.display = 'none';
    document.getElementById('homeSections').style.display = 'block';
    document.getElementById('articleContent').innerHTML = '';
  });
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

  const defaultWorkshops = [
    { Titulo: 'Rey de Redes', Imagen_URL: './blog/images/hdiem.png', Modulo_1: 'Protocolos', Modulo_2: 'Dispositivos', Modulo_3: 'Topologias' },
    { Titulo: 'Google Sheets', Imagen_URL: 'img/google_sheets.png', Modulo_1: 'Funciones', Modulo_2: 'Tablas', Modulo_3: 'Graficos' },
    { Titulo: 'Web Dev', Imagen_URL: 'img/web_dev.png', Modulo_1: 'HTML', Modulo_2: 'CSS', Modulo_3: 'JavaScript' },
    { Titulo: 'Automatizacion', Imagen_URL: './img/automatizacion.png', Modulo_1: 'Sensores', Modulo_2: 'PLC', Modulo_3: 'Control' }
  ];

  const data = workshops.length >= 4 ? workshops.slice(0, 4) : defaultWorkshops;

  container.innerHTML = data.map(item => {
    // Si la imagen es Base64 muy larga o no existe, colocar respaldo
    let imgSrc = item.Imagen_URL || 'https://via.placeholder.com/80/3499fe/ffffff?text=W';
    if (imgSrc.length > 500) {
      imgSrc = 'https://via.placeholder.com/80/3499fe/ffffff?text=W';
    }

    return `
      <div class="workshop-card">
        <img src="${imgSrc}" alt="${item.Titulo || 'Workshop'}">
        <h4>${item.Titulo || 'Workshop'}</h4>
        <ul>
          <li>• ${item.Modulo_1 || 'Módulo 1'}</li>
          <li>• ${item.Modulo_2 || 'Módulo 2'}</li>
          <li>• ${item.Modulo_3 || 'Módulo 3'}</li>
        </ul>
        <a href="${item.Link_URL || '#'}" class="btn-read" style="padding: 4px 10px; font-size: 11px;">Ver más</a>
      </div>
    `;
  }).join('');
}

// CARGAR PRESENTACIONES (8 UNIDADES CON RANDOMIZACIÓN Y MODAL)
async function loadPresentaciones() {
  const pptxList = await fetchSheetTab('Presentaciones');
  const container = document.getElementById('presentacionesGrid');

  let data = pptxList.length > 0 ? pptxList : [];

  // Filtrar solo las filas que tengan un título asignado
  data = data.filter(item => item.Titulo && item.Titulo.trim() !== '');

  // Mezclar aleatoriamente y seleccionar 8
  data = data.sort(() => Math.random() - 0.5).slice(0, 8);

  container.innerHTML = data.map((item, i) => {
    // Buscar la URL del embed de Google Slides
    let rawUrl = item.Slide_Embed_URL || item.Slide_Embed_ID || '';
    let embedUrl = '';

    if (rawUrl.startsWith('http')) {
      // Si pegaste la URL edit/pub de Google Slides
      if (rawUrl.includes('/edit')) {
        embedUrl = rawUrl.replace('/edit', '/embed');
      } else if (rawUrl.includes('/pub')) {
        embedUrl = rawUrl.replace('/pub', '/embed');
      } else {
        embedUrl = rawUrl;
      }
    } else if (rawUrl.trim() !== '') {
      // Si solo es el ID corto
      embedUrl = `https://docs.google.com/presentation/d/e/${rawUrl}/embed?start=false&loop=false&delayms=3000`;
    }

    // Determinar la miniatura
    let thumbSrc = item.Slide_Embed_URL || item.Thumbnail_Path || '';
    if (!thumbSrc || !thumbSrc.includes('.')) {
      thumbSrc = `https://picsum.photos/300/200?random=${i + 10}`;
    }

    return `
      <div class="pptx-thumb" data-url="${embedUrl}" data-title="${item.Titulo || 'Presentación'}">
        <img src="${thumbSrc}" alt="${item.Titulo || 'Presentación'}">
        <div class="title-overlay">${item.Titulo || 'Presentación'}</div>
      </div>
    `;
  }).join('');

  // VINCULAR EVENTO DE CLIC PARA ABRIR EL MODAL
  document.querySelectorAll('.pptx-thumb').forEach(thumb => {
    thumb.addEventListener('click', function() {
      const url = this.getAttribute('data-url');
      const title = this.getAttribute('data-title');
      if (url && url.trim() !== '') {
        document.getElementById('modalIframe').src = url;
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('pptxModal').classList.add('active');
      } else {
        alert("Esta presentación no tiene un enlace de Google Slides configurado en el Sheet.");
      }
    });
  });
}

// CERRAR MODAL
document.getElementById('closeModal').addEventListener('click', () => {
  document.getElementById('pptxModal').classList.remove('active');
  document.getElementById('modalIframe').src = '';
});

// INICIALIZACIÓN
window.addEventListener('DOMContentLoaded', () => {
  loadArticles();
  loadWorkshops();
  loadPresentaciones();
});
