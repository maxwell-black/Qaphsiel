// numogram.js — interactive CCRU numogram renderer
// Six relation types, ten zones, rendered dynamically per query.
// Zone positions are laptop-visible (520x560 viewBox).

const ZONE_POSITIONS = {
  6: { x: 185, y: 80  },
  3: { x: 335, y: 80  },
  8: { x: 175, y: 180 },
  1: { x: 345, y: 180 },
  7: { x: 160, y: 265 },
  2: { x: 360, y: 265 },
  5: { x: 180, y: 350 },
  4: { x: 340, y: 350 },
  9: { x: 195, y: 440 },
  0: { x: 325, y: 440 }
};

// Relations per zone. Each zone lists its relationships from that zone's perspective.
// Currents and gates appear twice (once as outbound on source, once as inbound on target) — intentional.
const RELATIONS = {
  0: [
    { type: 'syzygy',        with: 9 },
    { type: 'current',       direction: 'inbound', from: 9 },
    { type: 'self-loop',     gate: '00' }
  ],
  1: [
    { type: 'syzygy',        with: 8 },
    { type: 'next-in-cycle', to: 2 },
    { type: 'self-loop',     gate: '01' },
    { type: 'inbound-gate',  from: 4, gate: '10' },
    { type: 'inbound-gate',  from: 7, gate: '28' }
  ],
  2: [
    { type: 'syzygy',        with: 7 },
    { type: 'next-in-cycle', to: 4 },
    { type: 'outbound-gate', to: 3, gate: '03' }
  ],
  3: [
    { type: 'syzygy',        with: 6 },
    { type: 'current',       direction: 'inbound', from: 6 },
    { type: 'outbound-gate', to: 6, gate: '06' },
    { type: 'inbound-gate',  from: 2, gate: '03' },
    { type: 'inbound-gate',  from: 6, gate: '21' }
  ],
  4: [
    { type: 'syzygy',        with: 5 },
    { type: 'next-in-cycle', to: 8 },
    { type: 'outbound-gate', to: 1, gate: '10' }
  ],
  5: [
    { type: 'syzygy',        with: 4 },
    { type: 'current',       direction: 'outbound', to: 4 },
    { type: 'next-in-cycle', to: 1 },
    { type: 'outbound-gate', to: 6, gate: '15' }
  ],
  6: [
    { type: 'syzygy',        with: 3 },
    { type: 'current',       direction: 'outbound', to: 3 },
    { type: 'outbound-gate', to: 3, gate: '21' },
    { type: 'inbound-gate',  from: 3, gate: '06' },
    { type: 'inbound-gate',  from: 5, gate: '15' }
  ],
  7: [
    { type: 'syzygy',        with: 2 },
    { type: 'current',       direction: 'outbound', to: 2 },
    { type: 'next-in-cycle', to: 5 },
    { type: 'outbound-gate', to: 1, gate: '28' }
  ],
  8: [
    { type: 'syzygy',        with: 1 },
    { type: 'current',       direction: 'outbound', to: 1 },
    { type: 'next-in-cycle', to: 7 },
    { type: 'outbound-gate', to: 9, gate: '36' }
  ],
  9: [
    { type: 'syzygy',        with: 0 },
    { type: 'current',       direction: 'outbound', to: 0 },
    { type: 'self-loop',     gate: '45' },
    { type: 'inbound-gate',  from: 8, gate: '36' }
  ]
};

const SVG_NS = 'http://www.w3.org/2000/svg';

function el(tag, attrs) {
  const e = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  return e;
}

// Perpendicular offset point from chord midpoint.
// Positive offset bows one way, negative the other.
function offsetPoint(ax, ay, bx, by, offset) {
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.sqrt(dx*dx + dy*dy) || 1;
  const px = -dy / len;
  const py = dx / len;
  return { x: mx + px * offset, y: my + py * offset };
}

// Clamp offset proportional to chord length to prevent wild arcs on long chords.
function clampOffset(ax, ay, bx, by, desiredOffset) {
  const len = Math.sqrt((bx-ax)*(bx-ax) + (by-ay)*(by-ay)) || 1;
  const maxOffset = len * 0.3;
  const sign = desiredOffset >= 0 ? 1 : -1;
  return sign * Math.min(Math.abs(desiredOffset), maxOffset);
}

// Center-to-center quadratic arc. Zone circles drawn on top occlude interior segments.
function arcPath(ax, ay, bx, by, offset) {
  const clamped = clampOffset(ax, ay, bx, by, offset);
  const ctrl = offsetPoint(ax, ay, bx, by, clamped);
  return `M ${ax} ${ay} Q ${ctrl.x} ${ctrl.y} ${bx} ${by}`;
}

