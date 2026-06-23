/* ============================================================
   EMI Calculator — script.js  (Feature-Rich Edition)
   Author  : Ruthvik Raj Chintala

   FEATURES:
   1.  Slider ↔ Input sync
   2.  Input validation
   3.  EMI formula  (P × r × (1+r)^n / ((1+r)^n − 1))
   4.  Animated counters
   5.  SVG progress ring chart
   6.  🌙 Dark / Light mode toggle  (persisted in localStorage)
   7.  ⚡ Loan-type quick presets   (Home / Car / Personal / Education)
   8.  📋 Copy results to clipboard
   9.  💡 Savings tip               (save X by reducing tenure 2 yrs)
   10. 📊 Amortization schedule     (paginated, 12 rows/page)
   11. 💾 CSV download
   12. 🖨 Print amortization
   13. 🔄 Loan comparison tool
   14. 💰 Prepayment savings calc
   15. 🔔 Toast notifications
   ============================================================ */

/* ─────────────────────────────────────────────────────────────
   1. DOM REFERENCES
   ───────────────────────────────────────────────────────────── */
const loanInput    = document.getElementById('loanAmount');
const rateInput    = document.getElementById('interestRate');
const tenureInput  = document.getElementById('tenure');

const loanSlider   = document.getElementById('loanSlider');
const rateSlider   = document.getElementById('rateSlider');
const tenureSlider = document.getElementById('tenureSlider');

const lblLoan   = document.getElementById('lbl-loan');
const lblRate   = document.getElementById('lbl-rate');
const lblTenure = document.getElementById('lbl-tenure');

const rowLoan   = document.getElementById('row-loan');
const rowRate   = document.getElementById('row-rate');
const rowTenure = document.getElementById('row-tenure');

const calcBtn   = document.getElementById('calculateBtn');

const resultEMI      = document.getElementById('resultEMI');
const resultInterest = document.getElementById('resultInterest');
const resultTotal    = document.getElementById('resultTotal');

const resultsList        = document.getElementById('resultsList');
const resultsPlaceholder = document.getElementById('resultsPlaceholder');

/* ─────────────────────────────────────────────────────────────
   2. SLIDER ↔ INPUT SYNC
   ───────────────────────────────────────────────────────────── */
function syncSlider(slider, input, lbl, fmt) {
  slider.addEventListener('input', () => {
    input.value = slider.value;
    if (lbl) lbl.textContent = fmt(slider.value);
    clearErr(input, getRow(input));
  });

  input.addEventListener('input', () => {
    const val = parseFloat(input.value);
    if (!isNaN(val)) {
      slider.value = Math.min(Math.max(val, +slider.min), +slider.max);
    }
    if (lbl) lbl.textContent = fmt(input.value || 0);
    clearErr(input, getRow(input));
  });
}

function getRow(input) { return input.closest('.input-row'); }

syncSlider(loanSlider,   loanInput,   lblLoan,   v => '₹ ' + Number(v).toLocaleString('en-IN'));
syncSlider(rateSlider,   rateInput,   lblRate,   v => parseFloat(v).toFixed(1) + ' %');
syncSlider(tenureSlider, tenureInput, lblTenure, v => v + (v == 1 ? ' Yr' : ' Yrs'));

/* ─────────────────────────────────────────────────────────────
   3. VALIDATION
   ───────────────────────────────────────────────────────────── */
function validateField(input, row, errId, label) {
  const errEl = document.getElementById(errId);
  const val   = parseFloat(input.value);
  if (input.value.trim() === '' || isNaN(val)) {
    setErr(row, errEl, `${label} cannot be empty`);
    return false;
  }
  if (val <= 0) {
    setErr(row, errEl, `${label} must be greater than zero`);
    return false;
  }
  clearErr(input, row, errEl);
  return true;
}

function setErr(row, errEl, msg) {
  if (row)   row.classList.add('error');
  if (errEl) { errEl.textContent = '⚠ ' + msg; errEl.classList.add('show'); }
}

function clearErr(input, row, errEl) {
  if (row)   row.classList.remove('error');
  if (errEl) errEl.classList.remove('show');
}

/* ─────────────────────────────────────────────────────────────
   4. EMI FORMULA
      EMI = P × r × (1+r)^n / ((1+r)^n − 1)
      P = Principal (₹)
      r = monthly rate = annualRate / 12 / 100
      n = total months = years × 12
   ───────────────────────────────────────────────────────────── */
