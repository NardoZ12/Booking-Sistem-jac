/* ─────────────────────────────────────────────
   JAC Booking System · Parser
   Platforms: GetYourGuide (GYG) & Viator
───────────────────────────────────────────── */

// ── Platform detection ──────────────────────

function isGYG(text) {
  return (
    text.includes('Lead traveler') ||
    text.includes('Total commission rate') ||
    text.includes('Booked on') ||
    /Pickup at\s+\d+:\d+\s*[AP]M/i.test(text)
  );
}

function isViator(text) {
  return (
    text.includes('Viajero principal:') ||
    text.includes('Importe que recibirá:') ||
    /\bBR-\d+\b/.test(text)
  );
}

function detectPlatform(text) {
  const el = document.getElementById('platform-indicator');
  if (!text.trim()) { el.innerHTML = ''; return null; }

  if (isGYG(text)) {
    el.innerHTML = '<span class="detected gyg">✓ GetYourGuide detectado</span>';
    return 'gyg';
  }
  if (isViator(text)) {
    el.innerHTML = '<span class="detected viator">✓ Viator detectado</span>';
    return 'viator';
  }
  el.innerHTML = '<span class="detected unknown">⚠ Plataforma no reconocida</span>';
  return null;
}

// ── GYG parser ──────────────────────────────

