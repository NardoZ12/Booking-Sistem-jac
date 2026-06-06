/* ─────────────────────────────────────────────
   JAC Booking System · app.js
   Platforms: GetYourGuide (GYG) & Viator
───────────────────────────────────────────── */

let _bookingData = null;
let _hotelMatch  = null;

// ── Hotel schedule database ──────────────────
// Source: Horario_JAC.pdf

const HOTEL_SCHEDULE = [
  // ── UVERO ALTO ───────────────────────────
  { name: 'EXCELENCE PUNTA CANA',          time: '6:40 AM', meetingPoint: 'LOBBY',      zone: 'UVERO ALTO'   },
  { name: 'SIRENIS',                        time: '6:50 AM', meetingPoint: 'LOBBY',      zone: 'UVERO ALTO'   },
  { name: 'EXCELENCE DEL CARMEN Y FINEST',  time: '7:00 AM', meetingPoint: 'LOBBY',      zone: 'UVERO ALTO'   },
  { name: 'BREATHLESS',                     time: '7:00 AM', meetingPoint: 'LOBBY',      zone: 'UVERO ALTO'   },
  { name: 'NOW ONIX',                       time: '7:05 AM', meetingPoint: 'LOBBY',      zone: 'UVERO ALTO'   },
  { name: 'DREAMS ONIX',                    time: '7:05 AM', meetingPoint: 'LOBBY',      zone: 'UVERO ALTO'   },
  { name: 'LIVE AQUA',                      time: '7:10 AM', meetingPoint: 'LOBBY',      zone: 'UVERO ALTO'   },
  { name: 'OCEAN EL FARO',                  time: '7:10 AM', meetingPoint: 'BARRERA',    zone: 'UVERO ALTO'   },
  { name: 'HARD ROCK',                      time: '7:00 AM', meetingPoint: 'LOBBY',      zone: 'UVERO ALTO'   },
  { name: 'BAHIA PRINCIPE PUNTA CANA',      time: '7:10 AM', meetingPoint: 'LOBBY PUJ', zone: 'UVERO ALTO'   },
  { name: 'RIU REPUBLICA',                  time: '7:10 AM', meetingPoint: 'LOBBY',      zone: 'UVERO ALTO'   },
  { name: 'OCCIDENTAL CARIBE',              time: '7:20 AM', meetingPoint: 'LOBBY',      zone: 'UVERO ALTO'   },
  { name: 'ROYALTON SPLASH',                time: '7:25 AM', meetingPoint: 'BARRERA',    zone: 'UVERO ALTO'   },
  { name: 'LOS MAJESTIC',                   time: '7:20 AM', meetingPoint: 'LOBBY',      zone: 'UVERO ALTO'   },
  // ── COMPLEJO RIU ─────────────────────────
  { name: 'RIU PUNTA CANA',                 time: '7:10 AM', meetingPoint: 'LOBBY',      zone: 'COMPLEJO RIU' },
  { name: 'RIU BAMBU',                      time: '7:15 AM', meetingPoint: 'LOBBY',      zone: 'COMPLEJO RIU' },
  { name: 'RIU MACAO',                      time: '7:20 AM', meetingPoint: 'LOBBY',      zone: 'COMPLEJO RIU' },
  { name: 'RIU PALACE BAVARO',              time: '7:25 AM', meetingPoint: 'LOBBY',      zone: 'COMPLEJO RIU' },
  // ── IBEROSTAR ────────────────────────────
  { name: 'IBEROSTAR SELECTION',            time: '7:30 AM', meetingPoint: 'LOBBY',      zone: 'IBEROSTAR'    },
  // ── WHITE SANDS ──────────────────────────
  { name: 'PUNTA CANA PRINCESS',            time: '7:00 AM', meetingPoint: 'LOBBY',      zone: 'WHITE SANDS'  },
  { name: 'VIK ARENA',                      time: '7:10 AM', meetingPoint: 'LOBBY',      zone: 'WHITE SANDS'  },
  { name: 'OCEAN BLUE',                     time: '7:05 AM', meetingPoint: 'LOBBY',      zone: 'WHITE SANDS'  },
  { name: 'KARIBO',                         time: '7:15 AM', meetingPoint: 'LOBBY',      zone: 'WHITE SANDS'  },
  { name: 'CARIBE DELUXE PRINCESS',         time: '7:20 AM', meetingPoint: 'LOBBY',      zone: 'WHITE SANDS'  },
  { name: 'BAVARO PRINCESS',                time: '7:30 AM', meetingPoint: 'LOBBY',      zone: 'WHITE SANDS'  },
  { name: 'OCC PUNTA CANA',                 time: '7:40 AM', meetingPoint: 'LOBBY',      zone: 'WHITE SANDS'  },
  // ── LOS CORALES ──────────────────────────
  { name: 'PALLADIUM PUNTA CANA',           time: '7:00 AM', meetingPoint: 'CASINO',     zone: 'LOS CORALES'  },
  { name: 'PALLADIUM BAVARO',               time: '7:05 AM', meetingPoint: 'MEETING P.', zone: 'LOS CORALES'  },
  { name: 'PRESIDENTIAL SUITES',            time: '7:10 AM', meetingPoint: 'BARRERA',    zone: 'LOS CORALES'  },
  { name: 'VISTA SOL',                      time: '7:10 AM', meetingPoint: 'BARRERA',    zone: 'LOS CORALES'  },
  { name: 'IMPRESSIVE',                     time: '7:20 AM', meetingPoint: 'BARRERA',    zone: 'LOS CORALES'  },
  { name: 'PLAZA TURQUESA',                 time: '7:30 AM', meetingPoint: 'BARRERA',    zone: 'LOS CORALES'  },
  { name: 'WHALA BAVARO',                   time: '7:30 AM', meetingPoint: 'LOBBY',      zone: 'LOS CORALES'  },
  { name: 'SECRETS ROYAL',                  time: '7:35 AM', meetingPoint: 'LOBBY',      zone: 'LOS CORALES'  },
  { name: 'DREAMS ROYAL',                   time: '7:35 AM', meetingPoint: 'LOBBY',      zone: 'LOS CORALES'  },
  { name: 'LOPESAN',                        time: '7:40 AM', meetingPoint: 'LOBBY',      zone: 'LOS CORALES'  },
  { name: 'COMPLEJO MELIA',                 time: '7:40 AM', meetingPoint: 'BARRERA',    zone: 'LOS CORALES'  },
  { name: 'BARCELO BAVARO PALACE',          time: '7:40 AM', meetingPoint: 'LOBBY',      zone: 'LOS CORALES'  },
  { name: 'AC MARRIOTT',                    time: '7:40 AM', meetingPoint: 'LOBBY',      zone: 'LOS CORALES'  },
  { name: 'PETROMOVIL',                     time: '7:50 AM', meetingPoint: 'CAFETERIA',  zone: 'LOS CORALES'  },
];