function computeEMI(P, annualRate, years) {
  const r = annualRate / 12 / 100;
  const n = years * 12;
  let emi;
  if (r === 0) {
    emi = P / n;
  } else {
    const pf = Math.pow(1 + r, n);
    emi = (P * r * pf) / (pf - 1);
  }
  const totalPayment  = emi * n;
  const totalInterest = totalPayment - P;
  return { emi, totalInterest, totalPayment, r, n };
}

/* ─────────────────────────────────────────────────────────────
   5. FORMATTERS
   ───────────────────────────────────────────────────────────── */
function toINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR',
    minimumFractionDigits: 2, maximumFractionDigits: 2
  }).format(amount);
}

/* Format month index → "Jan 2025" style label */
function monthLabel(monthIndex) {
  const base = new Date();
  base.setDate(1);
  base.setMonth(base.getMonth() + monthIndex);
  return base.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}

/* ─────────────────────────────────────────────────────────────
   6. ANIMATED COUNTER
   ───────────────────────────────────────────────────────────── */
function animateCount(el, target, fmt, duration = 950) {
  const t0 = performance.now();
  (function step(now) {
    const p    = Math.min((now - t0) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(target * ease);
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}

/* ─────────────────────────────────────────────────────────────
   7. SVG PROGRESS RING   (circumference for r=52 ≈ 326.7)
   ───────────────────────────────────────────────────────────── */
const CIRC = 2 * Math.PI * 52;

function drawRing(principal, totalInterest) {
  const total        = principal + totalInterest;
  const principalPct = (principal / total) * 100;
  const interestPct  = 100 - principalPct;

  const principalArc = document.getElementById('ringPrincipal');
  const interestArc  = document.getElementById('ringInterest');
  const gap = 5;

  const pLen = (principalPct / 100) * CIRC;
  const iLen = (interestPct  / 100) * CIRC;

  principalArc.style.transition = 'stroke-dasharray 1.1s ease';
  principalArc.setAttribute('stroke-dasharray',  `${Math.max(0, pLen - gap)} ${CIRC}`);
  principalArc.setAttribute('stroke-dashoffset', '0');

  interestArc.style.transition = 'stroke-dasharray 1.1s ease, stroke-dashoffset 1.1s ease';
  interestArc.setAttribute('stroke-dasharray',   `${Math.max(0, iLen - gap)} ${CIRC}`);
  interestArc.setAttribute('stroke-dashoffset',  `-${pLen}`);

  document.getElementById('ringCenterPct').textContent = principalPct.toFixed(0) + '%';
  document.getElementById('legendPrincipal').textContent = principalPct.toFixed(1) + '%';
  document.getElementById('legendInterest').textContent  = interestPct.toFixed(1)  + '%';
  document.getElementById('legendTotal').textContent     = toINR(total);
}

/* ─────────────────────────────────────────────────────────────
   8. TOAST NOTIFICATION
   ───────────────────────────────────────────────────────────── */
let toastTimer;

function showToast(msg, duration = 2800) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
}

/* ─────────────────────────────────────────────────────────────
   9. 🌙 DARK MODE TOGGLE
   ───────────────────────────────────────────────────────────── */
const html       = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');

/* Restore saved preference */
const savedTheme = localStorage.getItem('emi-theme') || 'light';
html.setAttribute('data-theme', savedTheme);
themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
  const isDark = html.getAttribute('data-theme') === 'dark';
  const next   = isDark ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  themeIcon.textContent = next === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('emi-theme', next);
  showToast(next === 'dark' ? '🌙 Dark mode on' : '☀️ Light mode on', 1800);
});

/* ─────────────────────────────────────────────────────────────
   10. ⚡ LOAN TYPE PRESETS
   ───────────────────────────────────────────────────────────── */
document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    /* Remove active from all */
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    /* Fill values */
    const loan   = btn.dataset.loan;
    const rate   = btn.dataset.rate;
    const tenure = btn.dataset.tenure;

    loanInput.value    = loan;
    rateInput.value    = rate;
    tenureInput.value  = tenure;

    /* Sync sliders */
    loanSlider.value   = Math.min(Math.max(+loan,   +loanSlider.min),   +loanSlider.max);
    rateSlider.value   = Math.min(Math.max(+rate,   +rateSlider.min),   +rateSlider.max);
    tenureSlider.value = Math.min(Math.max(+tenure, +tenureSlider.min), +tenureSlider.max);

    /* Update live labels */
    lblLoan.textContent   = '₹ ' + Number(loan).toLocaleString('en-IN');
    lblRate.textContent   = parseFloat(rate).toFixed(1) + ' %';
    lblTenure.textContent = tenure + (tenure == 1 ? ' Yr' : ' Yrs');

    /* Clear errors */
    clearErr(loanInput,   rowLoan);
    clearErr(rateInput,   rowRate);
    clearErr(tenureInput, rowTenure);

    showToast('✅ Preset applied — hit Calculate!', 2200);
  });
});

