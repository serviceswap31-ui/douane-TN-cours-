// ============================================================
// DOUANE v2 — APP + CHART RENDERING
// ============================================================

let currentPage = 'home';
let doneChapters = JSON.parse(localStorage.getItem('douane_done') || '[]');

// Chart color palette
const CHART_COLORS = {
  gold: 'rgba(245,200,66,0.85)',
  blue: 'rgba(59,130,246,0.85)',
  green: 'rgba(16,185,129,0.85)',
  red: 'rgba(239,68,68,0.85)',
  purple: 'rgba(139,92,246,0.85)',
  teal: 'rgba(20,184,166,0.85)',
  orange: 'rgba(249,115,22,0.85)',
  pink: 'rgba(236,72,153,0.85)',
  indigo: 'rgba(99,102,241,0.85)',
  cyan: 'rgba(6,182,212,0.85)',
};

const CHART_DEFAULTS = {
  color: '#94a3b8',
  borderColor: '#1e2e50',
  plugins: {
    legend: {
      labels: { color: '#94a3b8', font: { family: 'Cairo', size: 11 }, padding: 14 }
    },
    tooltip: {
      backgroundColor: '#111d35',
      borderColor: '#1e2e50',
      borderWidth: 1,
      titleColor: '#f5c842',
      bodyColor: '#e2e8f0',
      titleFont: { family: 'Cairo', size: 12 },
      bodyFont: { family: 'Cairo', size: 11 },
    }
  }
};

Chart.defaults.color = '#94a3b8';
Chart.defaults.borderColor = '#1e2e50';

