/* ─────────────────────────────────────────────
   JAC Booking System · app.js
   Platforms: GetYourGuide (GYG) & Viator
───────────────────────────────────────────── */

let _bookingData = null;
let _hotelMatch  = null;

// ── Hotel schedule database ──────────────────
// Source: Horario_JAC.pdf

const HOTEL_SCHEDULE = [
  // ── UVERO ALTO ────────────────────────────────────────────────────────
  { name: 'EXCELLENCE PUNTA CANA',          time: '6:40 AM', meetingPoint: 'LOBBY',         zone: 'UVERO ALTO'    },
  { name: 'SIRENIS',                        time: '6:50 AM', meetingPoint: 'LOBBY',         zone: 'UVERO ALTO'    },
  { name: 'BAHIA PRINCIPE BAVARO',          time: '6:50 AM', meetingPoint: 'LOBBY',         zone: 'UVERO ALTO'    },
  { name: 'EXCELENCE DEL CARMEN Y FINEST',  time: '7:00 AM', meetingPoint: 'LOBBY',         zone: 'UVERO ALTO'    },
  { name: 'BREATHLESS',                     time: '7:00 AM', meetingPoint: 'LOBBY',         zone: 'UVERO ALTO'    },
  { name: 'HARD ROCK',                      time: '7:00 AM', meetingPoint: 'LOBBY',         zone: 'UVERO ALTO'    },
  { name: 'RIU REPUBLICA',                  time: '7:00 AM', meetingPoint: 'LOBBY',         zone: 'UVERO ALTO'    },
  { name: 'NOW ONIX',                       time: '7:05 AM', meetingPoint: 'LOBBY',         zone: 'UVERO ALTO'    },
  { name: 'DREAMS ONIX',                    time: '7:05 AM', meetingPoint: 'LOBBY',         zone: 'UVERO ALTO'    },
  { name: 'LIVE AQUA',                      time: '7:10 AM', meetingPoint: 'LOBBY',         zone: 'UVERO ALTO'    },
  { name: 'OCEAN EL FARO',                  time: '7:10 AM', meetingPoint: 'BARRERA',       zone: 'UVERO ALTO'    },
  { name: 'OCCIDENTAL CARIBE',              time: '7:10 AM', meetingPoint: 'LOBBY',         zone: 'UVERO ALTO'    },
  { name: 'ROYALTON SPLASH PUNTA CANA',     time: '7:10 AM', meetingPoint: 'BARRERA',       zone: 'UVERO ALTO'    },
  { name: 'LOS MAJESTIC',                   time: '7:20 AM', meetingPoint: 'LOBBY',         zone: 'UVERO ALTO'    },
  // ── COMPLEJO RIU ──────────────────────────────────────────────────────
  { name: 'RIU PUNTA CANA',                 time: '7:00 AM', meetingPoint: 'LOBBY',         zone: 'COMPLEJO RIU'  },
  { name: 'RIU BAMBU',                      time: '7:05 AM', meetingPoint: 'LOBBY',         zone: 'COMPLEJO RIU'  },
  { name: 'RIU MACAO',                      time: '7:10 AM', meetingPoint: 'LOBBY',         zone: 'COMPLEJO RIU'  },
  { name: 'RIU NAIBOA',                     time: '7:15 AM', meetingPoint: 'LOBBY',         zone: 'COMPLEJO RIU'  },
  { name: 'RIU PALACE BAVARO',              time: '7:20 AM', meetingPoint: 'LOBBY',         zone: 'COMPLEJO RIU'  },
  // ── IBEROSTAR ─────────────────────────────────────────────────────────
  { name: 'IBEROSTAR SELECTION',            time: '7:30 AM', meetingPoint: 'LOBBY',         zone: 'IBEROSTAR'     },
  // ── WHITE SANDS ───────────────────────────────────────────────────────
  { name: 'PUNTA CANA PRINCESS',            time: '6:50 AM', meetingPoint: 'LOBBY',         zone: 'WHITE SANDS'   },
  { name: 'VIK ARENA',                      time: '6:55 AM', meetingPoint: 'LOBBY',         zone: 'WHITE SANDS'   },
  { name: 'OCEAN BLUE',                     time: '7:05 AM', meetingPoint: 'LOBBY',         zone: 'WHITE SANDS'   },
  { name: 'CARIBE DELUXE PRINCESS',         time: '7:10 AM', meetingPoint: 'LOBBY',         zone: 'WHITE SANDS'   },
  { name: 'BAVARO PRINCESS',                time: '7:20 AM', meetingPoint: 'LOBBY',         zone: 'WHITE SANDS'   },
  { name: 'OCCIDENTAL PUNTA CANA',          time: '7:30 AM', meetingPoint: 'LOBBY',         zone: 'WHITE SANDS'   },
  // ── LOS CORALES ───────────────────────────────────────────────────────
  { name: 'PALLADIUM PUNTA CANA',           time: '7:00 AM', meetingPoint: 'CASINO',        zone: 'LOS CORALES'   },
  { name: 'PALLADIUM BAVARO',               time: '7:00 AM', meetingPoint: 'MEETING POINT', zone: 'LOS CORALES'   },
  { name: 'PRESIDENTIAL SUITES',            time: '7:05 AM', meetingPoint: 'BARRERA',       zone: 'LOS CORALES'   },
  { name: 'VISTA SOL',                      time: '7:10 AM', meetingPoint: 'BARRERA',       zone: 'LOS CORALES'   },
  { name: 'IMPRESSIVE',                     time: '7:20 AM', meetingPoint: 'BARRERA',       zone: 'LOS CORALES'   },
  { name: 'PLAZA TURQUESA',                 time: '7:30 AM', meetingPoint: 'DALIAS',        zone: 'LOS CORALES'   },
  { name: 'WHALA BAVARO',                   time: '7:30 AM', meetingPoint: 'LOBBY',         zone: 'LOS CORALES'   },
  { name: 'SECRETS ROYAL BEACH',            time: '7:35 AM', meetingPoint: 'LOBBY',         zone: 'LOS CORALES'   },
  { name: 'DREAMS ROYAL BEACH',             time: '7:35 AM', meetingPoint: 'LOBBY',         zone: 'LOS CORALES'   },
  { name: 'LOPESAN',                        time: '7:40 AM', meetingPoint: 'LOBBY',         zone: 'LOS CORALES'   },
  { name: 'COMPLEJO MELIA',                 time: '7:40 AM', meetingPoint: 'BARRERA',       zone: 'LOS CORALES'   },
  { name: 'BARCELO BAVARO PALACE',          time: '7:40 AM', meetingPoint: 'LOBBY',         zone: 'LOS CORALES'   },
  { name: 'AC MARRIOTT',                    time: '7:45 AM', meetingPoint: 'BARRERA',       zone: 'LOS CORALES'   },
  // ── CABEZA DE TORO ────────────────────────────────────────────────────
  { name: 'DREAM PALM BEACH',               time: '7:20 AM', meetingPoint: 'LOBBY',         zone: 'CABEZA DE TORO'},
  { name: 'SUNSCAPE COCO',                  time: '7:30 AM', meetingPoint: 'LOBBY',         zone: 'CABEZA DE TORO'},
  { name: 'SERENADE',                       time: '7:35 AM', meetingPoint: 'LOBBY',         zone: 'CABEZA DE TORO'},
  { name: 'CATALONIA ROYAL',                time: '7:40 AM', meetingPoint: 'LOBBY',         zone: 'CABEZA DE TORO'},
  { name: 'CATALONIA BAVARO',               time: '7:40 AM', meetingPoint: 'LOBBY',         zone: 'CABEZA DE TORO'},
];