// ── Hotel select (populated on load) ─────────

function initHotelSelect() {
  const sel = document.getElementById('sf-hotel');
  if (!sel) return;

  const zones = {};
  HOTEL_SCHEDULE.forEach((h, i) => {
    (zones[h.zone] = zones[h.zone] || []).push({ ...h, idx: i });
  });

  sel.innerHTML = '<option value="">-- Sin hotel / pickup propio --</option>';
  Object.entries(zones).forEach(([zone, hotels]) => {
    const g = document.createElement('optgroup');
    g.label = `📍 ${zone}`;
    hotels.forEach(h => {
      const o = document.createElement('option');
      o.value = h.idx;
      o.textContent = `${h.name}  ·  ${h.time}  ·  ${h.meetingPoint}`;
      g.appendChild(o);
    });
    sel.appendChild(g);
  });
}

window.addEventListener('load', initHotelSelect);

// ── Hotel matching ────────────────────────────

function normStr(s) {
  return String(s || '').toUpperCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function matchHotel(rawText) {
  if (!rawText || !rawText.trim()) return null;
  const text = normStr(rawText);

  // Pass 1: longest exact substring match
  const byLength = [...HOTEL_SCHEDULE]
    .map((h, i) => ({ ...h, idx: i }))
    .sort((a, b) => b.name.length - a.name.length);

  for (const h of byLength) {
    if (text.includes(normStr(h.name))) return h;
  }

  // Pass 2: keyword scoring (words ≥ 3 chars)
  let best = null, bestScore = 0;
  HOTEL_SCHEDULE.forEach((h, i) => {
    const words = normStr(h.name).split(' ').filter(w => w.length >= 3);
    if (!words.length) return;
    const matched = words.filter(w => text.includes(w));
    if (!matched.length) return;
    const score = matched.length / words.length;
    if (score > bestScore) { bestScore = score; best = { ...h, idx: i }; }
  });

  return bestScore >= 0.5 ? best : null;
}

// Search only in hotel-specific fields (not street addresses)
function findHotelFromData(data) {
  // hotelPickup (Viator: Requisitos especiales) is the most reliable
  const h = matchHotel(data.hotelPickup);
  if (h) return h;
  // For GYG: also try the raw special requirements or location if it looks like a hotel name
  if (data.location && !/\b(av\.?|calle|street|\d{4,})/i.test(data.location)) {
    return matchHotel(data.location);
  }
  return null;
}

function applyHotelMatch(hotel) {
  _hotelMatch = hotel || null;
  const sel = document.getElementById('sf-hotel');
  if (sel) sel.value = hotel ? hotel.idx : '';

  if (hotel) {
    document.getElementById('sf-meeting').value = hotel.meetingPoint;
    document.getElementById('sf-area').value    = hotel.zone;
    showHotelBanner(hotel);
  } else {
    hideHotelBanner();
  }
  refreshMessages();
}

function onHotelChange(idxStr) {
  const idx = parseInt(idxStr);
  const hotel = (!isNaN(idx) && idx >= 0) ? { ...HOTEL_SCHEDULE[idx], idx } : null;
  applyHotelMatch(hotel);
}

function showHotelBanner(hotel) {
  const el = document.getElementById('hotel-banner');
  el.innerHTML = `
    <span class="hb-icon">✓</span>
    <div class="hb-info">
      <strong>${hotel.name}</strong>
      <span>🕐 ${hotel.time} &nbsp;·&nbsp; 📍 ${hotel.meetingPoint} &nbsp;·&nbsp; ${hotel.zone}</span>
    </div>`;
  el.classList.remove('hidden');
}

function hideHotelBanner() {
  document.getElementById('hotel-banner').classList.add('hidden');
}

// ── Platform detection ────────────────────────

function isGYG(text) {
  return text.includes('Lead traveler') ||
         text.includes('Total commission rate') ||
         text.includes('Booked on') ||
         /Pickup at\s+\d+:\d+\s*[AP]M/i.test(text);
}
function isViator(text) {
  return text.includes('Viajero principal:') ||
         text.includes('Importe que recibirá:') ||
         /\bBR-\d+\b/.test(text);
}

function detectPlatform(text) {
  const el = document.getElementById('platform-indicator');
  if (!text.trim()) { el.innerHTML = ''; return null; }
  if (isGYG(text))    { el.innerHTML = '<span class="detected gyg">✓ GetYourGuide</span>'; return 'gyg'; }
  if (isViator(text)) { el.innerHTML = '<span class="detected viator">✓ Viator</span>';    return 'viator'; }
  el.innerHTML = '<span class="detected unknown">⚠ No reconocido</span>';
  return null;
}

// ── Parsers ───────────────────────────────────

function parseGYG(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  let bookingCode = '';
  const prodIdx  = lines.findIndex(l => l === 'Product thumbnail');
  const headArea = prodIdx > 0 ? lines.slice(0, prodIdx) : lines.slice(0, 4);
  for (const l of headArea) {
    if (/^[A-Z0-9]{8,16}$/.test(l)) { bookingCode = l; break; }
  }
  if (!bookingCode) { const m = text.match(/\b([A-Z0-9]{10,14})\b/); if (m) bookingCode = m[1]; }

  let product = '';
  if (prodIdx !== -1 && lines[prodIdx + 1]) product = lines[prodIdx + 1];

  let tourDate = '';
  const dateM = text.match(/(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s+\w+\s+\d+\w*,?\s+\d{4}/i);
  if (dateM) tourDate = dateM[0];

  let leadTraveler = '';
  const leadIdx = lines.findIndex(l => l === 'Lead traveler');
  if (leadIdx !== -1) leadTraveler = (lines[leadIdx + 1] || '').replace(/\s*\(.*?\)\s*/g, '').trim();

  let phone = '';
  const phoneM = text.match(/^\+\d[\d\s\-().]{6,}/m);
  if (phoneM) phone = phoneM[0].trim();

  let numTravelers = '';
  const totalM = text.match(/Total:\s*(\d+)\s*person/i);
  if (totalM) { const n = parseInt(totalM[1]); numTravelers = `${n} ${n === 1 ? 'persona' : 'personas'}`; }

  let location = '';
  const locIdx = lines.findIndex(l => l === 'Location');
  if (locIdx !== -1) {
    for (let i = locIdx + 1; i < lines.length; i++) {
      const l = lines[i];
      if (l.startsWith('Good ') || l.startsWith('Edit ') || l.startsWith('Open ') || l === 'Pickup details') continue;
      location = l; break;
    }
  }

  let pickupTime = '';
  const pickupM = text.match(/Pickup at\s+(\d+:\d+\s*[AP]M)/i);
  if (pickupM) pickupTime = pickupM[1];

  let amount = '';
  const amtM = text.match(/\$(\d+\.\d{2})/);
  if (amtM) amount = '$' + amtM[1] + ' USD';

  return { platform: 'GetYourGuide', platformColor: 'gyg',
           bookingCode, product, tourDate, leadTraveler, phone,
           numTravelers, location, pickupTime, amount,
           hotelPickup: '', providerCode: '' };
}

function parseViator(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  let bookingCode = '';
  const codeM = text.match(/\b(BR-\d+)\b/);
  if (codeM) bookingCode = codeM[1];

  let product = '';
  const cfmIdx = lines.findIndex(l => /^confirmada$/i.test(l));
  if (cfmIdx !== -1 && lines[cfmIdx + 1]) product = lines[cfmIdx + 1];

  let tourDate = '';
  const dateM = text.match(/(lun|mar|mi[eé]|jue|vie|s[aá]b|dom)[.,]?\s+\d{1,2}\s+\w+\s+\d{4}/i);
  if (dateM) tourDate = dateM[0];

  let leadTraveler = '';
  const leadM = text.match(/Viajero principal:\s*(.+)/i);
  if (leadM) leadTraveler = leadM[1].trim();

  let phone = '';
  const phoneM = text.match(/^\+\d[\d\s\-().]{6,}/m);
  if (phoneM) phone = phoneM[0].trim();

  let numTravelers = '';
  const numM = text.match(/(\d+)\s*(adultos?|niños?|menores?|personas?)/i);
  if (numM) numTravelers = numM[0];

  let location = '';
  const locM = text.match(/Punto de recogida:\s*(.+)/i);
  if (locM) location = locM[1].trim();

  let hotelPickup = '';
  const reqM = text.match(/Requisitos especiales:\s*(.+)/i);
  if (reqM) hotelPickup = reqM[1].trim();

  let pickupTime = '';
  const timeM = text.match(/\b(\d{2}:\d{2})\b/);
  if (timeM) pickupTime = timeM[1];

  let amount = '';
  const amtM = text.match(/Importe que recibirá:\s*([\d,.]+\s*USD)/i);
  if (amtM) amount = amtM[1].trim();

  let providerCode = '';
  const provM = text.match(/Número de confirmación del proveedor:\s*(.+)/i);
  if (provM) providerCode = provM[1].trim();

  return { platform: 'Viator', platformColor: 'viator',
           bookingCode, product, tourDate, leadTraveler, phone,
           numTravelers, location, hotelPickup, pickupTime, amount, providerCode };
}

// ── Helpers ───────────────────────────────────

function firstName(fullName) {
  if (!fullName) return '';
  const f = fullName.trim().split(/\s+/)[0];
  return f.charAt(0).toUpperCase() + f.slice(1).toLowerCase();
}

function extractNum(str) {
  const m = (str || '').match(/\d+/);
  return m ? parseInt(m[0]) : 0;
}

function shortDate(dateStr) {
  if (!dateStr) return '';
  const enM = ['january','february','march','april','may','june',
               'july','august','september','october','november','december'];
  const esM = ['ene','feb','mar','abr','may','jun',
               'jul','ago','sep','oct','nov','dic'];

  const en = dateStr.match(/(monday|tuesday|wednesday|thursday|friday|saturday|sunday)[,.]?\s+(\w+)\s+(\d+)\w*[,.]?\s+(\d{4})/i);
  if (en) { const mi = enM.indexOf(en[2].toLowerCase()); if (mi !== -1) return `${en[3]}/${mi+1}/${en[4].slice(-2)}`; }

  const es = dateStr.match(/(\d{1,2})\s+(\w{3})\w*\s+(\d{4})/);
  if (es) { const mi = esM.indexOf(es[2].toLowerCase()); if (mi !== -1) return `${es[1]}/${mi+1}/${es[3].slice(-2)}`; }

  return dateStr;
}

function escHtml(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Effective pickup time: hotel schedule takes priority
function effectiveTime(data) {
  return _hotelMatch ? _hotelMatch.time : (data.pickupTime || '—');
}

// ── Message generators ────────────────────────

function getSupp() {
  return {
    tourShort:    (document.getElementById('sf-tour')?.value    || '').trim(),
    meetingPoint: (document.getElementById('sf-meeting')?.value || '').trim(),
    area:         (document.getElementById('sf-area')?.value    || '').trim(),
    phone:        (document.getElementById('sf-phone')?.value   || '').trim(),
  };
}

function generateDriverMsg(data, s) {
  const tourName   = (s.tourShort || data.product || 'TOUR').toUpperCase();
  const date       = shortDate(data.tourDate) || '—';
  const time       = effectiveTime(data);
  const meeting    = s.meetingPoint || (_hotelMatch ? _hotelMatch.meetingPoint : '—');
  const area       = s.area || (_hotelMatch ? _hotelMatch.zone : '—');
  const phone      = s.phone || data.phone || '—';
  const name       = data.leadTraveler || '—';
  const n          = extractNum(data.numTravelers);
  const people     = n > 0 ? `${n} ${n === 1 ? 'person' : 'people'}` : '—';

  return [
    `${tourName} – ${date}`,
    '',
    `📍 Meeting point : ${meeting}`,
    '',
    `🕖 Pick-up time: ${time}`,
    '',
    `📍 Area:  ${area}`,
    '',
    `👤 Client: ${name} (${people})`,
    '',
    `📞 Phone: ${phone}`,
    '',
    `🔖 Booking code: Paid`,
  ].join('\n');
}

function generateClientMsg(data, s) {
  const fName   = firstName(data.leadTraveler) || 'Guest';
  const time    = effectiveTime(data);
  const meeting = s.meetingPoint || (_hotelMatch ? _hotelMatch.meetingPoint : '___');
  const date    = data.tourDate || '___';

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
    `If you have any questions, feel free to reach out. See you soon! 🌊`,
    '',
    `– JAC Tours Team`,
  ].join('\n');
}

function refreshMessages() {
  if (!_bookingData) return;
  const s = getSupp();
  const dm = document.getElementById('driver-msg');
  const cm = document.getElementById('client-msg');
  if (dm) dm.value = generateDriverMsg(_bookingData, s);
  if (cm) cm.value = generateClientMsg(_bookingData, s);
}

// ── Ticket renderer ───────────────────────────

function field(label, value, highlight = false) {
  if (!value) return '';
  return `<div class="ticket-field">
    <div class="field-label">${label}</div>
    <div class="field-value${highlight ? ' highlight' : ''}">${escHtml(value)}</div>
  </div>`;
}

function renderTicket(data) {
  const now = new Date().toLocaleString('es-DO', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  const hotel   = _hotelMatch;
  const pTime   = effectiveTime(data);
  const meeting = hotel ? hotel.meetingPoint : (document.getElementById('sf-meeting')?.value || data.location || '');

  const hotelBlock = hotel ? `
    <div class="ticket-hotel-badge">
      <div class="thb-row">
        <span class="thb-icon">🏨</span>
        <span class="thb-name">${escHtml(hotel.name)}</span>
        <span class="thb-zone">${escHtml(hotel.zone)}</span>
      </div>
      <div class="thb-details">
        <span>🕐 ${hotel.time}</span>
        <span>📍 ${hotel.meetingPoint}</span>
      </div>
    </div>` : '';

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
          ${field('🕐 Hora de Recogida',  pTime)}
        </div>
        ${field('📍 Lugar de Recogida', meeting || data.location)}
        ${field('📞 Teléfono',          data.phone)}
        ${hotelBlock}
        <div class="ticket-divider"></div>
        ${field('💰 Monto Pagado', data.amount, true)}
        ${field('🔖 Conf. Proveedor', data.providerCode)}
        ${data.product ? `<div class="ticket-product">🎟 ${escHtml(data.product)}</div>` : ''}
      </div>

      <div class="ticket-footer">
        <span class="ticket-generated">JAC Tour and Transfers</span>
        <span class="ticket-date">Procesado: ${now}</span>
      </div>
    </div>`;
}

// ── Tabs ──────────────────────────────────────

function switchTab(name, btn) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-' + name).classList.remove('hidden');
  btn.classList.add('active');
}

// ── Main action ───────────────────────────────

function parseBooking() {
  const text = document.getElementById('booking-input').value;
  if (!text.trim()) { showToast('⚠ Pega el texto de la reserva primero.'); return; }

  let data;
  if      (isGYG(text))    data = parseGYG(text);
  else if (isViator(text)) data = parseViator(text);
  else { showToast('⚠ No se reconoció la plataforma. Verifica el texto.'); return; }

  _bookingData = data;
  _hotelMatch  = null;

  // Pre-fill supplementary fields
  document.getElementById('sf-phone').value   = data.phone || '';
  document.getElementById('sf-tour').value    = '';
  document.getElementById('sf-meeting').value = '';
  document.getElementById('sf-area').value    = '';
  document.getElementById('sf-hotel').value   = '';
  hideHotelBanner();

  // Auto-detect hotel from booking data
  const detected = findHotelFromData(data);
  if (detected) {
    applyHotelMatch(detected);
    showToast(`🏨 Hotel detectado: ${detected.name}`);
  }

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
  _bookingData = null; _hotelMatch = null;
  document.getElementById('booking-input').value = '';
  document.getElementById('platform-indicator').innerHTML = '';
  document.getElementById('ticket-placeholder').classList.remove('hidden');
  document.getElementById('output-container').classList.add('hidden');
  document.getElementById('ticket').innerHTML = '';
  document.getElementById('driver-msg').value = '';
  document.getElementById('client-msg').value = '';
  ['sf-tour','sf-meeting','sf-area','sf-phone','sf-hotel'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  hideHotelBanner();
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
  navigator.clipboard.writeText(document.getElementById(id)?.value || '')
    .then(() => showToast('✓ Mensaje copiado'))
    .catch(() => showToast('⚠ No se pudo copiar'));
}

// ── Toast ─────────────────────────────────────

let _toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.remove('hidden');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.add('hidden'), 2800);
}