// ---- CHART REGISTRY ----
const CHART_RENDERERS = {
  'chart-revenues': () => new Chart(document.getElementById('chart-revenues'), {
    type: 'doughnut',
    data: {
      labels: ['ضرائب مباشرة (IRPP+IS)', 'TVA وضرائب غير مباشرة', 'معاليم جمركية', 'مداخيل مؤسسات الدولة', 'قروض وتمويلات'],
      datasets: [{ data: [28, 35, 15, 10, 12], backgroundColor: [CHART_COLORS.gold, CHART_COLORS.blue, CHART_COLORS.green, CHART_COLORS.purple, CHART_COLORS.orange], borderWidth: 2, borderColor: '#0b1426' }]
    },
    options: { ...CHART_DEFAULTS, cutout: '60%', plugins: { ...CHART_DEFAULTS.plugins, legend: { ...CHART_DEFAULTS.plugins.legend, position: 'bottom' } } }
  }),

  'chart-salary': () => new Chart(document.getElementById('chart-salary'), {
    type: 'bar',
    data: {
      labels: ['الراتب القاعدي', 'منحة المردودية', 'منحة النقل', 'منحة السكن', 'منافع أخرى'],
      datasets: [{
        label: 'نسبة المكون من الأجر الإجمالي %',
        data: [55, 20, 10, 8, 7],
        backgroundColor: [CHART_COLORS.gold, CHART_COLORS.blue, CHART_COLORS.teal, CHART_COLORS.purple, CHART_COLORS.orange],
        borderRadius: 6, borderSkipped: false
      }]
    },
    options: { ...CHART_DEFAULTS, indexAxis: 'y', scales: { x: { grid: { color: '#1e2e50' }, ticks: { color: '#94a3b8', font: { family: 'Cairo' } } }, y: { grid: { color: '#1e2e50' }, ticks: { color: '#e2e8f0', font: { family: 'Cairo', size: 11 } } } } }
  }),

  'chart-values': () => new Chart(document.getElementById('chart-values'), {
    type: 'radar',
    data: {
      labels: ['النزاهة', 'الحياد', 'المساواة', 'الشفافية', 'النجاعة', 'المساءلة', 'الانضباط'],
      datasets: [{
        label: 'أهمية القيمة في العمل الديواني',
        data: [10, 9, 9, 8, 9, 9, 8],
        backgroundColor: 'rgba(20,184,166,0.15)',
        borderColor: CHART_COLORS.teal,
        pointBackgroundColor: CHART_COLORS.teal,
        pointRadius: 5,
        borderWidth: 2
      }]
    },
    options: { ...CHART_DEFAULTS, scales: { r: { grid: { color: '#1e2e50' }, ticks: { color: '#94a3b8', backdropColor: 'transparent', font: { family: 'Cairo', size: 10 } }, pointLabels: { color: '#e2e8f0', font: { family: 'Cairo', size: 11 } }, min: 0, max: 10 } } }
  }),

  'chart-trade': () => new Chart(document.getElementById('chart-trade'), {
    type: 'bar',
    data: {
      labels: ['الاتحاد الأوروبي', 'الصين', 'تركيا', 'الجزائر', 'ليبيا', 'دول خليجية', 'دول أفريقية'],
      datasets: [
        { label: 'الصادرات %', data: [72, 4, 3, 2, 3, 5, 4], backgroundColor: CHART_COLORS.green, borderRadius: 5 },
        { label: 'الواردات %', data: [50, 12, 7, 4, 2, 6, 5], backgroundColor: CHART_COLORS.blue, borderRadius: 5 }
      ]
    },
    options: { ...CHART_DEFAULTS, scales: { x: { grid: { color: '#1e2e50' }, ticks: { color: '#94a3b8', font: { family: 'Cairo', size: 10 } } }, y: { grid: { color: '#1e2e50' }, ticks: { color: '#94a3b8', font: { family: 'Cairo' }, callback: v => v + '%' } } } }
  }),

  'chart-governance': () => new Chart(document.getElementById('chart-governance'), {
    type: 'polarArea',
    data: {
      labels: ['الشفافية', 'المساءلة', 'النجاعة', 'المشاركة', 'سيادة القانون', 'الإنصاف', 'التوافق', 'التوجه للمواطن'],
      datasets: [{
        data: [9, 9, 8, 7, 10, 8, 7, 9],
        backgroundColor: [CHART_COLORS.gold, CHART_COLORS.blue, CHART_COLORS.green, CHART_COLORS.purple, CHART_COLORS.teal, CHART_COLORS.orange, CHART_COLORS.pink, CHART_COLORS.indigo].map(c => c.replace('0.85', '0.6')),
        borderWidth: 1, borderColor: '#1e2e50'
      }]
    },
    options: { ...CHART_DEFAULTS, plugins: { ...CHART_DEFAULTS.plugins, legend: { ...CHART_DEFAULTS.plugins.legend, position: 'bottom', labels: { ...CHART_DEFAULTS.plugins.legend.labels, boxWidth: 12 } } }, scales: { r: { grid: { color: '#1e2e50' }, ticks: { color: '#94a3b8', backdropColor: 'transparent', font: { family: 'Cairo', size: 9 } } } } }
  }),

  'chart-debt': () => new Chart(document.getElementById('chart-debt'), {
    type: 'bar',
    data: {
      labels: ['تونس', 'مصر', 'المغرب', 'اليونان', 'إيطاليا', 'ألمانيا', 'الدنمارك'],
      datasets: [{
        label: 'نسبة الدين العام من PIB %',
        data: [82, 95, 68, 162, 135, 65, 30],
        backgroundColor: [CHART_COLORS.orange, CHART_COLORS.red, CHART_COLORS.gold, CHART_COLORS.red, CHART_COLORS.red, CHART_COLORS.green, CHART_COLORS.teal],
        borderRadius: 6,
      }]
    },
    options: { ...CHART_DEFAULTS, scales: { x: { grid: { color: '#1e2e50' }, ticks: { color: '#e2e8f0', font: { family: 'Cairo', size: 11 } } }, y: { grid: { color: '#1e2e50' }, ticks: { color: '#94a3b8', font: { family: 'Cairo' }, callback: v => v + '%' } } }, plugins: { ...CHART_DEFAULTS.plugins, annotation: {} } }
  }),
};

function renderChartsInPage(pageId) {
  const page = document.getElementById('page-' + pageId);
  if (!page) return;
  const canvases = page.querySelectorAll('canvas[id]');
  canvases.forEach(canvas => {
    const id = canvas.id;
    if (CHART_RENDERERS[id] && !Chart.getChart(canvas)) {
      try { CHART_RENDERERS[id](); } catch(e) { console.warn('Chart error:', id, e); }
    }
  });
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  buildNav();
  buildHomeGrid();
  buildChapterPages();
  updateProgress();
  restoreSidebarState();
  navigateTo('home');
});

// ---- BUILD NAV ----
function buildNav() {
  const nav = document.getElementById('sidebarNav');
  const homeItem = makeNavItem('🏠', '00', 'الصفحة الرئيسية', 'home', null);
  nav.appendChild(homeItem);
  CHAPTERS.forEach((ch, i) => {
    nav.appendChild(makeNavItem(ch.icon, String(i+1).padStart(2,'0'), ch.title, ch.id, ch.color));
  });
}

