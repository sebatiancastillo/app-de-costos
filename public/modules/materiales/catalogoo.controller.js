/* ============================================================
   CONFIG — CAMBIA ESTOS VALORES
   ============================================================ */
const WA_NUMBER = '573007354244';

/* ============================================================
   PRODUCTOS
   ============================================================ */
const PRODUCTS = [
  {
    id:1, name:'Marco Rústico Natural', cat:'Marcos',
    price:65000, wood:'Pino natural',
    img:'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80',
    badge:'Nuevo', badgeClass:'nuevo',
    stock:'Disponible', stockQty:8,
    delivery:'Entrega 3-5 días',
    dims:'30 × 40 cm · 1.2 kg',
    desc:'Marco decorativo en pino con acabado natural. Ideal para fotografías o espejos. Grano visible y textura auténtica.',
    woods:['Pino','Cedro','Nogal'],
    finishes:['Natural','Cera de abejas','Barniz'],
    sizes:['20×30 cm','30×40 cm','40×60 cm']
  },
  {
    id:2, name:'Repisa Flotante Minimalista', cat:'Repisas',
    price:89000, old:115000, wood:'Cedro barnizado',
    img:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
    badge:'Oferta', badgeClass:'oferta',
    stock:'Últimas 3', stockQty:3,
    delivery:'Entrega 3-5 días',
    dims:'60 × 15 cm · 1.8 kg',
    desc:'Repisa de cedro con acabado barnizado mate. Incluye tornillos y tacos de pared. Soporta hasta 15 kg.',
    woods:['Cedro','Nogal','Roble'],
    finishes:['Barniz mate','Barniz brillante','Teñido oscuro'],
    sizes:['40 cm','60 cm','80 cm','100 cm']
  },
  {
    id:3, name:'Bandeja Orgánica Nogal', cat:'Accesorios',
    price:78000, wood:'Nogal con aceite',
    img:'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600&q=80',
    badge:null,
    stock:'Disponible', stockQty:12,
    delivery:'Entrega 2-4 días',
    dims:'35 × 25 cm · 0.9 kg',
    desc:'Bandeja de borde orgánico tallada en nogal. Acabado con aceite de linaza. Perfecta para desayunos o decoración.',
    woods:['Nogal','Roble'],
    finishes:['Aceite de linaza','Cera de abejas'],
    sizes:['25×18 cm','35×25 cm','45×32 cm']
  },
  {
    id:4, name:'Porta Llaves Familiar', cat:'Accesorios',
    price:38000, wood:'Pino teñido',
    img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    badge:'Nuevo', badgeClass:'nuevo',
    stock:'Disponible', stockQty:20,
    delivery:'Entrega 2-3 días',
    dims:'25 × 12 cm · 0.4 kg',
    desc:'Porta llaves con 5 ganchos metálicos y estante superior. Personalizable con nombre o frase grabada.',
    woods:['Pino','Cedro'],
    finishes:['Natural','Teñido nogal','Teñido oscuro'],
    sizes:['25 cm (5 ganchos)','35 cm (7 ganchos)']
  },
  {
    id:5, name:'Mesa Lateral Nórdica', cat:'Muebles',
    price:245000, wood:'Roble con barniz',
    img:'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80',
    badge:'Premium', badgeClass:'encargo',
    stock:'Bajo pedido', stockQty:0,
    delivery:'Producción 10-15 días',
    dims:'45 × 45 × 55 cm · 6 kg',
    desc:'Mesa lateral de roble sólido con patas metálicas negras. Diseño escandinavo. Solo bajo pedido, espacio limitado.',
    woods:['Roble','Nogal'],
    finishes:['Barniz mate','Barniz brillante','Aceite natural'],
    sizes:['40×40 cm','45×45 cm','50×50 cm']
  },
  {
    id:6, name:'Marco Espejo Vintage', cat:'Marcos',
    price:92000, wood:'Cedro envejecido',
    img:'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80',
    badge:null,
    stock:'Últimas 2', stockQty:2,
    delivery:'Entrega 3-5 días',
    dims:'50 × 70 cm · 2.1 kg',
    desc:'Marco estilo vintage con técnica de envejecimiento manual. No incluye espejo. Colgantes incluidos.',
    woods:['Cedro','Pino'],
    finishes:['Envejecido natural','Envejecido oscuro'],
    sizes:['40×60 cm','50×70 cm']
  },
  {
    id:7, name:'Set Accesorios Escritorio', cat:'Accesorios',
    price:125000, wood:'Nogal + Roble',
    img:'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80',
    badge:'Nuevo', badgeClass:'nuevo',
    stock:'Disponible', stockQty:6,
    delivery:'Entrega 4-6 días',
    dims:'Set de 4 piezas',
    desc:'Set de 4 accesorios: portalápices, bandeja de documentos, organizador de cable y base para celular.',
    woods:['Nogal','Roble','Cedro'],
    finishes:['Aceite de linaza','Barniz mate'],
    sizes:['Tamaño estándar']
  },
  {
    id:8, name:'Repisa Árbol Decorativa', cat:'Repisas',
    price:145000, wood:'Pino natural',
    img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    badge:'Oferta', badgeClass:'oferta', old:180000,
    stock:'Disponible', stockQty:4,
    delivery:'Entrega 5-7 días',
    dims:'60 × 80 cm · 3.2 kg',
    desc:'Repisa con forma de árbol y múltiples espacios para plantas, libros o decoración. Fijación a pared incluida.',
    woods:['Pino','Cedro'],
    finishes:['Natural','Teñido nogal','Barniz'],
    sizes:['Tamaño único 60×80 cm']
  }
];

