/* ─────────────────────────────────────────────
   JAC Booking System · app.js
   Platforms: GetYourGuide (GYG) & Viator
───────────────────────────────────────────── */

// Each platform page (gyg / viator) keeps its own booking + hotel-match state,
// so processing one platform never touches the other's form or output.
const _state = {
  gyg:    { bookingData: null, hotelMatch: null },
  viator: { bookingData: null, hotelMatch: null },
};

// ── Hotel schedule database ──────────────────
// Source: Horario_JAC.pdf

const HOTEL_SCHEDULE = [
  // ── UVERO ALTO ────────────────────────────────────────────────────────
  { name: 'EXCELLENCE PUNTA CANA',          time: '6:40 AM', meetingPoint: 'LOBBY',         zone: 'UVERO ALTO'    },
  { name: 'SIRENIS',                        time: '6:50 AM', meetingPoint: 'LOBBY',         zone: 'UVERO ALTO'    },
  { name: 'EXCELENCE DEL CARMEN Y FINEST',  time: '7:00 AM', meetingPoint: 'LOBBY',         zone: 'UVERO ALTO'    },
  { name: 'BREATHLESS',                     time: '7:00 AM', meetingPoint: 'LOBBY',         zone: 'UVERO ALTO'    },
  { name: 'NOW ONIX',                       time: '7:05 AM', meetingPoint: 'LOBBY',         zone: 'UVERO ALTO'    },
  { name: 'DREAMS ONIX',                    time: '7:05 AM', meetingPoint: 'LOBBY',         zone: 'UVERO ALTO'    },
  { name: 'LIVE AQUA',                      time: '7:10 AM', meetingPoint: 'LOBBY',         zone: 'UVERO ALTO'    },
  { name: 'OCEAN EL FARO',                  time: '7:10 AM', meetingPoint: 'BARRERA',       zone: 'UVERO ALTO'    },
  // ── ARENA GORDA (Hard Rock) ───────────────────────────────────────────
  { name: 'HARD ROCK',                      time: '7:00 AM', meetingPoint: 'LOBBY',         zone: 'ARENA GORDA'   },
  { name: 'BAHIA PRINCIPE BAVARO',          time: '6:50 AM', meetingPoint: 'LOBBY',         zone: 'ARENA GORDA'   },
  { name: 'RIU REPUBLICA',                  time: '7:00 AM', meetingPoint: 'LOBBY',         zone: 'ARENA GORDA'   },
  { name: 'OCCIDENTAL CARIBE',              time: '7:10 AM', meetingPoint: 'LOBBY',         zone: 'ARENA GORDA'   },
  { name: 'ROYALTON SPLASH PUNTA CANA',     time: '7:10 AM', meetingPoint: 'BARRERA',       zone: 'ARENA GORDA'   },
  { name: 'LOS MAJESTIC',                   time: '7:20 AM', meetingPoint: 'LOBBY',         zone: 'ARENA GORDA'   },
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
  { name: 'DREAMS PALM BEACH',              time: '7:20 AM', meetingPoint: 'LOBBY',         zone: 'CABEZA DE TORO'},
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
  ['gyg', 'viator'].forEach(key => {
    populateHotelSelect(`${key}-sf-hotel`);
    populateHotelSelect(`${key}-mf-hotel`);
  });
}

window.addEventListener('load', () => {
  initHotelSelects();
  renderClock();
  setInterval(renderClock, 1000);
  renderOverview();
});

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

function applyHotelMatch(key, hotel) {
  _state[key].hotelMatch = hotel || null;
  const sel = document.getElementById(`${key}-sf-hotel`);
  if (sel) sel.value = hotel ? hotel.idx : '';

  if (hotel) {
    document.getElementById(`${key}-sf-meeting`).value = hotel.meetingPoint;
    document.getElementById(`${key}-sf-area`).value    = hotel.zone;
    showHotelBanner(key, hotel);
  } else {
    hideHotelBanner(key);
  }
  refreshAll(key);
}

function onHotelChange(key, idxStr) {
  // Clear time override so the newly selected hotel's schedule takes effect
  const sfTime = document.getElementById(`${key}-sf-time`);
  if (sfTime) sfTime.value = '';

  const idx = parseInt(idxStr);
  const hotel = (!isNaN(idx) && idx >= 0) ? { ...HOTEL_SCHEDULE[idx], idx } : null;
  applyHotelMatch(key, hotel);
}

