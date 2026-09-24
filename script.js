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
    { Titulo: 'Google Sheets', Imagen_URL: './blog/images/hdiem.png', Modulo_1: 'Funciones', Modulo_2: 'Tablas', Modulo_3: 'Graficos' },
    { Titulo: 'Web Dev', Imagen_URL: './blog/images/hdiem.png', Modulo_1: 'HTML', Modulo_2: 'CSS', Modulo_3: 'JavaScript' },
    { Titulo: 'Automatización', Imagen_URL: './blog/images/hdiem.png', Modulo_1: 'Sensores', Modulo_2: 'PLC', Modulo_3: 'Control' }
  ];

  const data = workshops.length >= 4 ? workshops.slice(0, 4) : defaultWorkshops;

  container.innerHTML = data.map(item => {
    let imgSrc = item.Imagen_URL && item.Imagen_URL.trim() !== '' 
      ? item.Imagen_URL 
      : 'https://via.placeholder.com/80/3499fe/ffffff?text=W';

    return `
      <div class="workshop-card">
        <img src="${imgSrc}" onerror="this.onerror=null; this.src='https://via.placeholder.com/80/3499fe/ffffff?text=W';" alt="${item.Titulo || 'Workshop'}">
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

// NUEVA FUNCIÓN loadPresentaciones()
async function loadPresentaciones() {
  const pptxList = await fetchSheetTab('Presentaciones');
  const container = document.getElementById('presentacionesGrid');

  if (!container) return;

  // 1. Filtrar solo filas con Título válido
  let validPresentations = pptxList.filter(item => item.Titulo && item.Titulo.trim() !== '');

  if (validPresentations.length === 0) {
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #777;">No hay presentaciones disponibles.</p>';
    return;
  }

  // 2. Mezclar aleatoriamente las presentaciones
  for (let i = validPresentations.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [validPresentations[i], validPresentations[j]] = [validPresentations[j], validPresentations[i]];
  }

  // 3. Tomar exactamente 8 presentaciones aleatorias
  const selectedPresentations = validPresentations.slice(0, 8);

  // 4. Renderizar las miniatura en el Grid
  container.innerHTML = selectedPresentations.map((item, index) => {
    const rawEmbedUrl = (item.Slide_Embed_URL || '').trim();
    const rawThumbPath = (item.Thumbnail_Path || '').trim();
    const title = item.Titulo.trim();

    // Resolver la URL de la miniatura con fallback en caso de error
    const thumbSrc = rawThumbPath !== '' ? rawThumbPath : `https://picsum.photos/300/200?random=${index}`;

    return `
      <div class="pptx-thumb" data-embed-url="${rawEmbedUrl}" data-title="${title}">
        <img src="${thumbSrc}" onerror="this.onerror=null; this.src='https://picsum.photos/300/200?random=${index}';" alt="${title}">
        <div class="title-overlay">${title}</div>
      </div>
    `;
  }).join('');

  // 5. Asignar el evento click para abrir el modal
  container.querySelectorAll('.pptx-thumb').forEach(thumb => {
    thumb.addEventListener('click', function() {
      const embedUrl = this.getAttribute('data-embed-url');
      const title = this.getAttribute('data-title');

      if (!embedUrl) {
        alert("Esta presentación no tiene una URL configurada en la hoja de cálculo.");
        return;
      }

      const modal = document.getElementById('pptxModal');
      const modalIframe = document.getElementById('modalIframe');
      const modalTitle = document.getElementById('modalTitle');

      if (modal && modalIframe && modalTitle) {
        modalTitle.textContent = title;
        modalIframe.src = embedUrl;
        modal.classList.add('active');
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
