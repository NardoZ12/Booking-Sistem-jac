/* ─────────────────────────────────────────────
   JAC Booking System · app.js
   Platforms: GetYourGuide (GYG) & Viator
───────────────────────────────────────────── */

let _bookingData = null;   // global parsed result

// ── Platform detection ───────────────────────

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
  if (isGYG(text))    { el.innerHTML = '<span class="detected gyg">✓ GetYourGuide detectado</span>'; return 'gyg'; }
  if (isViator(text)) { el.innerHTML = '<span class="detected viator">✓ Viator detectado</span>';    return 'viator'; }
  el.innerHTML = '<span class="detected unknown">⚠ Plataforma no reconocida</span>';
  return null;
}

// ── Helpers ──────────────────────────────────

function firstName(fullName) {
  if (!fullName) return '';
  const first = fullName.trim().split(/\s+/)[0];
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

function extractNum(str) {
  if (!str) return 0;
  const m = str.match(/\d+/);
  return m ? parseInt(m[0]) : 0;
}

// Convert a date string to DD/M/YY for the driver message header
function shortDate(dateStr) {
  if (!dateStr) return '';
  const enMonths = ['january','february','march','april','may','june',
                    'july','august','september','october','november','december'];
  const esMonths = ['ene','feb','mar','abr','may','jun',
                    'jul','ago','sep','oct','nov','dic'];

  // English: "Saturday, June 6th, 2026"
  const enM = dateStr.match(
    /(monday|tuesday|wednesday|thursday|friday|saturday|sunday)[,.]?\s+(\w+)\s+(\d+)\w*[,.]?\s+(\d{4})/i
  );
  if (enM) {
    const mIdx = enMonths.indexOf(enM[2].toLowerCase());
    if (mIdx !== -1) return `${enM[3]}/${mIdx + 1}/${enM[4].slice(-2)}`;
  }

  // Spanish: "jue, 10 dic 2026"
  const esM = dateStr.match(/(\d{1,2})\s+(\w{3})\w*\s+(\d{4})/);
  if (esM) {
    const mIdx = esMonths.indexOf(esM[2].toLowerCase());
    if (mIdx !== -1) return `${esM[1]}/${mIdx + 1}/${esM[3].slice(-2)}`;
  }

  return dateStr; // fallback: return as-is
}

function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── GYG parser ───────────────────────────────

function parseGYG(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // Booking code: standalone A-Z0-9 token before "Product thumbnail"
  let bookingCode = '';
  const prodIdx  = lines.findIndex(l => l === 'Product thumbnail');
  const headArea = prodIdx > 0 ? lines.slice(0, prodIdx) : lines.slice(0, 4);
  for (const l of headArea) {
    if (/^[A-Z0-9]{8,16}$/.test(l)) { bookingCode = l; break; }
  }
  if (!bookingCode) {
    const m = text.match(/\b([A-Z0-9]{10,14})\b/);
    if (m) bookingCode = m[1];
  }

  // Product name
  let product = '';
  if (prodIdx !== -1 && lines[prodIdx + 1]) product = lines[prodIdx + 1];

  // Tour date: "Saturday, June 6th, 2026 7:05 AM"
  let tourDate = '';
  const dateM = text.match(
    /(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s+\w+\s+\d+\w*,?\s+\d{4}/i
  );
  if (dateM) tourDate = dateM[0];

  // Lead traveler: line right after "Lead traveler"
  let leadTraveler = '';
  const leadIdx = lines.findIndex(l => l === 'Lead traveler');
  if (leadIdx !== -1) {
    leadTraveler = (lines[leadIdx + 1] || '').replace(/\s*\(.*?\)\s*/g, '').trim();
  }

  // Phone: standalone line starting with + (inside traveler block)
  let phone = '';
  const phoneM = text.match(/^\+\d[\d\s\-().]{6,}/m);
  if (phoneM) phone = phoneM[0].trim();

  // Number of travelers
  let numTravelers = '';
  const totalM = text.match(/Total:\s*(\d+)\s*person/i);
  if (totalM) {
    const n = parseInt(totalM[1]);
    numTravelers = `${n} ${n === 1 ? 'persona' : 'personas'}`;
  }

  // Pickup location: first real address line after "Location"
  let location = '';
  const locIdx = lines.findIndex(l => l === 'Location');
  if (locIdx !== -1) {
    for (let i = locIdx + 1; i < lines.length; i++) {
      const l = lines[i];
      if (l.startsWith('Good ') || l.startsWith('Edit ') ||
          l.startsWith('Open ') || l === 'Pickup details') continue;
      location = l; break;
    }
  }

  // Pickup time: "Pickup at 7:30 AM"
  let pickupTime = '';
  const pickupM = text.match(/Pickup at\s+(\d+:\d+\s*[AP]M)/i);
  if (pickupM) pickupTime = pickupM[1];

  // Amount: first $XX.XX
  let amount = '';
  const amtM = text.match(/\$(\d+\.\d{2})/);
  if (amtM) amount = '$' + amtM[1] + ' USD';

  return {
    platform: 'GetYourGuide', platformColor: 'gyg',
    bookingCode, product, tourDate,
    leadTraveler, phone, numTravelers,
    location, pickupTime, amount,
    hotelPickup: '', providerCode: ''
  };
}

// ── Viator parser ────────────────────────────

function parseViator(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // Booking code: BR-XXXXXXXXX
  let bookingCode = '';
  const codeM = text.match(/\b(BR-\d+)\b/);
  if (codeM) bookingCode = codeM[1];

  // Product name: line after "Confirmada"
  let product = '';
  const cfmIdx = lines.findIndex(l => /^confirmada$/i.test(l));
  if (cfmIdx !== -1 && lines[cfmIdx + 1]) product = lines[cfmIdx + 1];

  // Tour date: Spanish short format "jue, 10 dic 2026"
  let tourDate = '';
  const dateM = text.match(/(lun|mar|mi[eé]|jue|vie|s[aá]b|dom)[.,]?\s+\d{1,2}\s+\w+\s+\d{4}/i);
  if (dateM) tourDate = dateM[0];

  // Lead traveler
  let leadTraveler = '';
  const leadM = text.match(/Viajero principal:\s*(.+)/i);
  if (leadM) leadTraveler = leadM[1].trim();

  // Phone (may not be present, but try)
  let phone = '';
  const phoneM = text.match(/^\+\d[\d\s\-().]{6,}/m);
  if (phoneM) phone = phoneM[0].trim();

  // Number of travelers
  let numTravelers = '';
  const numM = text.match(/(\d+)\s*(adultos?|niños?|menores?|personas?)/i);
  if (numM) numTravelers = numM[0];

  // Pickup location
  let location = '';
  const locM = text.match(/Punto de recogida:\s*(.+)/i);
  if (locM) location = locM[1].trim();

  // Hotel / special requirements
  let hotelPickup = '';
  const reqM = text.match(/Requisitos especiales:\s*(.+)/i);
  if (reqM) hotelPickup = reqM[1].trim();

  // Pickup time: first HH:MM in text (usually in product subtitle)
  let pickupTime = '';
  const timeM = text.match(/\b(\d{2}:\d{2})\b/);
  if (timeM) pickupTime = timeM[1];

  // Amount received
  let amount = '';
  const amtM = text.match(/Importe que recibirá:\s*([\d,.]+\s*USD)/i);
  if (amtM) amount = amtM[1].trim();

  // Provider confirmation number
  let providerCode = '';
  const provM = text.match(/Número de confirmación del proveedor:\s*(.+)/i);
  if (provM) providerCode = provM[1].trim();

  return {
    platform: 'Viator', platformColor: 'viator',
    bookingCode, product, tourDate,
    leadTraveler, phone, numTravelers,
    location, hotelPickup, pickupTime, amount, providerCode
  };
}

// ── Message generators ───────────────────────

function getSupp() {
  return {
    tourShort:    (document.getElementById('sf-tour')?.value    || '').trim(),
    meetingPoint: (document.getElementById('sf-meeting')?.value || '').trim(),
    area:         (document.getElementById('sf-area')?.value    || '').trim(),
    phone:        (document.getElementById('sf-phone')?.value   || '').trim(),
  };
}

// Driver message — always in Spanish
function generateDriverMsg(data, s) {
  const tourName = s.tourShort
    ? s.tourShort.toUpperCase()
    : (data.product || 'TOUR').toUpperCase();
  const dateLine    = shortDate(data.tourDate) || '—';
  const meeting     = s.meetingPoint || data.location || '—';
  const area        = s.area || '—';
  const phone       = s.phone || data.phone || '—';
  const name        = data.leadTraveler || '—';
  const n           = extractNum(data.numTravelers);
  const peopleStr   = n > 0 ? `${n} ${n === 1 ? 'person' : 'people'}` : '—';

  return [
    `${tourName} – ${dateLine}`,
    '',
    `📍 Meeting point : ${meeting}`,
    '',
    `🕖 Pick-up time: ${data.pickupTime || '—'}`,
    '',
    `📍 Area:  ${area}`,
    '',
    `👤 Client: ${name} (${peopleStr})`,
    '',
    `📞 Phone: ${phone}`,
    '',
    `🔖 Booking code: Paid`,
  ].join('\n');
}

// Client message — always in English
function generateClientMsg(data, s) {
  const fName   = firstName(data.leadTraveler) || 'Guest';
  const meeting = s.meetingPoint || data.location || '___';
  const time    = data.pickupTime || '___';
  const date    = data.tourDate   || '___';

  return [
    `Hello ${fName},`,
    '',
    `Thank you so much for booking with us! We're very excited to have you on the tour.`,
    '',
    `Here are your confirmed pickup details:`,
    '',
    `📅 Tour date: ${date}`,
    '',
    `📍 Pickup point: ${meeting}`,
    '',
    `🕐 Pickup time: ${time}`,
    '',
    `If you have any questions, feel free to contact us. See you soon! 🌊`,
    '',
    `– JAC Tours Team`,
  ].join('\n');
}

// Called whenever a supplementary field changes
function refreshMessages() {
  if (!_bookingData) return;
  const s = getSupp();
  document.getElementById('driver-msg').value = generateDriverMsg(_bookingData, s);
  document.getElementById('client-msg').value = generateClientMsg(_bookingData, s);
}

// ── Ticket renderer ──────────────────────────

function field(label, value, highlight = false) {
  if (!value) return '';
  return `
    <div class="ticket-field">
      <div class="field-label">${label}</div>
      <div class="field-value${highlight ? ' highlight' : ''}">${escHtml(value)}</div>
    </div>`;
}

function renderTicket(data) {
  const now = new Date().toLocaleString('es-DO', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

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
        <div class="ticket-grid">
          ${field('👤 Viajero Principal', data.leadTraveler)}
          ${field('👥 Personas',          data.numTravelers)}
          ${field('📅 Fecha',             data.tourDate)}
          ${field('🕐 Hora de Recogida',  data.pickupTime)}
        </div>
        ${field('📍 Lugar de Recogida', data.location)}
        ${field('🏨 Hotel / Requisitos', data.hotelPickup)}
        ${field('📞 Teléfono',          data.phone)}
        <div class="ticket-divider"></div>
        ${field('💰 Monto Pagado', data.amount, true)}
        ${field('🔖 Conf. Proveedor', data.providerCode)}
        ${data.product ? `<div class="ticket-product">🎟 ${escHtml(data.product)}</div>` : ''}
      </div>

      <div class="ticket-footer">
        <span class="ticket-generated">JAC Booking System</span>
        <span class="ticket-date">Procesado: ${now}</span>
      </div>
    </div>`;
}

// ── Tabs ─────────────────────────────────────

function switchTab(name, btn) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-' + name).classList.remove('hidden');
  btn.classList.add('active');
}

// ── Main action ──────────────────────────────

function parseBooking() {
  const text = document.getElementById('booking-input').value;
  if (!text.trim()) { showToast('⚠ Pega el texto de la reserva primero.'); return; }

  let data;
  if      (isGYG(text))    data = parseGYG(text);
  else if (isViator(text)) data = parseViator(text);
  else { showToast('⚠ No se reconoció la plataforma. Verifica el texto.'); return; }

  _bookingData = data;

  // Pre-fill supplementary fields with whatever we extracted
  document.getElementById('sf-meeting').value = data.location    || '';
  document.getElementById('sf-phone').value   = data.phone       || '';
  document.getElementById('sf-area').value    = data.hotelPickup || '';
  document.getElementById('sf-tour').value    = '';  // user fills short name

  // Render ticket and messages
  renderTicket(data);
  refreshMessages();

  // Show output, reset to ticket tab
  document.getElementById('ticket-placeholder').classList.add('hidden');
  document.getElementById('output-container').classList.remove('hidden');
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-ticket').classList.remove('hidden');
  document.querySelector('.tab').classList.add('active');
}

function clearAll() {
  _bookingData = null;
  document.getElementById('booking-input').value = '';
  document.getElementById('platform-indicator').innerHTML = '';
  document.getElementById('ticket-placeholder').classList.remove('hidden');
  document.getElementById('output-container').classList.add('hidden');
  document.getElementById('ticket').innerHTML = '';
  document.getElementById('driver-msg').value = '';
  document.getElementById('client-msg').value = '';
  ['sf-tour','sf-meeting','sf-area','sf-phone'].forEach(id => {
    document.getElementById(id).value = '';
  });
}

// ── Copy / Print ──────────────────────────────

function printTicket() { window.print(); }

function copyTicketText() {
  const txt = (document.getElementById('ticket')?.innerText || '').replace(/\n{3,}/g, '\n\n');
  navigator.clipboard.writeText(txt)
    .then(() => showToast('✓ Ticket copiado'))
    .catch(() => showToast('⚠ No se pudo copiar'));
}

function copyMsg(id) {
  const val = document.getElementById(id)?.value || '';
  navigator.clipboard.writeText(val)
    .then(() => showToast('✓ Mensaje copiado'))
    .catch(() => showToast('⚠ No se pudo copiar'));
}

// ── Toast ─────────────────────────────────────

let _toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.add('hidden'), 2800);
}
