document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;

  // ---- Theme Toggle (Day/Night) ----
  const themeToggle = document.getElementById('themeToggle');
  if (localStorage.getItem('theme') === 'dark') root.classList.add('dark');
  themeToggle.addEventListener('click', () => {
    root.classList.toggle('dark');
    localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light');
  });

  // ---- PDP Gallery Lightbox ----
  const galleryCells = document.querySelectorAll('.gallery-cell');
  
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  
  let currentImageIndex = 0;
  const imageSources = Array.from(galleryCells).map(cell => cell.querySelector('img').src);
  
  // Open Lightbox
  galleryCells.forEach((cell) => {
    cell.addEventListener('click', () => {
      currentImageIndex = parseInt(cell.getAttribute('data-index'), 10);
      lightboxImage.src = imageSources[currentImageIndex];
      lightboxOverlay.classList.add('show');
      lightboxOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  // Lightbox Navigation
  function showLightboxImage(index) {
    if (index < 0) index = imageSources.length - 1;
    if (index >= imageSources.length) index = 0;
    currentImageIndex = index;
    lightboxImage.src = imageSources[currentImageIndex];
  }

  lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    showLightboxImage(currentImageIndex - 1);
  });

  lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    showLightboxImage(currentImageIndex + 1);
  });

  // Close Lightbox
  function closeLightbox() {
    lightboxOverlay.classList.remove('show');
    lightboxOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightboxOverlay.classList.contains('show')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightboxImage(currentImageIndex - 1);
    if (e.key === 'ArrowRight') showLightboxImage(currentImageIndex + 1);
  });

  // ---- Size Dropdown ----
  const sizeDropdown = document.getElementById('sizeDropdown');
  const sizeMenu = document.getElementById('sizeMenu');
  const szValue = sizeDropdown.querySelector('.sz-value');
  const sizeOpts = document.querySelectorAll('.sz-opt');
  let currentSize = null;

  sizeDropdown.addEventListener('click', () => {
    sizeMenu.classList.toggle('show');
  });

  sizeOpts.forEach(opt => {
    opt.addEventListener('click', () => {
      currentSize = opt.dataset.size;
      // Update button text but keep the chevron
      szValue.innerHTML = `US ${currentSize} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>`;
      sizeMenu.classList.remove('show');
      ctaMsg.classList.remove('show'); // clear any errors
    });
  });

  // Close menu if clicking outside
  document.addEventListener('click', (e) => {
    if(!sizeDropdown.contains(e.target) && !sizeMenu.contains(e.target)) {
      sizeMenu.classList.remove('show');
    }
  });

  // ---- Accordions ----
  const accordions = document.querySelectorAll('.accordion-header');
  accordions.forEach(acc => {
    acc.addEventListener('click', () => {
      const parent = acc.parentElement;
      const content = parent.querySelector('.accordion-content');
      
      if (parent.classList.contains('active')) {
        parent.classList.remove('active');
        content.style.maxHeight = null;
      } else {
        parent.classList.add('active');
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });

  // ---- Buy / Bid Toggle Logic ----
  const btnBuyNow = document.getElementById('btnBuyNow');
  const btnPlaceBid = document.getElementById('btnPlaceBid');
  const stateBuy = document.getElementById('stateBuy');
  const stateBid = document.getElementById('stateBid');
  
  const bidInput = document.getElementById('bidInput');
  const bidError = document.getElementById('bidError');
  const ctaMsg = document.getElementById('ctaMsg');

  let currentMode = 'buy';

  function validateBid() {
    const val = parseInt(bidInput.value, 10);
    if (isNaN(val) || val < 180) {
      if (!isNaN(val)) bidError.classList.add('show');
      else bidError.classList.remove('show');
      return false;
    }
    bidError.classList.remove('show');
    return true;
  }

  function setMode(mode) {
    currentMode = mode;
    ctaMsg.classList.remove('show');

    if (mode === 'buy') {
      root.style.setProperty('--accent-current', 'var(--accent-buy)');
      
      btnBuyNow.classList.add('filled');
      btnBuyNow.classList.remove('outline');
      btnPlaceBid.classList.add('outline');
      btnPlaceBid.classList.remove('filled');
      
      stateBuy.classList.add('active');
      stateBid.classList.remove('active');
      
    } else {
      root.style.setProperty('--accent-current', 'var(--accent-bid)');
      
      btnPlaceBid.classList.add('filled');
      btnPlaceBid.classList.remove('outline');
      btnBuyNow.classList.add('outline');
      btnBuyNow.classList.remove('filled');
      
      stateBid.classList.add('active');
      stateBuy.classList.remove('active');
    }
  }

  btnBuyNow.addEventListener('click', () => {
    if (currentMode !== 'buy') {
      setMode('buy');
    } else {
      if(!currentSize) { ctaMsg.textContent = 'Please select a size.'; ctaMsg.classList.add('show'); return; }
      ctaMsg.textContent = `Processing Buy Order for Size ${currentSize}...`;
      ctaMsg.classList.add('show');
    }
  });

  btnPlaceBid.addEventListener('click', () => {
    if (currentMode !== 'bid') {
      setMode('bid');
    } else {
      if(!currentSize) { ctaMsg.textContent = 'Please select a size.'; ctaMsg.classList.add('show'); return; }
      if(!validateBid()) return;
      ctaMsg.textContent = `Placing $${bidInput.value} Bid for Size ${currentSize}...`;
      ctaMsg.classList.add('show');
    }
  });

  bidInput.addEventListener('input', validateBid);

  // ---- Sparkline Chart ----
  const pathArea = document.getElementById('sparkArea');
  const pathLine = document.getElementById('sparkLine');
  const marker = document.getElementById('sparkMarker');
  const markerLabel = document.getElementById('sparkLabel');
  const hoverLine = document.getElementById('sparkHoverLine');
  const overlay = document.getElementById('sparkOverlay');
  const phTabs = document.querySelectorAll('.ph-tab');

  const masterDates = ['Mar 14','Mar 21','Mar 28','Apr 4','Apr 11','Apr 18','Apr 25', 'May 2','May 9','May 16','May 23','May 30','Jun 6','Jun 13','Jun 21'];
  const masterPrices = [462, 410, 385, 360, 340, 318, 300, 285, 270, 258, 250, 244, 238, 229, 238];

  let currentCurveData = [];
  const w = 1000, h = 200, padTop = 30, padBot = 20;
  const usableH = h - padTop - padBot;

  function getCurve(pts) {
    if(pts.length === 0) return '';
    if(pts.length === 1) return `M ${pts[0].x},${pts[0].y}`;
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i === 0 ? pts[0] : pts[i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i + 2 < pts.length ? pts[i + 2] : p2;
      const tension = 0.2;
      const cp1x = p1.x + (p2.x - p0.x) * tension;
      const cp1y = p1.y + (p2.y - p0.y) * tension;
      const cp2x = p2.x - (p3.x - p1.x) * tension;
      const cp2y = p2.y - (p3.y - p1.y) * tension;
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return d;
  }

  function drawChart(rangeKey) {
    let sliceVals, sliceDates;
    if (rangeKey === '1m') {
      sliceVals = masterPrices.slice(-5);
      sliceDates = masterDates.slice(-5);
    } else if (rangeKey === '3m') {
      sliceVals = masterPrices.slice(-14); // wait, array has 15 items. last 14 is index 1 to 14
      sliceDates = masterDates.slice(-14);
    } else {
      sliceVals = masterPrices;
      sliceDates = masterDates;
    }

    const sMin = Math.min(...sliceVals);
    const sMax = Math.max(...sliceVals);
    const diff = sMax - sMin || 1;
    const pad = diff * 0.15;
    
    let step, minV, maxV;
    if (rangeKey === '1m') {
      step = 25;
      minV = Math.floor((sMin - pad) / step) * step;
      maxV = Math.ceil((sMax + pad) / step) * step;
    } else {
      step = 150;
      minV = 0;
      maxV = Math.ceil((sMax + pad) / step) * step;
    }
    
    // Dynamic Y-axis
    const yAxisEl = document.querySelector('.y-axis');
    let yHTML = '';
    for (let v = maxV; v >= minV; v -= step) {
      const label = v >= 1000 ? `$${v/1000}K` : `$${v}`;
      yHTML += `<div class="y-axis-line"><span>${label}</span></div>`;
    }
    yAxisEl.innerHTML = yHTML;

    // Dynamic X-axis
    const xAxisEl = document.getElementById('xAxis');
    let xHTML = '';
    const numDates = sliceDates.length;
    const numLabels = Math.min(5, numDates);
    for (let i = 0; i < numLabels; i++) {
      const idx = Math.floor(i * (numDates - 1) / (numLabels - 1));
      xHTML += `<span>${sliceDates[idx]}</span>`;
    }
    xAxisEl.innerHTML = xHTML;

    const rangeV = maxV - minV || 1;
    const stepX = w / (sliceVals.length - 1);
    
    currentCurveData = sliceVals.map((v, i) => {
      return {
        x: i * stepX,
        y: h - padBot - ((v - minV) / rangeV) * usableH,
        val: v,
        date: sliceDates[i] || ''
      };
    });

    const curveD = getCurve(currentCurveData);
    pathLine.setAttribute('d', curveD);
    pathArea.setAttribute('d', curveD + ` L ${w},${h} L 0,${h} Z`);
    
    snapToPoint(currentCurveData.length - 1);
    hoverLine.style.opacity = '0'; 
  }

  function snapToPoint(idx) {
    const pt = currentCurveData[idx];
    if (!pt) return;
    
    marker.style.left = `${(pt.x / w) * 100}%`;
    marker.style.top = `${(pt.y / h) * 100}%`;
    markerLabel.innerHTML = `${pt.date}<br/><strong>$${pt.val}</strong>`;
    hoverLine.style.left = `${(pt.x / w) * 100}%`;
  }

  phTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      phTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      drawChart(tab.dataset.range);
    });
  });

  overlay.addEventListener('mousemove', (e) => {
    const rect = overlay.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    const svgX = ratio * w;
    
    let closestIdx = 0;
    let minDiff = Infinity;
    currentCurveData.forEach((pt, i) => {
      const diff = Math.abs(pt.x - svgX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = i;
      }
    });
    
    snapToPoint(closestIdx);
    hoverLine.style.opacity = '1';
    
    if (ratio > 0.85) {
      markerLabel.style.transform = 'translateX(-100%)';
      markerLabel.style.left = '-10px';
    } else if (ratio < 0.15) {
      markerLabel.style.transform = 'translateX(0%)';
      markerLabel.style.left = '10px';
    } else {
      markerLabel.style.transform = 'translateX(-50%)';
      markerLabel.style.left = '50%';
    }
  });

  overlay.addEventListener('mouseleave', () => {
    hoverLine.style.opacity = '0';
    snapToPoint(currentCurveData.length - 1);
    markerLabel.style.transform = 'translateX(-100%)'; 
    markerLabel.style.left = '-10px';
  });

  // Initialize
  setMode('buy');
  drawChart('6m');
  markerLabel.style.transform = 'translateX(-100%)'; 
  markerLabel.style.left = '-10px';
});