// SIX RELATION TYPES — drawing functions

function drawSyzygy(svg, a, b) {
  const pa = ZONE_POSITIONS[a], pb = ZONE_POSITIONS[b];
  svg.appendChild(el('path', {
    d: arcPath(pa.x, pa.y, pb.x, pb.y, -12),
    stroke: '#00ff66', 'stroke-width': 1, fill: 'none',
    class: 'rel rel-syzygy'
  }));
}

function drawCurrent(svg, from, to) {
  const pa = ZONE_POSITIONS[from], pb = ZONE_POSITIONS[to];
  svg.appendChild(el('path', {
    d: arcPath(pa.x, pa.y, pb.x, pb.y, 28),
    stroke: '#00ff66', 'stroke-width': 3.5, fill: 'none',
    'marker-end': 'url(#ar-current)',
    class: 'rel rel-current'
  }));
}

function drawOutboundGate(svg, from, to) {
  const pa = ZONE_POSITIONS[from], pb = ZONE_POSITIONS[to];
  svg.appendChild(el('path', {
    d: arcPath(pa.x, pa.y, pb.x, pb.y, 50),
    stroke: '#00ff66', 'stroke-width': 1.2, fill: 'none',
    'stroke-dasharray': '8 4', 'marker-end': 'url(#ar)',
    class: 'rel rel-outbound-gate'
  }));
}

function drawInboundGate(svg, from, to, stackIdx) {
  const pa = ZONE_POSITIONS[from], pb = ZONE_POSITIONS[to];
  const offset = -50 - (stackIdx * 20);
  svg.appendChild(el('path', {
    d: arcPath(pa.x, pa.y, pb.x, pb.y, offset),
    stroke: '#00ff66', 'stroke-width': 1.2, fill: 'none',
    'stroke-dasharray': '2 4', 'marker-end': 'url(#ar)',
    class: 'rel rel-inbound-gate'
  }));
}

function drawNextInCycle(svg, from, to) {
  const pa = ZONE_POSITIONS[from], pb = ZONE_POSITIONS[to];
  const dx = pb.x - pa.x, dy = pb.y - pa.y;
  const len = Math.sqrt(dx*dx + dy*dy) || 1;
  const px = -dy / len, py = dx / len;
  const o = 2;
  // Two parallel lines center-to-center
  svg.appendChild(el('line', {
    x1: pa.x + px * o, y1: pa.y + py * o,
    x2: pb.x + px * o, y2: pb.y + py * o,
    stroke: '#00ff66', 'stroke-width': 1,
    class: 'rel rel-cycle'
  }));
  svg.appendChild(el('line', {
    x1: pa.x - px * o, y1: pa.y - py * o,
    x2: pb.x - px * o, y2: pb.y - py * o,
    stroke: '#00ff66', 'stroke-width': 1,
    'marker-end': 'url(#ar-sm)',
    class: 'rel rel-cycle'
  }));
}

function drawSelfLoop(svg, zone, side) {
  const p = ZONE_POSITIONS[zone];
  const r = 22;
  // side: 'upper-right' or 'upper-left' based on crowding
  let d;
  if (side === 'upper-left') {
    const sx = p.x - r * 0.7, sy = p.y - r * 0.7;
    const ex = p.x - r * 0.9, ey = p.y - r * 0.2;
    d = `M ${sx} ${sy} Q ${p.x - r * 1.9} ${p.y - r * 1.6} ${p.x - r * 1.9} ${p.y - r * 0.3} Q ${p.x - r * 1.9} ${p.y + r * 0.3} ${ex} ${ey}`;
  } else {
    const sx = p.x + r * 0.7, sy = p.y - r * 0.7;
    const ex = p.x + r * 0.9, ey = p.y - r * 0.2;
    d = `M ${sx} ${sy} Q ${p.x + r * 1.9} ${p.y - r * 1.6} ${p.x + r * 1.9} ${p.y - r * 0.3} Q ${p.x + r * 1.9} ${p.y + r * 0.3} ${ex} ${ey}`;
  }
  svg.appendChild(el('path', {
    d: d, stroke: '#00ff66', 'stroke-width': 1.2, fill: 'none',
    'stroke-dasharray': '8 4', 'marker-end': 'url(#ar)',
    class: 'rel rel-self-loop'
  }));
}

// Compute participants: zones that appear in the queried zone's relations
function getParticipants(zoneNum) {
  const participants = new Set();
  const rels = RELATIONS[zoneNum] || [];
  for (const r of rels) {
    if (r.with !== undefined) participants.add(r.with);
    if (r.to !== undefined) participants.add(r.to);
    if (r.from !== undefined) participants.add(r.from);
  }
  return participants;
}