// ── Hotel select (populated on load) ─────────

function populateHotelSelect(selectId) {
  const sel = document.getElementById(selectId);
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

function initHotelSelects() {
  populateHotelSelect('sf-hotel');
  populateHotelSelect('mf-hotel');
}

window.addEventListener('load', initHotelSelects);

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
  refreshAll();
}

function onHotelChange(idxStr) {
  // Clear time override so the newly selected hotel's schedule takes effect
  const sfTime = document.getElementById('sf-time');
  if (sfTime) sfTime.value = '';

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

// ── Text normalisation ────────────────────────
// Different browsers/OS copy-paste with different whitespace chars.
// Normalise before any detection or parsing.

function normalizeText(text) {
  return text
    .replace(/\r\n/g, '\n')   // Windows line endings
    .replace(/\r/g, '\n')     // old Mac line endings
    .replace(/ /g, ' ')  // non-breaking space (common in GYG copy)
    .replace(/ /g, ' ')  // thin space
    .replace(/ /g, ' ')  // narrow no-break space
    .replace(/​/g, '');  // zero-width space
}

// ── Platform detection ────────────────────────

function isGYG(text) {
  return /\bGYG[A-Z0-9]{5,}/i.test(text) ||   // GYG booking code always starts with GYG
         text.includes('Lead traveler') ||
         text.includes('Total commission rate') ||
         text.includes('Booked on') ||
         /Pickup at\s+\d+:\d+\s*[AP]M/i.test(text) ||
         /\d+\s+people\s+-\s+\$[\d.]+/.test(text);
}
function isViator(text) {
  return text.includes('Viajero principal:') ||
         text.includes('Importe que recibirá:') ||
         /\bBR-\d+\b/.test(text) ||
         text.includes('Requisitos especiales:') ||
         text.includes('Punto de recogida:');
}

function detectPlatform(text) {
  const el = document.getElementById('platform-indicator');
  if (!text.trim()) { el.innerHTML = ''; return null; }
  const t = normalizeText(text);
  if (isGYG(t))    { el.innerHTML = '<span class="detected gyg">✓ GetYourGuide</span>'; return 'gyg'; }
  if (isViator(t)) { el.innerHTML = '<span class="detected viator">✓ Viator</span>';    return 'viator'; }
  el.innerHTML = '<span class="detected unknown">⚠ No reconocido</span>';
  return null;
}

// ── Parsers ───────────────────────────────────

function parseGYG(raw) {
  const text  = normalizeText(raw);
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  let bookingCode = '';
  const prodIdx  = lines.findIndex(l => l === 'Product thumbnail');
  const headArea = prodIdx > 0 ? lines.slice(0, prodIdx) : lines.slice(0, 8);
  for (const l of headArea) {
    if (/^[A-Z0-9]{8,16}$/.test(l)) { bookingCode = l; break; }
  }
  if (!bookingCode) {
    const codeM = text.match(/(?:Booking:\s*)?([A-Z0-9]{8,16})/);
    if (codeM) bookingCode = codeM[1];
  }

  // Format 2: has "Product thumbnail" line; Format 1: product is first non-option line
  let product = '';
  if (prodIdx !== -1 && lines[prodIdx + 1]) {
    product = lines[prodIdx + 1];
  } else {
    const optIdx = lines.findIndex(l => l.startsWith('Option:'));
    if (optIdx > 0) product = lines[optIdx - 1];
    else if (lines[0] && !/^Booking:/i.test(lines[0])) product = lines[0];
  }

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
  // "Total: 2 people" or "Total: 2 persons" or "Total: 1 person"
  const totalM = text.match(/Total:\s*(\d+)\s*p(?:erson|eople)/i);
  if (totalM) {
    const n = parseInt(totalM[1]);
    numTravelers = `${n} ${n === 1 ? 'persona' : 'personas'}`;
  } else {
    // Fallback: "2 Adults" or "2x Adult"
    const adultM = text.match(/(\d+)(?:x)?\s*Adults?/i);
    if (adultM) { const n = parseInt(adultM[1]); numTravelers = `${n} ${n === 1 ? 'persona' : 'personas'}`; }
  }

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

function parseViator(raw) {
  const text  = normalizeText(raw);
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

// Effective pickup time: manual sf-time override > hotel schedule > parsed time
function effectiveTime(data) {
  const override = (document.getElementById('sf-time')?.value || '').trim();
  if (override) return override;
  return _hotelMatch ? _hotelMatch.time : (data.pickupTime || '—');
}

function refreshAll() {
  if (!_bookingData) return;
  renderTicket(_bookingData);
  refreshMessages();
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

// ── Input mode (paste vs. manual) ─────────────

function switchInputMode(name, btn) {
  document.querySelectorAll('.input-mode').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.mode-tab').forEach(el => el.classList.remove('active'));
  document.getElementById('mode-' + name).classList.remove('hidden');
  btn.classList.add('active');
}

function onManualHotelChange(idxStr) {
  const idx = parseInt(idxStr);
  if (isNaN(idx) || idx < 0) return;
  const hotel = HOTEL_SCHEDULE[idx];
  if (!hotel) return;
  document.getElementById('mf-location').value = hotel.meetingPoint;
  document.getElementById('mf-time').value     = hotel.time;
}

function clearManualForm() {
  ['mf-traveler','mf-people','mf-tour','mf-date','mf-hotel',
   'mf-location','mf-time','mf-amount','mf-phone'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
}

// ── Main action ───────────────────────────────

function parseBooking() {
  const raw  = document.getElementById('booking-input').value;
  if (!raw.trim()) { showToast('⚠ Pega el texto de la reserva primero.'); return; }
  const text = normalizeText(raw);

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

function generateManualBooking() {
  const traveler = document.getElementById('mf-traveler').value.trim();
  const peopleN  = parseInt(document.getElementById('mf-people').value) || 0;
  const tour     = document.getElementById('mf-tour').value.trim();
  const date     = document.getElementById('mf-date').value.trim();
  const hotelIdx = document.getElementById('mf-hotel').value;
  const location = document.getElementById('mf-location').value.trim();
  const time     = document.getElementById('mf-time').value.trim();
  const amount   = document.getElementById('mf-amount').value.trim();
  const phone    = document.getElementById('mf-phone').value.trim();

  if (!traveler) { showToast('⚠ Ingresa el nombre del viajero principal.'); return; }

  const idx = parseInt(hotelIdx);
  const hotel = (!isNaN(idx) && idx >= 0) ? { ...HOTEL_SCHEDULE[idx], idx } : null;

  const data = {
    platform: 'Manual', platformColor: 'manual',
    bookingCode: '', product: tour, tourDate: date,
    leadTraveler: traveler, phone,
    numTravelers: peopleN > 0 ? `${peopleN} ${peopleN === 1 ? 'persona' : 'personas'}` : '',
    location, hotelPickup: hotel ? hotel.name : '',
    pickupTime: time, amount, providerCode: ''
  };

  _bookingData = data;
  _hotelMatch  = hotel;

  // Sync supplementary fields with manual data
  document.getElementById('sf-phone').value   = phone;
  document.getElementById('sf-tour').value    = tour;
  document.getElementById('sf-meeting').value = hotel ? hotel.meetingPoint : location;
  document.getElementById('sf-area').value    = hotel ? hotel.zone : '';
  document.getElementById('sf-hotel').value   = hotel ? hotel.idx : '';

  hideHotelBanner();
  if (hotel) showHotelBanner(hotel);

  renderTicket(data);
  refreshMessages();

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
  ['sf-tour','sf-time','sf-meeting','sf-area','sf-phone','sf-hotel'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  clearManualForm();
  document.querySelectorAll('.input-mode').forEach(el => el.classList.add('hidden'));
  document.getElementById('mode-paste').classList.remove('hidden');
  document.querySelectorAll('.mode-tab').forEach(el => el.classList.remove('active'));
  document.querySelector('.mode-tab').classList.add('active');
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

// ── Download (PNG / PDF) ──────────────────────

function ticketFileName(ext) {
  const name = (_bookingData?.leadTraveler || 'ticket').trim().replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '');
  return `JAC_Ticket_${name || 'reserva'}.${ext}`;
}

function captureTicketCanvas() {
  const card = document.querySelector('#ticket .ticket-card');
  if (!card) { showToast('⚠ No hay ticket para descargar.'); return null; }
  return html2canvas(card, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
}

function downloadTicketPNG() {
  const capture = captureTicketCanvas();
  if (!capture) return;
  capture.then(canvas => {
    const link = document.createElement('a');
    link.download = ticketFileName('png');
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('✓ Imagen descargada');
  }).catch(() => showToast('⚠ No se pudo generar la imagen'));
}

function downloadTicketPDF() {
  const capture = captureTicketCanvas();
  if (!capture) return;
  capture.then(canvas => {
    const { jsPDF } = window.jspdf;
    const pxToMm   = px => px * 0.264583;
    const widthMm  = pxToMm(canvas.width);
    const heightMm = pxToMm(canvas.height);
    const pdf = new jsPDF({
      orientation: widthMm > heightMm ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [widthMm, heightMm]
    });
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, widthMm, heightMm);
    pdf.save(ticketFileName('pdf'));
    showToast('✓ PDF descargado');
  }).catch(() => showToast('⚠ No se pudo generar el PDF'));
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