/* ─────────────────────────────────────────────────────────────
   11. 📋 COPY RESULTS TO CLIPBOARD
   ───────────────────────────────────────────────────────────── */
document.getElementById('copyBtn').addEventListener('click', () => {
  const P    = loanInput.value;
  const rate = rateInput.value;
  const yrs  = tenureInput.value;
  const emi  = resultEMI.textContent;
  const int  = resultInterest.textContent;
  const tot  = resultTotal.textContent;

  const text =
    `EMI Calculator Results\n` +
    `───────────────────────\n` +
    `Loan Amount  : ₹${Number(P).toLocaleString('en-IN')}\n` +
    `Interest Rate: ${rate}% per annum\n` +
    `Tenure       : ${yrs} year(s)\n` +
    `───────────────────────\n` +
    `Monthly EMI  : ${emi}\n` +
    `Total Interest: ${int}\n` +
    `Total Payment : ${tot}`;

  navigator.clipboard.writeText(text)
    .then(() => showToast('📋 Results copied to clipboard!'))
    .catch(() => showToast('⚠ Copy failed — please try manually'));
});

/* ─────────────────────────────────────────────────────────────
   12. AMORTIZATION SCHEDULE
   ───────────────────────────────────────────────────────────── */
const ROWS_PER_PAGE = 12;
let amortData  = [];  /* Full schedule rows */
let currentPage = 1;

/**
 * Builds the complete amortization schedule for given loan params.
 * @returns {Array} Array of monthly objects with opening/principal/interest/closing
 */
function buildAmortization(P, annualRate, years) {
  const r = annualRate / 12 / 100;
  const n = years * 12;
  const pf = Math.pow(1 + r, n);
  const emi = r === 0 ? P / n : (P * r * pf) / (pf - 1);

  const rows = [];
  let balance = P;

  for (let m = 1; m <= n; m++) {
    const interest  = balance * r;
    const principal = emi - interest;
    const closing   = Math.max(0, balance - principal);

    rows.push({
      month:     m,
      label:     monthLabel(m - 1),
      opening:   balance,
      emi:       emi,
      principal: principal,
      interest:  interest,
      closing:   closing
    });

    balance = closing;
  }
  return rows;
}