function makeNavItem(icon, num, title, pageId, color) {
  const item = document.createElement('div');
  item.className = 'nav-item';
  item.id = 'nav-' + pageId;
  item.innerHTML = `<span class="nav-num">${num}</span><span class="nav-icon">${icon}</span><span style="flex:1;font-size:11.5px;line-height:1.35">${title}</span>${doneChapters.includes(pageId) ? '<span class="nav-done">✓</span>' : ''}`;
  item.onclick = () => navigateTo(pageId);
  return item;
}

// ---- BUILD HOME GRID ----
function buildHomeGrid() {
  const grid = document.getElementById('chaptersGrid');
  CHAPTERS.forEach((ch, i) => {
    const card = document.createElement('div');
    card.className = 'chapter-card';
    card.style.setProperty('--card-color', ch.color);
    card.id = 'card-' + ch.id;
    card.innerHTML = `
      <div class="card-icon">${ch.icon}</div>
      <div class="card-num">المحور ${String(i+1).padStart(2,'0')} من 15</div>
      <div class="card-title">${ch.title}</div>
      <div class="card-desc">${ch.intro.substring(0,88)}...</div>
      <div class="card-arrow">${doneChapters.includes(ch.id)?'✓ مكتمل':'← ابدأ الدرس'}</div>
    `;
    card.onclick = () => navigateTo(ch.id);
    grid.appendChild(card);
  });
}

// ---- BUILD CHAPTER PAGES ----
function buildChapterPages() {
  const content = document.getElementById('contentArea');
  CHAPTERS.forEach((ch, idx) => {
    const page = document.createElement('div');
    page.className = 'page';
    page.id = 'page-' + ch.id;

    const tagsHtml = (ch.tags||[]).map(t=>`<span class="ch-tag">${t}</span>`).join('');
    const sectionsHtml = ch.sections.map((sec, si) => `
      <div class="section" id="sec-${ch.id}-${si}">
        <div class="section-header" onclick="toggleSection('sec-${ch.id}-${si}')">
          <span class="section-icon">${sec.icon}</span>
          <span class="section-title">${sec.title}</span>
          <span class="section-toggle">▼</span>
        </div>
        <div class="section-body">
          <div class="section-content" style="--ch-color:${ch.color}">${sec.content}</div>
        </div>
      </div>
    `).join('');

    const quizHtml = `
      <div class="section quiz-section" id="quiz-sec-${ch.id}">
        <div class="section-header" onclick="toggleSection('quiz-sec-${ch.id}')">
          <span class="section-icon">📝</span>
          <span class="section-title">اختبار تفاعلي للمحور — 18 سؤال QCM</span>
          <span class="section-toggle">▼</span>
        </div>
        <div class="section-body">
          <div class="quiz-container" id="quiz-container-${ch.id}"></div>
        </div>
      </div>
    `;

    const prevCh = CHAPTERS[idx-1];
    const nextCh = CHAPTERS[idx+1];
    const prevBtn = prevCh ? `<button class="btn-nav" onclick="navigateTo('${prevCh.id}')">← السابق</button>` : `<button class="btn-nav" onclick="navigateTo('home')">← الرئيسية</button>`;
    const nextBtn = nextCh ? `<button class="btn-nav" onclick="navigateTo('${nextCh.id}')">التالي →</button>` : `<button class="btn-nav" onclick="navigateTo('home')">إنهاء الدروس →</button>`;
    const marked = doneChapters.includes(ch.id);

    page.innerHTML = `
      <div class="ch-header" style="--ch-color:${ch.color}">
        <div class="ch-icon-big">${ch.icon}</div>
        <div class="ch-meta">
          <div class="ch-label">المحور ${String(idx+1).padStart(2,'0')} من 15</div>
          <div class="ch-title">${ch.title}</div>
          <div class="ch-intro">${ch.intro}</div>
          <div class="ch-tags">${tagsHtml}</div>
        </div>
      </div>
      ${sectionsHtml}
      ${quizHtml}
      <div class="ch-nav-btns">
        ${prevBtn}
        <button class="btn-done ${marked?'marked':''}" id="done-btn-${ch.id}" onclick="markDone('${ch.id}')">
          ${marked ? '✓ تم المراجعة' : '✔ تمييز كمُكتمل'}
        </button>
        ${nextBtn}
      </div>
    `;
    content.appendChild(page);
    renderQuiz(ch.id);
  });
}