function showHotelBanner(key, hotel) {
  const el = document.getElementById(`${key}-hotel-banner`);
  el.innerHTML = `
    <span class="hb-icon">✓</span>
    <div class="hb-info">
      <strong>${hotel.name}</strong>
      <span>🕐 ${hotel.time} &nbsp;·&nbsp; 📍 ${hotel.meetingPoint} &nbsp;·&nbsp; ${hotel.zone}</span>
    </div>`;
  el.classList.remove('hidden');
}

function hideHotelBanner(key) {
  document.getElementById(`${key}-hotel-banner`).classList.add('hidden');
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

// Each platform page knows its own parser — no cross-platform auto-detection needed.
const PLATFORM_CONFIG = {
  gyg:    { label: 'GetYourGuide', detect: isGYG,    parse: parseGYG    },
  viator: { label: 'Viator',       detect: isViator, parse: parseViator },
};

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
    const optIdx = lines.findIndex(l => /^Opci[oó]n:|^Option:/i.test(l));
    if (optIdx > 0) product = lines[optIdx - 1];
    else if (lines[0] && !/^Booking:/i.test(lines[0])) product = lines[0];
  }

  // Strip the purchase date first — "Booked on" is often followed by the date on
  // its own line ("Wednesday, June 24th, 2026"), which would otherwise be picked
  // up as the tour date since it also uses a weekday name.
  const textNoBookedOn = text.replace(
    /Booked on\s*[\r\n]*\s*(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s+\w+\s+\d+\w*,?\s+\d{4}/i, ''
  );

  let tourDate = '';
  const dateM = textNoBookedOn.match(/(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s+\w+\s+\d+\w*,?\s+\d{4}/i);
  if (dateM) tourDate = dateM[0];
  else {
    const dateEsM = textNoBookedOn.match(/(?:(?:lunes|martes|mi[eé]rcoles|jueves|viernes|s[aá]bado|domingo),\s+)?\d{1,2}\s+de\s+\w+\s+de\s+\d{4}/i);
    if (dateEsM) tourDate = dateEsM[0];
    else {
      // Activity date as shown in the page header, e.g. "Jun 25, 2026" (no weekday)
      const dateAbbrM = textNoBookedOn.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+\d{4}\b/);
      if (dateAbbrM) tourDate = dateAbbrM[0];
    }
  }

  let leadTraveler = '';
  const leadIdx = lines.findIndex(l => l === 'Lead traveler' || l === 'Viajero principal');
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
    // Fallback: "2 Adults", "2x Adult" or "2 Adultos"
    const adultM = text.match(/(\d+)\s*x?\s*(?:Adults?|Adultos?)/i);
    if (adultM) { const n = parseInt(adultM[1]); numTravelers = `${n} ${n === 1 ? 'persona' : 'personas'}`; }
  }

  let location = '';
  const locIdx = lines.findIndex(l => l === 'Location' || l === 'Detalles de la recogida');
  if (locIdx !== -1) {
    for (let i = locIdx + 1; i < lines.length; i++) {
      const l = lines[i];
      if (l.startsWith('Good ') || l.startsWith('Edit ') || l.startsWith('Open ') || l === 'Pickup details' ||
          /^(Editar|Abrir|Ubicaci[oó]n)/i.test(l)) continue;
      location = l; break;
    }
  }

  let pickupTime = '';
  const pickupM = text.match(/Pickup at\s+(\d+:\d+\s*[AP]M)/i);
  if (pickupM) pickupTime = pickupM[1];
  else {
    const pickupEsM = text.match(/Recogida a las\s+(\d{1,2}):(\d{2})/i);
    if (pickupEsM) pickupTime = to12Hour(pickupEsM[1], pickupEsM[2]);
  }

  let amount = '';
  const amtM = text.match(/\$(\d+\.\d{2})/);
  if (amtM) amount = '$' + amtM[1] + ' USD';
  else {
    const amtEsM = text.match(/(\d+),(\d{2})\s*US\$/);
    if (amtEsM) amount = '$' + amtEsM[1] + '.' + amtEsM[2] + ' USD';
  }

  const { adultCount, childCount } = extractPeopleBreakdown(text);

  return { platform: 'GetYourGuide', platformColor: 'gyg',
           bookingCode, product, tourDate, leadTraveler, phone,
           numTravelers, adultCount, childCount, location, pickupTime, amount,
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

  const { adultCount, childCount } = extractPeopleBreakdown(text);

  return { platform: 'Viator', platformColor: 'viator',
           bookingCode, product, tourDate, leadTraveler, phone,
           numTravelers, adultCount, childCount, location, hotelPickup, pickupTime, amount, providerCode };
}