/** Render the current page of the amortization table */
function renderAmortPage() {
  const tbody  = document.getElementById('amortBody');
  const total  = Math.ceil(amortData.length / ROWS_PER_PAGE);
  const start  = (currentPage - 1) * ROWS_PER_PAGE;
  const end    = Math.min(start + ROWS_PER_PAGE, amortData.length);
  const rows   = amortData.slice(start, end);

  tbody.innerHTML = rows.map(r => `
    <tr>
      <td class="col-idx">${r.month}</td>
      <td>${r.label}</td>
      <td>${toINR(r.opening)}</td>
      <td class="col-emi">${toINR(r.emi)}</td>
      <td class="col-prin">${toINR(r.principal)}</td>
      <td class="col-int">${toINR(r.interest)}</td>
      <td class="col-bal">${toINR(r.closing)}</td>
    </tr>
  `).join('');

  document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${total}`;
  document.getElementById('prevPage').disabled = currentPage === 1;
  document.getElementById('nextPage').disabled = currentPage === total;
}

document.getElementById('prevPage').addEventListener('click', () => {
  if (currentPage > 1) { currentPage--; renderAmortPage(); }
});

document.getElementById('nextPage').addEventListener('click', () => {
  const total = Math.ceil(amortData.length / ROWS_PER_PAGE);
  if (currentPage < total) { currentPage++; renderAmortPage(); }
});

/* ─────────────────────────────────────────────────────────────
   13. 💾 CSV DOWNLOAD
   ───────────────────────────────────────────────────────────── */
document.getElementById('downloadCSV').addEventListener('click', () => {
  if (!amortData.length) { showToast('⚠ Calculate first!'); return; }

  const header = 'Month,Date,Opening Balance,EMI,Principal Paid,Interest Paid,Closing Balance\n';
  const rows   = amortData.map(r =>
    `${r.month},${r.label},${r.opening.toFixed(2)},${r.emi.toFixed(2)},${r.principal.toFixed(2)},${r.interest.toFixed(2)},${r.closing.toFixed(2)}`
  ).join('\n');

  const blob = new Blob([header + rows], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'EMI_Amortization_Schedule.csv';
  a.click();
  URL.revokeObjectURL(url);
  showToast('💾 CSV downloaded!');
});

/* ─────────────────────────────────────────────────────────────
   14. 🖨 PRINT AMORTIZATION
   ───────────────────────────────────────────────────────────── */
document.getElementById('printAmort').addEventListener('click', () => {
  if (!amortData.length) { showToast('⚠ Calculate first!'); return; }
  window.print();
});

/* ─────────────────────────────────────────────────────────────
   15. 🔄 LOAN COMPARISON TOOL
   ───────────────────────────────────────────────────────────── */
document.getElementById('compareBtn').addEventListener('click', () => {
  const P         = parseFloat(loanInput.value);
  const origRate  = parseFloat(rateInput.value);
  const origYears = parseFloat(tenureInput.value);

  if (isNaN(P) || isNaN(origRate) || isNaN(origYears) || P <= 0) {
    showToast('⚠ Please calculate your EMI first!');
    return;
  }

  const altRate   = parseFloat(document.getElementById('cmpRate').value);
  const altYears  = parseFloat(document.getElementById('cmpTenure').value);

  if (isNaN(altRate) || isNaN(altYears) || altRate <= 0 || altYears <= 0) {
    showToast('⚠ Enter valid alternative rate and tenure');
    return;
  }

  const orig = computeEMI(P, origRate, origYears);
  const alt  = computeEMI(P, altRate,  altYears);

  /* Determine which is cheaper overall */
  const origCheaper = orig.totalPayment <= alt.totalPayment;
  const diff        = Math.abs(orig.totalPayment - alt.totalPayment);

  const cardsEl = document.getElementById('compareCards');
  cardsEl.innerHTML = `
    <!-- Original Loan -->
    <div class="cmp-card original">
      <div class="cmp-card-title">📌 Current Loan</div>
      <div class="cmp-row">
        <span class="cmp-row-label">Rate</span>
        <span class="cmp-row-val">${origRate}%</span>
      </div>
      <div class="cmp-row">
        <span class="cmp-row-label">Tenure</span>
        <span class="cmp-row-val">${origYears} yr${origYears > 1 ? 's' : ''}</span>
      </div>
      <div class="cmp-row">
        <span class="cmp-row-label">Monthly EMI</span>
        <span class="cmp-row-val">${toINR(orig.emi)}</span>
      </div>
      <div class="cmp-row">
        <span class="cmp-row-label">Total Interest</span>
        <span class="cmp-row-val">${toINR(orig.totalInterest)}</span>
      </div>
      <div class="cmp-row">
        <span class="cmp-row-label">Total Payment</span>
        <span class="cmp-row-val">${toINR(orig.totalPayment)}</span>
      </div>
    </div>

    <!-- Alternative Loan -->
    <div class="cmp-card alt">
      <div class="cmp-card-title">🔀 Alternative Loan</div>
      <div class="cmp-row">
        <span class="cmp-row-label">Rate</span>
        <span class="cmp-row-val">${altRate}%</span>
      </div>
      <div class="cmp-row">
        <span class="cmp-row-label">Tenure</span>
        <span class="cmp-row-val">${altYears} yr${altYears > 1 ? 's' : ''}</span>
      </div>
      <div class="cmp-row">
        <span class="cmp-row-label">Monthly EMI</span>
        <span class="cmp-row-val">${toINR(alt.emi)}</span>
      </div>
      <div class="cmp-row">
        <span class="cmp-row-label">Total Interest</span>
        <span class="cmp-row-val">${toINR(alt.totalInterest)}</span>
      </div>
      <div class="cmp-row">
        <span class="cmp-row-label">Total Payment</span>
        <span class="cmp-row-val">${toINR(alt.totalPayment)}</span>
      </div>
    </div>

    <!-- Verdict -->
    <div class="cmp-card winner">
      <div class="cmp-card-title">🏆 Verdict</div>
      <div class="cmp-row">
        <span class="cmp-row-label">Cheaper option</span>
        <span class="cmp-row-val">${origCheaper ? 'Current' : 'Alternative'}</span>
      </div>
      <div class="cmp-row">
        <span class="cmp-row-label">You save</span>
        <span class="cmp-row-val">${toINR(diff)}</span>
      </div>
      <div class="cmp-row">
        <span class="cmp-row-label">EMI difference</span>
        <span class="cmp-row-val">${toINR(Math.abs(orig.emi - alt.emi))}/mo</span>
      </div>
      <div class="cmp-row">
        <span class="cmp-row-label">Interest saved</span>
        <span class="cmp-row-val">${toINR(Math.abs(orig.totalInterest - alt.totalInterest))}</span>
      </div>
    </div>
  `;

  showToast('🔄 Comparison ready!');
});

/* ─────────────────────────────────────────────────────────────
   16. 💰 PREPAYMENT SAVINGS CALCULATOR
   ───────────────────────────────────────────────────────────── */
document.getElementById('prepayBtn').addEventListener('click', () => {
  const P         = parseFloat(loanInput.value);
  const annualRate = parseFloat(rateInput.value);
  const years     = parseFloat(tenureInput.value);

  if (isNaN(P) || isNaN(annualRate) || isNaN(years) || P <= 0) {
    showToast('⚠ Please calculate your EMI first!');
    return;
  }

  const prepayAmt   = parseFloat(document.getElementById('prepayAmt').value);
  const prepayMonth = parseInt(document.getElementById('prepayMonth').value);

  if (isNaN(prepayAmt) || prepayAmt <= 0) { showToast('⚠ Enter a valid prepayment amount'); return; }
  if (isNaN(prepayMonth) || prepayMonth < 1) { showToast('⚠ Enter a valid month number'); return; }

  const orig = computeEMI(P, annualRate, years);

  /* Simulate loan after prepayment at the given month */
  const r   = annualRate / 12 / 100;
  const emi = orig.emi;
  let balance = P;

  /* Run through months up to prepayMonth */
  for (let m = 1; m < prepayMonth && balance > 0; m++) {
    const interest  = balance * r;
    const principal = emi - interest;
    balance = Math.max(0, balance - principal);
  }

  /* Apply prepayment */
  const balanceAfterPrepay = Math.max(0, balance - prepayAmt);

  if (balanceAfterPrepay <= 0) {
    showToast('✅ Prepayment clears the entire loan!');
    document.getElementById('prepayResult').style.display = 'grid';
    document.getElementById('prepayResult').innerHTML = `
      <div class="prepay-tile t3" style="grid-column:1/-1;text-align:center;">
        <div class="prepay-tile-icon">🎉</div>
        <div class="prepay-tile-lbl">Loan Fully Cleared!</div>
        <div class="prepay-tile-val">The prepayment clears the remaining balance.</div>
      </div>`;
    return;
  }

  /* Re-compute EMI for remaining balance and remaining months */
  const remainingMonths = (years * 12) - prepayMonth + 1;
  const newEMI = r === 0
    ? balanceAfterPrepay / remainingMonths
    : (balanceAfterPrepay * r * Math.pow(1 + r, remainingMonths)) /
      (Math.pow(1 + r, remainingMonths) - 1);

  const totalPaidBefore  = emi * (prepayMonth - 1);
  const totalPaidAfter   = newEMI * remainingMonths;
  const totalWithPrepay  = totalPaidBefore + prepayAmt + totalPaidAfter;
  const interestSaved    = orig.totalPayment - totalWithPrepay;

  const resultEl = document.getElementById('prepayResult');
  resultEl.style.display = 'grid';
  resultEl.innerHTML = `
    <div class="prepay-tile t1">
      <div class="prepay-tile-icon">💳</div>
      <div class="prepay-tile-lbl">New Monthly EMI</div>
      <div class="prepay-tile-val">${toINR(newEMI)}</div>
    </div>
    <div class="prepay-tile t2">
      <div class="prepay-tile-icon">💰</div>
      <div class="prepay-tile-lbl">Interest Saved</div>
      <div class="prepay-tile-val">${toINR(Math.max(0, interestSaved))}</div>
    </div>
    <div class="prepay-tile t3">
      <div class="prepay-tile-icon">📉</div>
      <div class="prepay-tile-lbl">Total Saving vs Original</div>
      <div class="prepay-tile-val">${toINR(Math.max(0, orig.totalPayment - totalWithPrepay))}</div>
    </div>
  `;
  showToast('💰 Prepayment savings calculated!');
});

/* ─────────────────────────────────────────────────────────────
   17. MAIN CALCULATE HANDLER
   ───────────────────────────────────────────────────────────── */
function handleCalculate() {
  /* Validate */
  const ok1 = validateField(loanInput,   rowLoan,   'errLoan',   'Loan Amount');
  const ok2 = validateField(rateInput,   rowRate,   'errRate',   'Interest Rate');
  const ok3 = validateField(tenureInput, rowTenure, 'errTenure', 'Loan Tenure');
  if (!ok1 || !ok2 || !ok3) return;

  const P          = parseFloat(loanInput.value);
  const annualRate = parseFloat(rateInput.value);
  const years      = parseFloat(tenureInput.value);

  /* Compute primary result */
  const { emi, totalInterest, totalPayment } = computeEMI(P, annualRate, years);

  /* ─ Stats ribbon ─ */
  document.getElementById('pillMonths').textContent = (years * 12) + ' mo';
  document.getElementById('pillRate').textContent   = annualRate + '%';
  document.getElementById('pillYears').textContent  = years + (years === 1 ? ' yr' : ' yrs');

  /* ─ Show results ─ */
  resultsPlaceholder.style.display = 'none';
  resultsList.classList.add('show');

  /* ─ Animate counters ─ */
  animateCount(resultEMI,      emi,          toINR);
  animateCount(resultInterest, totalInterest, toINR);
  animateCount(resultTotal,    totalPayment,  toINR);

  /* ─ Ring chart ─ */
  drawRing(P, totalInterest);

  /* ─ Show Copy button ─ */
  document.getElementById('copyBtn').style.display = 'flex';

  /* ─── SAVINGS TIP ───
     Show how much the user saves if tenure is reduced by 2 years
     (only shown when tenure >= 3 years)                          */
  const tipEl   = document.getElementById('savingsTip');
  const tipText = document.getElementById('tipText');
  if (years >= 3) {
    const shortYears = years - 2;
    const short = computeEMI(P, annualRate, shortYears);
    const saved = totalInterest - short.totalInterest;
    const extraEMI = short.emi - emi;
    tipText.innerHTML =
      `Save <strong>${toINR(saved)}</strong> in interest by reducing tenure to
       <strong>${shortYears} yr${shortYears > 1 ? 's' : ''}</strong>.
       Your EMI increases by just <strong>${toINR(extraEMI)}/mo</strong>.`;
    tipEl.style.display = 'flex';
  } else {
    tipEl.style.display = 'none';
  }

  /* ─── AMORTIZATION SCHEDULE ─── */
  amortData   = buildAmortization(P, annualRate, years);
  currentPage = 1;

  /* Update summary pills */
  document.getElementById('aSumPrincipal').textContent = toINR(P);
  document.getElementById('aSumInterest').textContent  = toINR(totalInterest);
  document.getElementById('aSumTotal').textContent     = toINR(totalPayment);

  renderAmortPage();
  document.getElementById('amortSection').style.display = 'block';

  /* ─── SHOW COMPARISON & PREPAYMENT SECTIONS ─── */
  /* Pre-fill comparison inputs with sensible defaults */
  const cmpRateEl   = document.getElementById('cmpRate');
  const cmpTenureEl = document.getElementById('cmpTenure');
  if (!cmpRateEl.value)   cmpRateEl.value   = (annualRate + 1.5).toFixed(1);
  if (!cmpTenureEl.value) cmpTenureEl.value = Math.max(1, years - 2);

  document.getElementById('compareSection').style.display = 'block';
  document.getElementById('prepaySection').style.display  = 'block';

  /* Pre-fill prepayment month */
  const prepayMonthEl = document.getElementById('prepayMonth');
  if (!prepayMonthEl.value) prepayMonthEl.value = 12;

  /* ─ Scroll on mobile ─ */
  if (window.innerWidth < 720) {
    resultsList.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  showToast('✅ EMI calculated successfully!');
}

/* Attach event listeners */
calcBtn.addEventListener('click', handleCalculate);
[loanInput, rateInput, tenureInput].forEach(inp =>
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') handleCalculate(); })
);

/* ─────────────────────────────────────────────────────────────
   18. "Built for Digital Heroes" button
   ───────────────────────────────────────────────────────────── */
const dhBtn = document.getElementById('digitalHeroesBtn');
if (dhBtn) {
  dhBtn.addEventListener('click', () =>
    window.open('https://digitalheroesco.com', '_blank', 'noopener,noreferrer')
  );
}

/* ─────────────────────────────────────────────────────────────
   19. FOOTER YEAR
   ───────────────────────────────────────────────────────────── */
const yearEl = document.getElementById('footerYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();