// ---- NAVIGATION ----
function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const target = document.getElementById('page-' + pageId);
  if (target) target.classList.add('active');

  const navItem = document.getElementById('nav-' + pageId);
  if (navItem) navItem.classList.add('active');

  const ch = CHAPTERS.find(c => c.id === pageId);
  document.getElementById('topbarTitle').textContent = ch ? ch.title : 'الصفحة الرئيسية';
  currentPage = pageId;

  if (ch) {
    // Open first section
    const firstSec = document.getElementById(`sec-${pageId}-0`);
    if (firstSec && !firstSec.classList.contains('open')) toggleSection(`sec-${pageId}-0`);
    // Render charts after short delay
    setTimeout(() => renderChartsInPage(pageId), 150);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.getElementById('contentArea').scrollTo({ top: 0, behavior: 'smooth' });

  if (window.innerWidth < 900) closeSidebar();
}

// ---- TOGGLE SECTION ----
function toggleSection(id) {
  const sec = document.getElementById(id);
  if (!sec) return;
  const wasOpen = sec.classList.contains('open');
  sec.classList.toggle('open');
  // Render charts when section opens
  if (!wasOpen) {
    setTimeout(() => {
      const canvases = sec.querySelectorAll('canvas[id]');
      canvases.forEach(canvas => {
        if (CHART_RENDERERS[canvas.id] && !Chart.getChart(canvas)) {
          try { CHART_RENDERERS[canvas.id](); } catch(e) {}
        }
      });
    }, 200);
  }
}

// ---- MARK DONE ----
function markDone(chId) {
  if (!doneChapters.includes(chId)) doneChapters.push(chId);
  else doneChapters = doneChapters.filter(d => d !== chId);
  localStorage.setItem('douane_done', JSON.stringify(doneChapters));
  updateProgress();
  refreshNavDone();
  const btn = document.getElementById('done-btn-' + chId);
  if (btn) {
    const m = doneChapters.includes(chId);
    btn.textContent = m ? '✓ تم المراجعة' : '✔ تمييز كمُكتمل';
    btn.className = 'btn-done ' + (m ? 'marked' : '');
  }
}

// ---- PROGRESS ----
function updateProgress() {
  const done = doneChapters.length;
  const total = CHAPTERS.length;
  document.getElementById('progressBar').style.width = (done/total*100) + '%';
  document.getElementById('progressText').textContent = `${done} / ${total}`;
}

// ---- REFRESH NAV DONE ----
function refreshNavDone() {
  CHAPTERS.forEach(ch => {
    const item = document.getElementById('nav-' + ch.id);
    if (!item) return;
    const existing = item.querySelector('.nav-done');
    const isDone = doneChapters.includes(ch.id);
    if (isDone && !existing) { const s=document.createElement('span'); s.className='nav-done'; s.textContent='✓'; item.appendChild(s); }
    else if (!isDone && existing) existing.remove();
    const card = document.getElementById('card-' + ch.id);
    if (card) { const arrow=card.querySelector('.card-arrow'); if(arrow) arrow.innerHTML = isDone ? '✓ مكتمل' : '← ابدأ الدرس'; }
  });
}

// ---- SIDEBAR ----
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const menuBtn = document.getElementById('menuBtn');
const sidebarClose = document.getElementById('sidebarClose');

function openSidebar() { sidebar.classList.add('open'); sidebar.classList.remove('closed'); overlay.classList.add('show'); }
function closeSidebar() { sidebar.classList.remove('open'); sidebar.classList.add('closed'); overlay.classList.remove('show'); }
function restoreSidebarState() { if (window.innerWidth >= 900) { sidebar.classList.remove('closed','open'); overlay.classList.remove('show'); } }

menuBtn.addEventListener('click', openSidebar);
sidebarClose.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);
window.addEventListener('resize', restoreSidebarState);

// ============================================================
// ---- INTERACTIVE QCM QUIZ ENGINE ----
// ============================================================
let quizStates = {};

function getQuizState(chId) {
  if (!quizStates[chId]) {
    const saved = localStorage.getItem(`douane_quiz_${chId}`);
    if (saved) {
      quizStates[chId] = JSON.parse(saved);
    } else {
      const ch = CHAPTERS.find(c => c.id === chId);
      const qCount = ch && ch.quizzes ? ch.quizzes.length : 0;
      quizStates[chId] = {
        answers: Array(qCount).fill(null),
        completed: false
      };
    }
  }
  return quizStates[chId];
}