/* ============================================================
   RESEÑAS
   ============================================================ */
const REVIEWS_DATA = [
  { name:'Valentina R.', init:'V', rating:5, text:'El marco llegó perfecto, la madera es de muy buena calidad. El embalaje excelente, no tuve ningún problema con el envío a Bogotá.', product:'Marco Rústico Natural', date:'Hace 2 días' },
  { name:'Carlos M.', init:'C', rating:5, text:'Pedí la repisa personalizada de 80 cm en cedro y quedó espectacular. El asesor fue muy atento y me orientó bien en el acabado.', product:'Repisa Flotante Minimalista', date:'Hace 1 semana' },
  { name:'María A.', init:'M', rating:4, text:'La bandeja es hermosa, la veta del nogal es impresionante. Le quito una estrella porque tardó un día más de lo prometido, pero valió la pena.', product:'Bandeja Orgánica Nogal', date:'Hace 2 semanas' },
  { name:'Andrés T.', init:'A', rating:5, text:'Ya es mi tercera compra acá. Siempre impecable. El set de escritorio es exactamente lo que necesitaba para la oficina en casa.', product:'Set Accesorios Escritorio', date:'Hace 3 semanas' },
  { name:'Laura P.', init:'L', rating:5, text:'Me hicieron un diseño totalmente personalizado para el living. Superó mis expectativas, quedó mejor de lo que imaginé.', product:'Pedido personalizado', date:'Hace 1 mes' },
];

const localReviews = JSON.parse(localStorage.getItem('am_reviews') || '[]');
let allReviews = [...REVIEWS_DATA, ...localReviews];

/* ============================================================
   ESTADO
   ============================================================ */
let cart = JSON.parse(localStorage.getItem('am_cart') || '[]');
let activeCat = 'Todos';
let slideIdx = 0;
const TOTAL_SLIDES = 3;
let loggedIn = false;
let ratingSelected = 0;
let currentProduct = null;
let quoteData = {};

const fmt = n => '$' + n.toLocaleString('es-CO');

/* ── NAVBAR ── */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', scrollY > 20);
});

/* ── HAMBURGER ── */
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
  document.getElementById('ham').classList.toggle('open');
}