function parseGYG(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // Booking code: first standalone alphanumeric token (10–14 chars) before "Product thumbnail"
  let bookingCode = '';
  const productIdx = lines.findIndex(l => l === 'Product thumbnail');
  const searchArea  = productIdx > 0 ? lines.slice(0, productIdx) : lines.slice(0, 3);
  for (const l of searchArea) {
    if (/^[A-Z0-9]{8,16}$/.test(l)) { bookingCode = l; break; }
  }
  // Fallback: first all-caps alphanumeric token in full text
  if (!bookingCode) {
    const m = text.match(/\b([A-Z0-9]{10,14})\b/);
    if (m) bookingCode = m[1];
  }

  // Product name: line after "Product thumbnail"
  let product = '';
  if (productIdx !== -1 && lines[productIdx + 1]) {
    product = lines[productIdx + 1];
  }

  // Tour date: "Saturday, June 6th, 2026 7:05 AM" style
  let tourDate = '';
  const dateM = text.match(/(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s+\w+\s+\d+\w*,?\s+\d{4}/i);
  if (dateM) tourDate = dateM[0];

  // Lead traveler: line immediately after "Lead traveler"
  let leadTraveler = '';
  const leadIdx = lines.findIndex(l => l === 'Lead traveler');
  if (leadIdx !== -1) {
    // The next non-empty line is the name; strip "(Country)" if present
    const raw = lines[leadIdx + 1] || '';
    leadTraveler = raw.replace(/\s*\(.*?\)\s*/g, '').trim();
  }

  // Number of travelers: "Total: X person/people"
  let numTravelers = '';
  const totalM = text.match(/Total:\s*(\d+)\s*person/i);
  if (totalM) {
    const n = parseInt(totalM[1]);
    numTravelers = `${n} ${n === 1 ? 'persona' : 'personas'}`;
  }

  // Pickup location: line after "Location" keyword (skip helper text lines)
  let location = '';
  const locIdx = lines.findIndex(l => l === 'Location');
  if (locIdx !== -1) {
    for (let i = locIdx + 1; i < lines.length; i++) {
      const l = lines[i];
      if (l.startsWith('Good ') || l.startsWith('Edit ') || l.startsWith('Open ') || l === 'Pickup details') continue;
      location = l;
      break;
    }
  }

  // Pickup time: "Pickup at 7:30 AM"
  let pickupTime = '';
  const pickupM = text.match(/Pickup at\s+(\d+:\d+\s*[AP]M)/i);
  if (pickupM) pickupTime = pickupM[1];

  // Amount: first "$XX.XX" token
  let amount = '';
  const amountM = text.match(/\$(\d+\.\d{2})/);
  if (amountM) amount = '$' + amountM[1] + ' USD';

  return { platform: 'GetYourGuide', platformColor: 'gyg',
           bookingCode, product, tourDate,
           leadTraveler, numTravelers, location, pickupTime, amount };
}

// ── Viator parser ───────────────────────────

function parseViator(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // Booking code: "BR-XXXXXXXXXX"
  let bookingCode = '';
  const codeM = text.match(/\b(BR-\d+)\b/);
  if (codeM) bookingCode = codeM[1];

  // Product name: line after "Confirmada"
  let product = '';
  const confirmIdx = lines.findIndex(l => /^confirmada$/i.test(l));
  if (confirmIdx !== -1 && lines[confirmIdx + 1]) {
    product = lines[confirmIdx + 1];
  }

  // Tour date: Spanish short-day format "jue, 10 dic 2026"
  let tourDate = '';
  const dateM = text.match(/(lun|mar|mi[eé]|jue|vie|s[aá]b|dom)[.,]?\s+\d{1,2}\s+\w+\s+\d{4}/i);
  if (dateM) tourDate = dateM[0];

  // Lead traveler: "Viajero principal: NAME"
  let leadTraveler = '';
  const leadM = text.match(/Viajero principal:\s*(.+)/i);
  if (leadM) leadTraveler = leadM[1].trim();

  // Number of travelers: "2 adultos" / "1 adulto"
  let numTravelers = '';
  const numM = text.match(/(\d+)\s*(adultos?|niños?|menores?|personas?)/i);
  if (numM) numTravelers = numM[0];

  // Pickup location: "Punto de recogida: ..."
  let location = '';
  const locM = text.match(/Punto de recogida:\s*(.+)/i);
  if (locM) location = locM[1].trim();

  // Special requirements hotel: "Requisitos especiales: RIU PALACE SOLO ADULTOS"
  let hotelPickup = '';
  const reqM = text.match(/Requisitos especiales:\s*(.+)/i);
  if (reqM) hotelPickup = reqM[1].trim();

  // Pickup time: grab first HH:MM pattern (usually in product subtitle)
  let pickupTime = '';
  const timeM = text.match(/\b(\d{2}:\d{2})\b/);
  if (timeM) pickupTime = timeM[1];

  // Amount: "Importe que recibirá: 86,42 USD"
  let amount = '';
  const amtM = text.match(/Importe que recibirá:\s*([\d,.]+\s*USD)/i);
  if (amtM) amount = amtM[1].trim();

  // Provider confirmation number
  let providerCode = '';
  const provM = text.match(/Número de confirmación del proveedor:\s*(.+)/i);
  if (provM) providerCode = provM[1].trim();

  return { platform: 'Viator', platformColor: 'viator',
           bookingCode, product, tourDate,
           leadTraveler, numTravelers, location, hotelPickup, pickupTime, amount, providerCode };
}

// ── Ticket renderer ─────────────────────────

function field(label, value, highlight = false) {
  if (!value) return '';
  return `
    <div class="ticket-field">
      <div class="field-label">${label}</div>
      <div class="field-value${highlight ? ' highlight' : ''}">${escHtml(value)}</div>
    </div>`;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderTicket(data) {
  const now = new Date().toLocaleString('es-DO', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  const gridFields = `
    <div class="ticket-grid">
      ${field('👤 Viajero Principal', data.leadTraveler)}
      ${field('👥 Cantidad de Personas', data.numTravelers)}
      ${field('📅 Fecha del Tour', data.tourDate)}
      ${field('🕐 Hora de Recogida', data.pickupTime)}
    </div>`;

  const extraFields = `
    ${field('📍 Lugar de Recogida', data.location)}
    ${data.hotelPickup ? field('🏨 Hotel / Requisitos', data.hotelPickup) : ''}
    <div class="ticket-divider"></div>
    ${field('💰 Monto Pagado', data.amount, true)}
    ${data.providerCode ? field('🔖 Confirmación Proveedor', data.providerCode) : ''}`;

  const productLine = data.product
    ? `<div class="ticket-product">🎟 ${escHtml(data.product)}</div>` : '';

  document.getElementById('ticket').innerHTML = `
    <div class="ticket-card ${data.platformColor}">

      <div class="ticket-header">
        <div>
          <span class="ticket-brand-text">JAC TOURS</span>
          <span class="ticket-brand-sub">Ticket de Confirmación</span>
        </div>
        <div class="ticket-platform-badge">${data.platform}</div>
      </div>

      <div class="ticket-code-section">
        <span class="ticket-code-label">Código de Reserva</span>
        <span class="ticket-code">${escHtml(data.bookingCode || '—')}</span>
      </div>

      <div class="ticket-body">
        ${gridFields}
        ${extraFields}
        ${productLine}
      </div>

      <div class="ticket-footer">
        <span class="ticket-generated">JAC Booking System</span>
        <span class="ticket-date">Procesado: ${now}</span>
      </div>
    </div>`;

  document.getElementById('ticket-placeholder').classList.add('hidden');
  document.getElementById('ticket-container').classList.remove('hidden');
}

// ── Main action ─────────────────────────────

function parseBooking() {
  const text = document.getElementById('booking-input').value;
  if (!text.trim()) {
    showToast('⚠ Pega el texto de la reserva primero.');
    return;
  }

  let data;
  if (isGYG(text))        data = parseGYG(text);
  else if (isViator(text)) data = parseViator(text);
  else {
    showToast('⚠ No se reconoció la plataforma. Verifica el texto.');
    return;
  }

  renderTicket(data);
}

function clearAll() {
  document.getElementById('booking-input').value = '';
  document.getElementById('platform-indicator').innerHTML = '';
  document.getElementById('ticket-placeholder').classList.remove('hidden');
  document.getElementById('ticket-container').classList.add('hidden');
  document.getElementById('ticket').innerHTML = '';
}

function printTicket() {
  window.print();
}

function copyTicketText() {
  const el = document.getElementById('ticket');
  if (!el) return;
  const txt = el.innerText.replace(/\n{3,}/g, '\n\n');
  navigator.clipboard.writeText(txt)
    .then(() => showToast('✓ Copiado al portapapeles'))
    .catch(() => showToast('⚠ No se pudo copiar'));
}

// ── Toast helper ────────────────────────────

let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), 2800);
}