// ── Helpers ───────────────────────────────────

// "2 Adults" / "2x Adult" / "2 Adultos" and "1 Child" / "1 Niño" / "1 Menor" — null when absent
function extractPeopleBreakdown(text) {
  let adultCount = null, childCount = null;
  const aM = text.match(/(\d+)\s*x?\s*(?:Adults?|Adultos?)\b/i);
  if (aM) adultCount = parseInt(aM[1]);
  const cM = text.match(/(\d+)\s*x?\s*(?:Child(?:ren)?|Ni[nñ]os?|Menores?)\b/i);
  if (cM) childCount = parseInt(cM[1]);
  return { adultCount, childCount };
}

function firstName(fullName) {
  if (!fullName) return '';
  const f = fullName.trim().split(/\s+/)[0];
  return f.charAt(0).toUpperCase() + f.slice(1).toLowerCase();
}

function extractNum(str) {
  const m = (str || '').match(/\d+/);
  return m ? parseInt(m[0]) : 0;
}

// Convert 24h "HH:MM" to "H:MM AM/PM"
function to12Hour(hh, mm) {
  let h = parseInt(hh, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${mm} ${ampm}`;
}

function shortDate(dateStr) {
  if (!dateStr) return '';
  const enM = ['january','february','march','april','may','june',
               'july','august','september','october','november','december'];
  const esLongM = ['enero','febrero','marzo','abril','mayo','junio',
                   'julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const esM = ['ene','feb','mar','abr','may','jun',
               'jul','ago','sep','oct','nov','dic'];

  const en = dateStr.match(/(monday|tuesday|wednesday|thursday|friday|saturday|sunday)[,.]?\s+(\w+)\s+(\d+)\w*[,.]?\s+(\d{4})/i);
  if (en) { const mi = enM.indexOf(en[2].toLowerCase()); if (mi !== -1) return `${en[3]}/${mi+1}/${en[4].slice(-2)}`; }

  const esLong = dateStr.match(/(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})/i);
  if (esLong) { const mi = esLongM.indexOf(esLong[2].toLowerCase()); if (mi !== -1) return `${esLong[1]}/${mi+1}/${esLong[3].slice(-2)}`; }

  const es = dateStr.match(/(\d{1,2})\s+(\w{3})\w*\s+(\d{4})/);
  if (es) { const mi = esM.indexOf(es[2].toLowerCase()); if (mi !== -1) return `${es[1]}/${mi+1}/${es[3].slice(-2)}`; }

  return dateStr;
}

function escHtml(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Effective pickup time: manual sf-time override > hotel schedule > parsed time
function effectiveTime(key, data) {
  const override = (document.getElementById(`${key}-sf-time`)?.value || '').trim();
  if (override) return override;
  const hotelMatch = _state[key].hotelMatch;
  return hotelMatch ? hotelMatch.time : (data.pickupTime || '—');
}

function refreshAll(key) {
  const st = _state[key];
  if (!st.bookingData) return;
  renderTicket(key, st.bookingData);
  refreshMessages(key);
}

// ── Message generators ────────────────────────

function getSupp(key) {
  return {
    tourShort:    (document.getElementById(`${key}-sf-tour`)?.value    || '').trim(),
    meetingPoint: (document.getElementById(`${key}-sf-meeting`)?.value || '').trim(),
    area:         (document.getElementById(`${key}-sf-area`)?.value    || '').trim(),
    phone:        (document.getElementById(`${key}-sf-phone`)?.value   || '').trim(),
  };
}

function generateDriverMsg(key, data, s) {
  const hotelMatch = _state[key].hotelMatch;
  const tourName   = (s.tourShort || data.product || 'TOUR').toUpperCase();
  const date       = shortDate(data.tourDate) || '—';
  const time       = effectiveTime(key, data);
  const hotel      = hotelMatch ? hotelMatch.name : (data.location || data.hotelPickup || '—');
  const meeting    = s.meetingPoint || (hotelMatch ? hotelMatch.meetingPoint : '—');
  const phone      = s.phone || data.phone || '—';
  const name       = data.leadTraveler || '—';
  const n          = extractNum(data.numTravelers);
  const people     = n > 0 ? `${n} ${n === 1 ? 'person' : 'people'}` : '—';

  return [
    `${tourName} – ${date}`,
    '',
    `🏨 Hotel: ${hotel}`,
    '',
    `📍 Meeting point : ${meeting}`,
    '',
    `🕖 Pick-up time: ${time}`,
    '',
    `👤 Client: ${name} (${people})`,
    '',
    `📞 Phone: ${phone}`,
    '',
    `🔖 Booking code: Paid`,
  ].join('\n');
}

function generateClientMsg(key, data, s) {
  const hotelMatch = _state[key].hotelMatch;
  const fName   = firstName(data.leadTraveler) || 'Guest';
  const time    = effectiveTime(key, data);
  const meeting = s.meetingPoint || (hotelMatch ? hotelMatch.meetingPoint : '___');
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

function refreshMessages(key) {
  const st = _state[key];
  if (!st.bookingData) return;
  const s = getSupp(key);
  const dm = document.getElementById(`${key}-driver-msg`);
  const cm = document.getElementById(`${key}-client-msg`);
  if (dm) dm.value = generateDriverMsg(key, st.bookingData, s);
  if (cm) cm.value = generateClientMsg(key, st.bookingData, s);
}

// ── Ticket renderer ───────────────────────────

function ticketRow(label, value) {
  if (!value) return '';
  return `<div class="t-row">
    <div class="t-label">${escHtml(label)}</div>
    <div class="t-value">${escHtml(value)}</div>
  </div>`;
}

function ticketRow2(labelA, valueA, labelB, valueB) {
  if (!valueA && !valueB) return '';
  return `<div class="t-row2">
    <div class="t-col">
      <div class="t-label">${escHtml(labelA)}</div>
      <div class="t-value">${valueA ? escHtml(valueA) : '—'}</div>
    </div>
    <div class="t-col">
      <div class="t-label">${escHtml(labelB)}</div>
      <div class="t-value">${valueB ? escHtml(valueB) : '—'}</div>
    </div>
  </div>`;
}

function renderTicket(key, data) {
  const hotel   = _state[key].hotelMatch;
  const pTime   = effectiveTime(key, data);
  const meeting = hotel ? hotel.meetingPoint : (document.getElementById(`${key}-sf-meeting`)?.value || data.location || data.hotelPickup || '');

  const peopleBlock = (data.adultCount != null || data.childCount != null)
    ? ticketRow2('Adult', `${data.adultCount ?? 0} people`, 'Child', `${data.childCount ?? 0} people`)
    : ticketRow('Persons', data.numTravelers);

  document.getElementById(`${key}-ticket`).innerHTML = `
    <div class="ticket-card ${data.platformColor}">
      <div class="ticket-bar"></div>
      <div class="ticket-brandbar">
        <img class="ticket-logo-img" src="assets/jac-logo.png" alt="JAC" onerror="this.style.display='none'">
      </div>
      <div class="ticket-white">
        ${data.product ? `<h2 class="ticket-title">${escHtml(data.product)}</h2>` : ''}
        ${ticketRow('Name', data.leadTraveler)}
        ${ticketRow2('Date', shortDate(data.tourDate) || data.tourDate, 'Time', pTime)}
        ${hotel ? ticketRow('Hotel', hotel.name) : ''}
        ${ticketRow('Pick up point', meeting)}
        ${peopleBlock}
        ${data.phone ? ticketRow('Phone', data.phone) : ''}
        ${data.amount ? `
        <div class="t-divider"></div>
        <div class="t-total-label">Total</div>
        <div class="t-total-value">${escHtml(data.amount)}</div>` : ''}
      </div>
      <div class="ticket-bar"></div>
    </div>`;
}

// ── Tabs ──────────────────────────────────────

function switchTab(key, name, btn) {
  const page = document.getElementById('page-' + key);
  page.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  page.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
  document.getElementById(`${key}-tab-${name}`).classList.remove('hidden');
  btn.classList.add('active');
}

// ── Input mode (paste vs. manual) ─────────────

function switchInputMode(key, name, btn) {
  const page = document.getElementById('page-' + key);
  page.querySelectorAll('.input-mode').forEach(el => el.classList.add('hidden'));
  page.querySelectorAll('.mode-tab').forEach(el => el.classList.remove('active'));
  document.getElementById(`${key}-mode-${name}`).classList.remove('hidden');
  btn.classList.add('active');
}

function onManualHotelChange(key, idxStr) {
  const idx = parseInt(idxStr);
  if (isNaN(idx) || idx < 0) return;
  const hotel = HOTEL_SCHEDULE[idx];
  if (!hotel) return;
  document.getElementById(`${key}-mf-location`).value = hotel.meetingPoint;
  document.getElementById(`${key}-mf-time`).value     = hotel.time;
}

function clearManualForm(key) {
  ['mf-traveler','mf-people','mf-tour','mf-date','mf-hotel',
   'mf-location','mf-time','mf-amount','mf-phone'].forEach(id => {
    const el = document.getElementById(`${key}-${id}`); if (el) el.value = '';
  });
}

// ── Main action ───────────────────────────────

function parseBooking(key) {
  const cfg = PLATFORM_CONFIG[key];
  const raw = document.getElementById(`${key}-booking-input`).value;
  if (!raw.trim()) { showToast('⚠ Pega el texto de la reserva primero.'); return; }
  const text = normalizeText(raw);

  if (!cfg.detect(text)) {
    showToast(`⚠ Este texto no parece ser de ${cfg.label}. Verifica que sea el formato correcto.`);
    return;
  }
  const data = cfg.parse(text);

  _state[key].bookingData = data;
  _state[key].hotelMatch  = null;

  // Pre-fill supplementary fields
  document.getElementById(`${key}-sf-phone`).value   = data.phone || '';
  document.getElementById(`${key}-sf-tour`).value    = '';
  document.getElementById(`${key}-sf-meeting`).value = '';
  document.getElementById(`${key}-sf-area`).value    = '';
  document.getElementById(`${key}-sf-hotel`).value   = '';
  hideHotelBanner(key);

  // Auto-detect hotel from booking data
  const detected = findHotelFromData(data);
  if (detected) {
    applyHotelMatch(key, detected);
    showToast(`🏨 Hotel detectado: ${detected.name}`);
  }

  // Render ticket and messages
  renderTicket(key, data);
  refreshMessages(key);

  // Show output, reset to ticket tab
  document.getElementById(`${key}-ticket-placeholder`).classList.add('hidden');
  document.getElementById(`${key}-output-container`).classList.remove('hidden');
  const page = document.getElementById('page-' + key);
  page.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  page.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
  document.getElementById(`${key}-tab-ticket`).classList.remove('hidden');
  page.querySelector('.tab').classList.add('active');

  saveToHistory(key);
}

function generateManualBooking(key) {
  const traveler = document.getElementById(`${key}-mf-traveler`).value.trim();
  const peopleN  = parseInt(document.getElementById(`${key}-mf-people`).value) || 0;
  const tour     = document.getElementById(`${key}-mf-tour`).value.trim();
  const date     = document.getElementById(`${key}-mf-date`).value.trim();
  const hotelIdx = document.getElementById(`${key}-mf-hotel`).value;
  const location = document.getElementById(`${key}-mf-location`).value.trim();
  const time     = document.getElementById(`${key}-mf-time`).value.trim();
  const amount   = document.getElementById(`${key}-mf-amount`).value.trim();
  const phone    = document.getElementById(`${key}-mf-phone`).value.trim();

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

  _state[key].bookingData = data;
  _state[key].hotelMatch  = hotel;

  // Sync supplementary fields with manual data
  document.getElementById(`${key}-sf-phone`).value   = phone;
  document.getElementById(`${key}-sf-tour`).value    = tour;
  document.getElementById(`${key}-sf-meeting`).value = hotel ? hotel.meetingPoint : location;
  document.getElementById(`${key}-sf-area`).value    = hotel ? hotel.zone : '';
  document.getElementById(`${key}-sf-hotel`).value   = hotel ? hotel.idx : '';

  hideHotelBanner(key);
  if (hotel) showHotelBanner(key, hotel);

  renderTicket(key, data);
  refreshMessages(key);

  document.getElementById(`${key}-ticket-placeholder`).classList.add('hidden');
  document.getElementById(`${key}-output-container`).classList.remove('hidden');
  const page = document.getElementById('page-' + key);
  page.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  page.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
  document.getElementById(`${key}-tab-ticket`).classList.remove('hidden');
  page.querySelector('.tab').classList.add('active');

  saveToHistory(key);
}

function clearAll(key) {
  _state[key].bookingData = null;
  _state[key].hotelMatch  = null;
  document.getElementById(`${key}-booking-input`).value = '';
  document.getElementById(`${key}-ticket-placeholder`).classList.remove('hidden');
  document.getElementById(`${key}-output-container`).classList.add('hidden');
  document.getElementById(`${key}-ticket`).innerHTML = '';
  document.getElementById(`${key}-driver-msg`).value = '';
  document.getElementById(`${key}-client-msg`).value = '';
  ['sf-tour','sf-time','sf-meeting','sf-area','sf-phone','sf-hotel'].forEach(id => {
    const el = document.getElementById(`${key}-${id}`); if (el) el.value = '';
  });
  clearManualForm(key);
  const page = document.getElementById('page-' + key);
  page.querySelectorAll('.input-mode').forEach(el => el.classList.add('hidden'));
  document.getElementById(`${key}-mode-paste`).classList.remove('hidden');
  page.querySelectorAll('.mode-tab').forEach(el => el.classList.remove('active'));
  page.querySelector('.mode-tab').classList.add('active');
  hideHotelBanner(key);
}

// ── Navigation (sidebar pages) ─────────────────

function switchSection(name, btn, placeholderTitle) {
  document.querySelectorAll('.page').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.sb-item').forEach(el => el.classList.remove('active'));
  document.getElementById('page-' + name).classList.remove('hidden');
  if (btn) btn.classList.add('active');

  if (name === 'overview')  renderOverview();
  if (name === 'historial') renderHistorial();
  if (name === 'placeholder') {
    document.getElementById('placeholder-title').textContent = placeholderTitle || 'Sección';
  }
}

// ── History store (localStorage) ───────────────

const HISTORY_KEY = 'jac_booking_history';
const HISTORY_MAX = 200;

function getHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function setHistory(list) {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(list)); } catch (e) {}
}

function saveToHistory(key) {
  const st = _state[key];
  if (!st.bookingData) return;
  const supp = getSupp(key);
  supp.time = (document.getElementById(`${key}-sf-time`)?.value || '').trim();

  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    page: key,
    data: st.bookingData,
    hotelMatch: st.hotelMatch,
    supp
  };

  const list = getHistory();
  list.unshift(entry);
  if (list.length > HISTORY_MAX) list.length = HISTORY_MAX;
  setHistory(list);

  renderOverview();
  if (!document.getElementById('page-historial').classList.contains('hidden')) renderHistorial();
}

function deleteHistoryEntry(id) {
  setHistory(getHistory().filter(e => e.id !== id));
  renderHistorial(document.getElementById('historial-search')?.value || '');
  renderOverview();
}

function clearHistoryPrompt() {
  if (!confirm('¿Eliminar todo el historial de reservas? Esta acción no se puede deshacer.')) return;
  setHistory([]);
  renderHistorial();
  renderOverview();
  showToast('✓ Historial eliminado');
}

function loadHistoryEntry(id) {
  const entry = getHistory().find(e => e.id === id);
  if (!entry) return;

  // Older entries (saved before the GYG/Viator split) don't carry a `page` —
  // fall back to the platform that generated them.
  const key = entry.page || (entry.data?.platform === 'Viator' ? 'viator' : 'gyg');

  _state[key].bookingData = entry.data;
  _state[key].hotelMatch  = entry.hotelMatch;

  switchSection(key, document.querySelector(`[data-page="${key}"]`));

  const supp = entry.supp || {};
  document.getElementById(`${key}-sf-phone`).value   = supp.phone        || '';
  document.getElementById(`${key}-sf-tour`).value    = supp.tourShort    || '';
  document.getElementById(`${key}-sf-meeting`).value = supp.meetingPoint || '';
  document.getElementById(`${key}-sf-area`).value    = supp.area         || '';
  document.getElementById(`${key}-sf-time`).value    = supp.time         || '';
  document.getElementById(`${key}-sf-hotel`).value   = (entry.hotelMatch && typeof entry.hotelMatch.idx !== 'undefined') ? entry.hotelMatch.idx : '';

  hideHotelBanner(key);
  if (entry.hotelMatch) showHotelBanner(key, entry.hotelMatch);

  renderTicket(key, entry.data);
  refreshMessages(key);

  document.getElementById(`${key}-ticket-placeholder`).classList.add('hidden');
  document.getElementById(`${key}-output-container`).classList.remove('hidden');
  const page = document.getElementById('page-' + key);
  page.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  page.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
  document.getElementById(`${key}-tab-ticket`).classList.remove('hidden');
  page.querySelector('.tab').classList.add('active');

  showToast('✓ Reserva cargada desde el historial');
}

// ── Overview / stats ───────────────────────────

function platformBadge(platform) {
  const p = (platform || '').toLowerCase();
  const cls = p.includes('getyourguide') || p === 'gyg' ? 'gyg'
            : p.includes('viator')                       ? 'viator'
            : 'unknown';
  return `<span class="detected ${cls}">${escHtml(platform || '—')}</span>`;
}

function startOfDay(d) { const x = new Date(d); x.setHours(0,0,0,0); return x; }

function renderOverview() {
  const list = getHistory();
  const now  = new Date();
  const today0 = startOfDay(now);
  const weekAgo = new Date(today0); weekAgo.setDate(weekAgo.getDate() - 6);

  const todayCount = list.filter(e => startOfDay(e.createdAt).getTime() === today0.getTime()).length;
  const weekCount  = list.filter(e => new Date(e.createdAt) >= weekAgo).length;
  const totalCount = list.length;

  const counts = { gyg: 0, viator: 0, manual: 0 };
  list.forEach(e => {
    const p = (e.data?.platform || '').toLowerCase();
    if (p.includes('getyourguide') || p === 'gyg') counts.gyg++;
    else if (p.includes('viator')) counts.viator++;
    else counts.manual++;
  });

  document.getElementById('stat-today').textContent = todayCount;
  document.getElementById('stat-today-sub').textContent = todayCount > 0 ? `${todayCount} generadas hoy` : 'Sin reservas hoy';
  document.getElementById('stat-week').textContent = weekCount;
  document.getElementById('stat-week-sub').textContent = `Últimos 7 días`;
  document.getElementById('stat-total').textContent = totalCount;
  document.getElementById('stat-total-sub').textContent = totalCount > 0 ? 'Desde que empezaste a usar el sistema' : 'Aún no hay reservas';
  document.getElementById('stat-platform').textContent = `${counts.gyg}/${counts.viator}/${counts.manual}`;

  document.getElementById('overview-updated').textContent = `Actualizado: ${now.toLocaleString('es-DO')}`;

  const body = document.getElementById('overview-recent-body');
  const empty = document.getElementById('overview-recent-empty');
  const recent = list.slice(0, 5);
  if (recent.length === 0) {
    body.innerHTML = '';
    empty.classList.remove('hidden');
  } else {
    empty.classList.add('hidden');
    body.innerHTML = recent.map(e => `
      <tr>
        <td>${platformBadge(e.data?.platform)}</td>
        <td class="ht-name">${escHtml(e.data?.leadTraveler || '—')}</td>
        <td>${escHtml(e.supp?.tourShort || e.data?.product || '—')}</td>
        <td>${escHtml(shortDate(e.data?.tourDate) || e.data?.tourDate || '—')}</td>
        <td>${new Date(e.createdAt).toLocaleString('es-DO')}</td>
      </tr>`).join('');
  }

  renderActivity(list);
}

function renderActivity(list) {
  const wrap  = document.getElementById('activity-list');
  const empty = document.getElementById('activity-empty');
  if (!wrap) return;
  const items = (list || getHistory()).slice(0, 6);
  if (items.length === 0) {
    wrap.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');
  wrap.innerHTML = items.map(e => `
    <div class="activity-item">
      <div class="ai-name">${escHtml(e.data?.leadTraveler || '—')} · ${escHtml(e.supp?.tourShort || e.data?.product || 'Tour')}</div>
      <div class="ai-meta">${platformBadge(e.data?.platform)} ${new Date(e.createdAt).toLocaleString('es-DO')}</div>
    </div>`).join('');
}

// ── Historial page ──────────────────────────────

function renderHistorial(filter) {
  const list = getHistory();
  const q = (filter || document.getElementById('historial-search')?.value || '').trim().toLowerCase();

  const filtered = q
    ? list.filter(e => {
        const traveler = (e.data?.leadTraveler || '').toLowerCase();
        const tour     = (e.supp?.tourShort || e.data?.product || '').toLowerCase();
        return traveler.includes(q) || tour.includes(q);
      })
    : list;

  document.getElementById('historial-count').textContent = `${list.length} reserva${list.length === 1 ? '' : 's'} guardada${list.length === 1 ? '' : 's'}`;

  const body  = document.getElementById('historial-body');
  const empty = document.getElementById('historial-empty');

  if (filtered.length === 0) {
    body.innerHTML = '';
    empty.classList.remove('hidden');
    empty.textContent = q ? 'No se encontraron reservas que coincidan con la búsqueda.' : 'No hay reservas en el historial todavía.';
    return;
  }
  empty.classList.add('hidden');

  body.innerHTML = filtered.map(e => `
    <tr>
      <td>${platformBadge(e.data?.platform)}</td>
      <td class="ht-name">${escHtml(e.data?.leadTraveler || '—')}</td>
      <td>${escHtml(e.supp?.tourShort || e.data?.product || '—')}</td>
      <td>${escHtml(shortDate(e.data?.tourDate) || e.data?.tourDate || '—')}</td>
      <td>${escHtml((e.hotelMatch && e.hotelMatch.name) || e.data?.hotelPickup || '—')}</td>
      <td>${new Date(e.createdAt).toLocaleString('es-DO')}</td>
      <td class="history-actions">
        <button class="ht-btn" onclick="loadHistoryEntry('${e.id}')">Ver</button>
        <button class="ht-btn danger" onclick="deleteHistoryEntry('${e.id}')">Eliminar</button>
      </td>
    </tr>`).join('');
}

// ── Clock widget (right panel) ─────────────────

function renderClock() {
  const dayEl  = document.getElementById('clock-day');
  const timeEl = document.getElementById('clock-time');
  if (!dayEl || !timeEl) return;

  const now = new Date();
  const tz = 'America/Santo_Domingo';
  dayEl.textContent  = new Intl.DateTimeFormat('es-DO', { weekday: 'long', day: 'numeric', month: 'long', timeZone: tz }).format(now);
  timeEl.textContent = new Intl.DateTimeFormat('es-DO', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: tz }).format(now);
}

// ── Copy / Print ──────────────────────────────

function printTicket() { window.print(); }

function copyTicketText(key) {
  const txt = (document.getElementById(`${key}-ticket`)?.innerText || '').replace(/\n{3,}/g, '\n\n');
  navigator.clipboard.writeText(txt)
    .then(() => showToast('✓ Ticket copiado'))
    .catch(() => showToast('⚠ No se pudo copiar'));
}

// ── Download (PNG / PDF) ──────────────────────

function ticketFileName(key, ext) {
  const name = (_state[key].bookingData?.leadTraveler || 'ticket').trim().replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '');
  return `JAC_Ticket_${name || 'reserva'}.${ext}`;
}

function captureTicketCanvas(key) {
  const card = document.querySelector(`#${key}-ticket .ticket-card`);
  if (!card) { showToast('⚠ No hay ticket para descargar.'); return null; }
  return html2canvas(card, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
}

function downloadTicketPNG(key) {
  const capture = captureTicketCanvas(key);
  if (!capture) return;
  capture.then(canvas => {
    const link = document.createElement('a');
    link.download = ticketFileName(key, 'png');
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('✓ Imagen descargada');
  }).catch(() => showToast('⚠ No se pudo generar la imagen'));
}

function downloadTicketPDF(key) {
  const capture = captureTicketCanvas(key);
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
    pdf.save(ticketFileName(key, 'pdf'));
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