function renderQuiz(chId) {
  const container = document.getElementById(`quiz-container-${chId}`);
  if (!container) return;

  const ch = CHAPTERS.find(c => c.id === chId);
  if (!ch || !ch.quizzes || ch.quizzes.length === 0) {
    container.innerHTML = `<p style="text-align:center;padding:20px;color:var(--text-dim);">لا توجد أسئلة تدريبية متوفرة لهذا المحور حالياً.</p>`;
    return;
  }

  const state = getQuizState(chId);
  let answeredCount = 0;
  let correctCount = 0;

  state.answers.forEach((ans, idx) => {
    if (ans !== null) {
      answeredCount++;
      if (ans === ch.quizzes[idx].answer) {
        correctCount++;
      }
    }
  });

  let html = `
    <div class="quiz-summary-card">
      <div class="summary-info">
        <div class="summary-stat">
          <span class="stat-value">${answeredCount} / ${ch.quizzes.length}</span>
          <span class="stat-label">الأسئلة المجاب عنها</span>
        </div>
        <div class="summary-stat">
          <span class="stat-value text-green">${correctCount}</span>
          <span class="stat-label">الإجابات الصحيحة</span>
        </div>
        <div class="summary-stat">
          <span class="stat-value">${answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0}%</span>
          <span class="stat-label">نسبة النجاح</span>
        </div>
      </div>
      <div class="summary-progress-bar-wrap">
        <div class="summary-progress-bar" style="width: ${(answeredCount / ch.quizzes.length) * 100}%"></div>
      </div>
    </div>
    
    <div class="quiz-questions-list">
  `;

  ch.quizzes.forEach((quiz, qIdx) => {
    const userAnswer = state.answers[qIdx];
    const isAnswered = userAnswer !== null;

    html += `
      <div class="quiz-q-card ${isAnswered ? 'answered' : ''}" id="quiz-q-${chId}-${qIdx}">
        <div class="quiz-q-num">السؤال ${qIdx + 1} من ${ch.quizzes.length}</div>
        <div class="quiz-q-text">${quiz.q}</div>
        <div class="quiz-options">
    `;

    quiz.options.forEach((opt, oIdx) => {
      let optClass = 'quiz-opt-btn';
      let statusIcon = '';

      if (isAnswered) {
        if (oIdx === quiz.answer) {
          optClass += ' correct';
          statusIcon = ' <span class="opt-status-icon">✓</span>';
        } else if (oIdx === userAnswer) {
          optClass += ' incorrect';
          statusIcon = ' <span class="opt-status-icon">✕</span>';
        } else {
          optClass += ' disabled';
        }
      }

      const disabledAttr = isAnswered ? 'disabled' : '';

      html += `
        <button class="${optClass}" ${disabledAttr} onclick="selectOption('${chId}', ${qIdx}, ${oIdx})">
          <span class="opt-letter">${String.fromCharCode(65 + oIdx)}</span>
          <span class="opt-text">${opt}</span>
          ${statusIcon}
        </button>
      `;
    });

    html += `
        </div>
    `;

    if (isAnswered) {
      const isCorrect = userAnswer === quiz.answer;
      html += `
        <div class="quiz-explanation-box ${isCorrect ? 'correct' : 'incorrect'}">
          <div class="exp-title">${isCorrect ? '🎉 إجابة صحيحة!' : '❌ إجابة خاطئة'}</div>
          <div class="exp-text">${quiz.explanation}</div>
        </div>
      `;
    }

    html += `
      </div>
    `;
  });

  html += `
    </div>
    
    <div class="quiz-footer-actions">
      <button class="btn-reset-quiz" onclick="resetQuiz('${chId}')">🔄 إعادة محاولة الاختبار</button>
    </div>
  `;

  container.innerHTML = html;
}

function selectOption(chId, qIndex, oIndex) {
  const state = getQuizState(chId);
  if (state.answers[qIndex] !== null) return;

  state.answers[qIndex] = oIndex;
  localStorage.setItem(`douane_quiz_${chId}`, JSON.stringify(state));

  renderQuiz(chId);
}

function resetQuiz(chId) {
  if (confirm('هل أنت متأكد من رغبتك في إعادة تصفير هذا الاختبار؟')) {
    const ch = CHAPTERS.find(c => c.id === chId);
    const qCount = ch && ch.quizzes ? ch.quizzes.length : 0;
    quizStates[chId] = {
      answers: Array(qCount).fill(null),
      completed: false
    };
    localStorage.removeItem(`douane_quiz_${chId}`);
    renderQuiz(chId);
  }
}