/* ── CAROUSEL ── */
const track = document.getElementById('track');
const dotsWrap = document.getElementById('dots');
for (let i = 0; i < TOTAL_SLIDES; i++) {
  const d = document.createElement('button');
  d.className = 'dot' + (i === 0 ? ' active' : '');
  d.onclick = () => goTo(i);
  dotsWrap.appendChild(d);
}
function goTo(n) {
  slideIdx = n;
  track.style.transform = `translateX(-${n * 100}%)`;
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === n));
}
function nextSlide() { goTo((slideIdx + 1) % TOTAL_SLIDES); }
function prevSlide() { goTo((slideIdx - 1 + TOTAL_SLIDES) % TOTAL_SLIDES); }
setInterval(nextSlide, 5000);

/* ── CATEGORIES ── */
const allCats = ['Todos', ...new Set(PRODUCTS.map(p => p.cat))];
const catsEl = document.getElementById('cats');
allCats.forEach(c => {
  const b = document.createElement('button');
  b.className = 'cat' + (c === 'Todos' ? ' active' : '');
  b.textContent = c;
  b.onclick = () => {
    activeCat = c;
    document.querySelectorAll('.cat').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    renderGrid();
  };
  catsEl.appendChild(b);
});

/* ── GRID ── */
function stockLabel(p) {
  if (!p.stock) return '';
  if (p.stockQty === 0) return `<span class="badge stock">Bajo pedido</span>`;
  if (p.stockQty <= 3) return `<span class="badge stock">Últimas ${p.stockQty}</span>`;
  return '';
}
function renderGrid() {
  const list = activeCat === 'Todos' ? PRODUCTS : PRODUCTS.filter(p => p.cat === activeCat);
  document.getElementById('grid').innerHTML = list.map(p => `
    <div class="card">
      <div class="card-img">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <div class="badge-wrap">
          ${p.badge ? `<span class="badge ${p.badgeClass||''}">${p.badge}</span>` : ''}
          ${stockLabel(p)}
        </div>
      </div>
      <div class="card-body">
        <p class="card-cat">${p.cat}</p>
        <h3 class="card-name">${p.name}</h3>
        <p class="card-wood"><i class="fas fa-tree"></i>${p.wood} · ${p.dims}</p>
        <p class="delivery"><i class="fas fa-clock"></i>${p.delivery}</p>
        <div class="card-foot">
          <div class="price-wrap">
            <span class="price">${fmt(p.price)}</span>
            ${p.old ? `<span class="old-price">${fmt(p.old)}</span>` : ''}
          </div>
          <div class="card-actions">
            <button class="btn-add" onclick="addToCart(${p.id})"><i class="fas fa-plus"></i> Carrito</button>
            <button class="btn-detail" onclick="openProduct(${p.id})"><i class="fas fa-eye"></i> Detalle</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}
renderGrid();

/* ── PRODUCT MODAL ── */
function openProduct(id) {
  currentProduct = PRODUCTS.find(p => p.id === id);
  const p = currentProduct;
  document.getElementById('pmImg').innerHTML = `<img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;">`;
  document.getElementById('pmBody').innerHTML = `
    <p class="pm-cat">${p.cat}</p>
    <h2 class="pm-name">${p.name}</h2>
    <p class="pm-price">${fmt(p.price)}${p.old ? `<span style="font-size:.85rem;font-weight:400;color:var(--muted);text-decoration:line-through;margin-left:.5rem">${fmt(p.old)}</span>` : ''}</p>
    <p style="color:var(--muted);font-size:.88rem;line-height:1.6;margin-bottom:1rem;">${p.desc}</p>

    <p class="var-label">Tipo de madera</p>
    <div class="var-opts">${p.woods.map((w,i)=>`<button class="var-opt${i===0?' sel':''}" onclick="selectVar(this,'wood','${w}')">${w}</button>`).join('')}</div>

    <p class="var-label">Acabado</p>
    <div class="var-opts">${p.finishes.map((f,i)=>`<button class="var-opt${i===0?' sel':''}" onclick="selectVar(this,'finish','${f}')">${f}</button>`).join('')}</div>

    <p class="var-label">Medida</p>
    <div class="var-opts">${p.sizes.map((s,i)=>`<button class="var-opt${i===0?' sel':''}" onclick="selectVar(this,'size','${s}')">${s}</button>`).join('')}</div>

    <div class="specs">
      <div class="spec"><strong>Dimensiones</strong>${p.dims}</div>
      <div class="spec"><strong>Madera base</strong>${p.wood}</div>
      <div class="spec"><strong>Disponibilidad</strong>${p.stock}</div>
      <div class="spec"><strong>Entrega</strong>${p.delivery}</div>
    </div>

    <p class="pm-del"><i class="fas fa-shield-alt"></i>Garantía 6 meses · Cambios en 7 días</p>

    <div class="pm-actions">
      <button class="btn-addcart-full" onclick="addToCartFromModal()"><i class="fas fa-shopping-bag"></i> Agregar al carrito</button>
      <button class="btn-wa-full" onclick="buyNow(${p.id})"><i class="fab fa-whatsapp" style="font-size:1.1rem"></i> Comprar ahora por WhatsApp</button>
    </div>
  `;
  document.getElementById('productModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeProductModal() {
  document.getElementById('productModal').classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('productModal').addEventListener('click', e => {
  if (e.target === document.getElementById('productModal')) closeProductModal();
});
function selectVar(el, type, val) {
  el.closest('.var-opts').querySelectorAll('.var-opt').forEach(b => b.classList.remove('sel'));
  el.classList.add('sel');
}
function addToCartFromModal() {
  if (currentProduct) { addToCart(currentProduct.id); closeProductModal(); }
}

/* ── CART ── */
function saveCart() { localStorage.setItem('am_cart', JSON.stringify(cart)); }
function updateBadge() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const b = document.getElementById('cartBadge');
  b.textContent = total;
  b.classList.toggle('vis', total > 0);
}
function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  const ex = cart.find(x => x.id === id);
  if (ex) ex.qty++;
  else cart.push({ ...p, qty: 1 });
  saveCart(); updateBadge();
  toast(`✓ ${p.name} agregado`);
}
function removeFromCart(id) { cart = cart.filter(x => x.id !== id); saveCart(); updateBadge(); renderCart(); }
function changeQty(id, d) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += d;
  if (item.qty <= 0) removeFromCart(id);
  else { saveCart(); updateBadge(); renderCart(); }
}
function renderCart() {
  const body = document.getElementById('cpBody');
  const foot = document.getElementById('cpFoot');
  if (!cart.length) {
    body.innerHTML = `<div class="cart-empty"><i class="fas fa-tree"></i><p>Tu carrito está vacío</p></div>`;
    foot.style.display = 'none'; return;
  }
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  body.innerHTML = cart.map(item => `
    <div class="ci">
      <div class="ci-img"><img src="${item.img}" alt="${item.name}"></div>
      <div class="ci-info">
        <p class="ci-name">${item.name}</p>
        <p class="ci-sub"><i class="fas fa-tree" style="color:var(--accent);font-size:.7rem"></i> ${item.wood}</p>
        <p class="ci-price">${fmt(item.price)}</p>
        <div class="ci-qty">
          <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
          <span class="qty-n">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id},+1)">+</button>
        </div>
      </div>
      <button class="ci-del" onclick="removeFromCart(${item.id})"><i class="fas fa-trash-alt"></i></button>
    </div>
  `).join('');
  document.getElementById('cpTotal').textContent = fmt(total);
  foot.style.display = 'block';
}
function openCart() { renderCart(); document.getElementById('cartOverlay').classList.add('open'); document.getElementById('cartPanel').classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeCart() { document.getElementById('cartOverlay').classList.remove('open'); document.getElementById('cartPanel').classList.remove('open'); document.body.style.overflow = ''; }

/* ── CHECKOUT & BUY NOW ── */
function checkout() {
  if (!cart.length) return;
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  let msg = '🪵 *Pedido desde Artemadera*\n\n';
  cart.forEach(i => { msg += `• ${i.name} ×${i.qty} — ${fmt(i.price * i.qty)}\n  Madera: ${i.wood}\n`; });
  msg += `\n💰 *Total estimado: ${fmt(total)}*\n\nHola, quiero finalizar este pedido. ¿Me orientan con el pago y fecha de entrega?`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}
function buyNow(id) {
  const p = PRODUCTS.find(x => x.id === id);
  let msg = `🪵 *Me interesa este producto:*\n\n• ${p.name}\n  Madera: ${p.wood}\n  Precio: ${fmt(p.price)}\n\nHola, quisiera comprarlo. ¿Me pueden ayudar con los detalles?`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

/* ── COTIZADOR ── */
const BASE_PRICES = { marco:30000, repisa:40000, bandeja:25000, portallaves:15000, mesa:100000, personalizado:50000 };
const WOOD_MULT = { pino:1, cedro:1.4, nogal:1.9, roble:2.2 };
const FINISH_ADD = { natural:0, cera:8000, barniz:12000, teñido:18000, epoxica:35000 };
const DELIVERY_DAYS = { marco:'5-7 días', repisa:'5-7 días', bandeja:'4-6 días', portallaves:'3-5 días', mesa:'12-18 días', personalizado:'10-15 días' };

function calcQuote() {
  const pieza = document.getElementById('qPieza').value;
  const madera = document.getElementById('qMadera').value;
  const ancho = parseFloat(document.getElementById('qAncho').value) || 0;
  const alto = parseFloat(document.getElementById('qAlto').value) || 0;
  const acabado = document.getElementById('qAcabado').value;
  const qty = parseInt(document.getElementById('qQty').value) || 1;
  const res = document.getElementById('quoteResult');
  const btnWa = document.getElementById('btnQuoteWa');
  if (!pieza || !madera || !ancho || !alto || !acabado) { res.style.display='none'; btnWa.style.display='none'; return; }
  const area = (ancho * alto) / 1000;
  const base = BASE_PRICES[pieza] || 50000;
  const mult = WOOD_MULT[madera] || 1;
  const finish = FINISH_ADD[acabado] || 0;
  const unit = Math.round((base + area * 3000) * mult + finish);
  const total = unit * qty;
  quoteData = { pieza, madera, ancho, alto, acabado, qty, unit, total };
  document.getElementById('qrPrice').textContent = fmt(total);
  document.getElementById('qrTime').textContent = DELIVERY_DAYS[pieza] || '7-12 días';
  res.style.display = 'block';
  btnWa.style.display = 'flex';
}
function sendQuoteWa() {
  const { pieza, madera, ancho, alto, acabado, qty, unit, total } = quoteData;
  const piezas = { marco:'Marco decorativo', repisa:'Repisa', bandeja:'Bandeja', portallaves:'Porta llaves', mesa:'Mesa pequeña', personalizado:'Diseño personalizado' };
  const maderas = { pino:'Pino', cedro:'Cedro', nogal:'Nogal', roble:'Roble' };
  const acabados = { natural:'Natural', cera:'Cera de abejas', barniz:'Barniz', teñido:'Teñido + barniz', epoxica:'Resina epóxica' };
  let msg = `🪵 *Cotización desde Artemadera*\n\n`;
  msg += `📦 Pieza: ${piezas[pieza]}\n🌲 Madera: ${maderas[madera]}\n📐 Medidas: ${ancho} × ${alto} cm\n✨ Acabado: ${acabados[acabado]}\n🔢 Cantidad: ${qty}\n\n`;
  msg += `💰 Precio estimado: ${fmt(total)}\n(${fmt(unit)} c/u)\n\nHola, quisiera cotizar esta pieza. ¿Pueden confirmarme el precio y disponibilidad?`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

/* ── REVIEWS ── */
function starsHtml(n) { return '★'.repeat(n) + '☆'.repeat(5-n); }
function renderReviews() {
  const grid = document.getElementById('reviewsGrid');
  grid.innerHTML = allReviews.map(r => `
    <div class="review-card">
      <div class="rv-head">
        <div class="rv-avatar">${r.init}</div>
        <div>
          <p class="rv-name">${r.name}</p>
          <p class="rv-date">${r.date}</p>
        </div>
      </div>
      <div class="stars">${starsHtml(r.rating)}</div>
      <p class="rv-text">${r.text}</p>
      <p class="rv-product"><i class="fas fa-tree"></i>${r.product}</p>
    </div>
  `).join('');

  const formEl = document.getElementById('reviewForm');
  if (!loggedIn) {
    formEl.innerHTML = `<div class="review-locked"><i class="fab fa-google"></i><p>Inicia sesión con Google para dejar tu reseña</p><button class="btn-review" onclick="openLogin()" style="margin-top:.8rem">Iniciar sesión</button></div>`;
    return;
  }
  formEl.innerHTML = `
    <h4><i class="fas fa-pen" style="color:var(--accent);margin-right:.4rem;font-size:.85em"></i>Deja tu reseña</h4>
    <div class="stars-input" id="starsInput">
      ${[1,2,3,4,5].map(n=>`<i class="far fa-star" data-n="${n}" onclick="setRating(${n})"></i>`).join('')}
    </div>
    <textarea class="rf-textarea" id="rfText" placeholder="Cuéntanos tu experiencia con el producto..."></textarea>
    <button class="btn-review" onclick="submitReview()"><i class="fas fa-paper-plane"></i> Publicar reseña</button>
  `;
}
function setRating(n) {
  ratingSelected = n;
  document.querySelectorAll('#starsInput i').forEach((el, i) => {
    el.className = i < n ? 'fas fa-star lit' : 'far fa-star';
  });
}
function submitReview() {
  const text = document.getElementById('rfText').value.trim();
  if (!ratingSelected) { toast('⚠ Selecciona una valoración'); return; }
  if (text.length < 15) { toast('⚠ Escribe al menos 15 caracteres'); return; }
  const name = document.getElementById('userName').textContent;
  const newR = {
    name, init: name.charAt(0).toUpperCase(),
    rating: ratingSelected, text,
    product: 'Producto verificado',
    date: 'Ahora mismo'
  };
  allReviews = [newR, ...allReviews];
  const stored = JSON.parse(localStorage.getItem('am_reviews') || '[]');
  stored.unshift(newR);
  localStorage.setItem('am_reviews', JSON.stringify(stored));
  ratingSelected = 0;
  renderReviews();
  toast('✓ Reseña publicada, ¡gracias!');
}
renderReviews();

/* ── LOGIN ── */
function openLogin() { document.getElementById('loginModal').classList.add('open'); }
function closeLogin() { document.getElementById('loginModal').classList.remove('open'); }
function doGoogleLogin() {
  loggedIn = true;
  document.getElementById('loginBtn').style.display = 'none';
  const pill = document.getElementById('userPill');
  pill.style.display = 'flex';
  document.getElementById('userImg').src = 'https://ui-avatars.com/api/?name=Usuario&background=5c3d2e&color=fff&size=64';
  document.getElementById('userName').textContent = 'Usuario';
  closeLogin();
  renderReviews();
  toast('¡Bienvenido! Ya puedes dejar tu reseña.');
}

/* ── POLICY ── */
function openPolicy() { document.getElementById('policyModal').classList.add('open'); }
function closePolicy() { document.getElementById('policyModal').classList.remove('open'); }
document.getElementById('policyModal').addEventListener('click', e => { if (e.target === document.getElementById('policyModal')) closePolicy(); });

/* ── TOAST ── */
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2800);
}

updateBadge();