// Pick self-loop side to avoid crowding from other relations
function pickSelfLoopSide(zone, relations) {
  const zonePos = ZONE_POSITIONS[zone];
  let leftCount = 0, rightCount = 0;
  for (const r of relations) {
    if (r.type === 'self-loop') continue;
    const other = r.to ?? r.from ?? r.with;
    if (other === undefined) continue;
    const otherPos = ZONE_POSITIONS[other];
    if (otherPos.x < zonePos.x) leftCount++;
    else rightCount++;
  }
  return leftCount <= rightCount ? 'upper-left' : 'upper-right';
}

// Draw all zones with three-tier styling
function drawZones(svg, queriedZone, participants) {
  for (let i = 0; i <= 9; i++) {
    const p = ZONE_POSITIONS[i];
    const isActive = (i === queriedZone);
    const isParticipant = participants.has(i);

    let r, fill, strokeColor, strokeWidth, dashArray, textColor, textSize, textWeight;

    if (isActive) {
      r = 22; fill = '#00ff66'; strokeColor = '#00ff66'; strokeWidth = 1.5;
      dashArray = null; textColor = '#000000'; textSize = 17; textWeight = 'bold';
    } else if (isParticipant) {
      r = 20; fill = '#0a0a0a'; strokeColor = '#00ff66'; strokeWidth = 1.5;
      dashArray = '3 2'; textColor = '#00ff66'; textSize = 16; textWeight = 'bold';
    } else {
      r = 18; fill = '#0a0a0a'; strokeColor = '#006633'; strokeWidth = 1;
      dashArray = null; textColor = '#006633'; textSize = 15; textWeight = 'normal';
    }

    const attrs = {
      cx: p.x, cy: p.y, r: r, fill: fill,
      stroke: strokeColor, 'stroke-width': strokeWidth,
      class: `zone zone-${i}`,
      id: `zone-${i}`,
      style: 'cursor: pointer;'
    };
    if (dashArray) attrs['stroke-dasharray'] = dashArray;
    const circle = el('circle', attrs);
    circle.addEventListener('click', () => renderZone(i));
    svg.appendChild(circle);

    const text = el('text', {
      x: p.x, y: p.y + textSize * 0.35,
      'text-anchor': 'middle', 'font-size': textSize,
      fill: textColor, 'font-family': "'Courier New', ui-monospace, monospace",
      'font-weight': textWeight, 'pointer-events': 'none'
    });
    text.textContent = i.toString();
    svg.appendChild(text);
  }
}

// Master render function
function renderZone(zoneNum) {
  const svg = document.getElementById('numogram-svg');
  if (!svg) return;

  // Clear existing dynamic content
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  // Add defs with markers
  const defs = el('defs', {});
  defs.innerHTML = `
    <marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto">
      <polygon points="0,0 10,5 0,10" fill="none" stroke="#00ff66" stroke-width="1.2"/>
    </marker>
    <marker id="ar-sm" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="3.5" markerHeight="3.5" orient="auto">
      <polygon points="0,0 10,5 0,10" fill="none" stroke="#00ff66" stroke-width="1.2"/>
    </marker>
    <marker id="ar-current" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
      <polygon points="0,0 10,5 0,10" fill="#00ff66"/>
    </marker>
  `;
  svg.appendChild(defs);

  const participants = getParticipants(zoneNum);
  const rels = RELATIONS[zoneNum] || [];

  // Draw relation lines first (so zones render on top)
  let inboundGateIdx = 0;
  const selfLoopSide = pickSelfLoopSide(zoneNum, rels);

  for (const r of rels) {
    switch (r.type) {
      case 'syzygy':
        drawSyzygy(svg, zoneNum, r.with);
        break;
      case 'current':
        if (r.direction === 'outbound') {
          drawCurrent(svg, zoneNum, r.to);
        } else {
          drawCurrent(svg, r.from, zoneNum);
        }
        break;
      case 'outbound-gate':
        drawOutboundGate(svg, zoneNum, r.to);
        break;
      case 'inbound-gate':
        drawInboundGate(svg, r.from, zoneNum, inboundGateIdx);
        inboundGateIdx++;
        break;
      case 'next-in-cycle':
        drawNextInCycle(svg, zoneNum, r.to);
        break;
      case 'self-loop':
        drawSelfLoop(svg, zoneNum, selfLoopSide);
        break;
    }
  }

  // Draw zones on top (opaque fills occlude interior line segments)
  drawZones(svg, zoneNum, participants);
}

// Expose for app.js to use
if (typeof window !== 'undefined') {
  window.renderZone = renderZone;
  window.getParticipants = getParticipants;
}
