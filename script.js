
/* script.js - Enhanced version without previous semester CGPA feature */

/* ------------------------
   Utility & UX helpers
   ------------------------ */
function clickSound() {
  const s = document.getElementById("clickSound");
  if (s) s.play().catch(() => {});
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  if (!window.speechSynthesis.speaking) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.pitch = 1;
    utter.rate = 1;
    window.speechSynthesis.speak(utter);
  }
}

/* ------------------------
   Grade mapping
   ------------------------ */
function getGradeAndGP(marks) {
  if (marks >= 95) return ["A+", 4.00];
  if (marks >= 86) return ["A", 4.00];
  if (marks >= 80) return ["A-", 3.70];
  if (marks >= 76) return ["B+", 3.30];
  if (marks >= 72) return ["B", 3.00];
  if (marks >= 68) return ["B-", 2.70];
  if (marks >= 64) return ["C+", 2.30];
  if (marks >= 60) return ["C", 2.00];
  if (marks >= 57) return ["C-", 1.70];
  if (marks >= 54) return ["D+", 1.30];
  if (marks >= 50) return ["D", 1.00];
  return ["F", 0.00];
}

/* ------------------------
   Core CGPA logic
   ------------------------ */
function calculateCGPA() {
  const rows = document.querySelectorAll("#gradesTable tr:not(:first-child)");
  const name = document.getElementById("studentName")?.value.trim() || "";

  // Must enter name
  if (!name) {
    alert("⚠️ Please enter your name before calculating CGPA.");
    return;
  }

  let totalWeightedGP = 0, totalCredits = 0;

  rows.forEach(row => {
    const marks = parseFloat(row.querySelector(".marks")?.value);
    const credits = parseFloat(row.querySelector(".credits")?.value);
    const gradeCell = row.querySelector(".grade");
    const gpCell = row.querySelector(".gp");

    if (!isNaN(marks) && !isNaN(credits)) {
      const [grade, gp] = getGradeAndGP(marks);
      if (gradeCell) gradeCell.textContent = grade;
      if (gpCell) gpCell.textContent = gp.toFixed(2);
      totalWeightedGP += gp * credits;
      totalCredits += credits;
    } else {
      if (gradeCell) gradeCell.textContent = "";
      if (gpCell) gpCell.textContent = "";
    }
  });

  const cgpa = totalCredits > 0 ? (totalWeightedGP / totalCredits).toFixed(2) : "0.00";
  const progressValue = document.getElementById("progressValue");
  if (progressValue) progressValue.textContent = cgpa;

  animateProgress(parseFloat(cgpa));
  const resultEl = document.getElementById("result");
  if (resultEl) resultEl.textContent = `${name}, your CGPA is ${cgpa}`;

  showRemark(cgpa);
  const performance = getRemarkText(parseFloat(cgpa));
  speak(`${name}, your CGPA is ${cgpa}. ${performance}`);
  clickSound();
}

/* ------------------------
   Remarks
   ------------------------ */
function getRemarkText(cgpa) {
  const val = parseFloat(cgpa);
  if (val >= 3.5) return "🎉 Excellent performance!";
  if (val >= 3.0) return "😊 Very good performance!";
  if (val >= 2.0) return "💪 Keep improving!";
  return "You need more effort!";
}


function showRemark(cgpa) {
  const remark = document.getElementById("remark");
  const text = getRemarkText(cgpa);
  if (remark) remark.textContent = text;
}

/* ------------------------
   Progress circle
   ------------------------ */
function animateProgress(value) {
  const circle = document.getElementById("progressCircle");
  const degree = (value / 4) * 360;
  let accent = getComputedStyle(document.documentElement).getPropertyValue("--accent") || "#00b4d8";
  accent = accent.trim() || "#00b4d8";
  if (circle) {
    circle.style.background = `conic-gradient(${accent} ${degree}deg, #333 ${degree}deg)`;
    circle.style.boxShadow = `0 0 35px ${accent}`;
  }
}

/* ------------------------
   Add / Remove rows
   ------------------------ */
function addSubject() {
  const table = document.getElementById("gradesTable");
  const newRow = table.insertRow(-1);
  newRow.innerHTML = `
    <td><input type="text" class="subject" placeholder="Enter Subject" /></td>
    <td><input type="number" min="0" max="100" class="marks" /></td>
    <td><input type="number" min="1" max="5" class="credits" /></td>
    <td class="grade"></td>
    <td class="gp"></td>`;
  clickSound();
}

function removeSubject() {
  const table = document.getElementById("gradesTable");
  if (table.rows.length > 2) {
    table.deleteRow(-1);
  } else if (table.rows.length === 2) {
    const firstRow = table.rows[1];
    firstRow.querySelector(".subject").value = "";
    firstRow.querySelector(".marks").value = "";
    firstRow.querySelector(".credits").value = "";
    firstRow.querySelector(".grade").textContent = "";
    firstRow.querySelector(".gp").textContent = "";
  }
  resetCGPA();
  clickSound();
}

function resetCGPA() {
  const pv = document.getElementById("progressValue");
  if (pv) pv.textContent = "0.00";
  const res = document.getElementById("result");
  if (res) res.textContent = "";
  const rem = document.getElementById("remark");
  if (rem) rem.textContent = "";
  const circle = document.getElementById("progressCircle");
  if (circle) {
    circle.style.background = `conic-gradient(#333 0deg, #333 360deg)`;
    circle.style.boxShadow = `0 0 10px rgba(0,0,0,0.2)`;
  }
}

/* ------------------------
   Grading Scale toggle
   ------------------------ */
function toggleGradingScale() {
  const scale = document.getElementById("gradingScale");
  const btn = document.getElementById("scaleBtn");
  const shown = scale.style.display === "block";
  scale.style.display = shown ? "none" : "block";
  if (btn) btn.textContent = shown ? "📈 Show Grading Scale" : "📘 Hide Grading Scale";
  clickSound();
}

/* ------------------------
   Converter modal + logic
   ------------------------ */
function toggleConverter() {
  const modal = document.getElementById("converterModal");
  modal.style.display = modal.style.display === "flex" ? "none" : "flex";
  clickSound();
}

function convertGradeToMarks() {
  const gradeInput = document.getElementById("gradeInput");
  const marksInput = document.getElementById("marksInput");
  const result = document.getElementById("converterResult");

  if (!gradeInput || !marksInput || !result) return;

  if (gradeInput.value.trim()) marksInput.value = ""; // disable the other
  const grade = gradeInput.value.trim().toUpperCase();
  const map = {
    "A+": "95-100 (4.00)", "A": "86-94 (4.00)", "A-": "80-85 (3.70)",
    "B+": "76-79 (3.30)", "B": "72-75 (3.00)", "B-": "68-71 (2.70)",
    "C+": "64-67 (2.30)", "C": "60-63 (2.00)", "C-": "57-59 (1.70)",
    "D+": "54-56 (1.30)", "D": "50-53 (1.00)", "F": "Below 50 (0.00)"
  };
  result.textContent = map[grade] ? `${grade}: ${map[grade]}` : "";
}

function convertMarksToGrade() {
  const marksInput = document.getElementById("marksInput");
  const gradeInput = document.getElementById("gradeInput");
  const result = document.getElementById("converterResult");

  if (!marksInput || !gradeInput || !result) return;

  if (marksInput.value.trim()) gradeInput.value = ""; // disable the other
  const val = parseFloat(marksInput.value);
  if (isNaN(val)) return;
  const [grade, gp] = getGradeAndGP(val);
  result.textContent = `${val} marks = ${grade} (${gp})`;
}

/* ------------------------
   Theme & Accent
   ------------------------ */
function toggleMode() {
  document.body.classList.toggle("light");
  initBackground(currentBgType);
}

document.addEventListener("DOMContentLoaded", () => {
  const accentPicker = document.getElementById("accentPicker");
  if (accentPicker) {
    accentPicker.value = "#00b4d8";
    document.documentElement.style.setProperty("--accent", accentPicker.value);
    accentPicker.addEventListener("input", (e) => {
      document.documentElement.style.setProperty("--accent", e.target.value);
    });
  }

  const bgSelect = document.getElementById("bgSelect");
  if (bgSelect) bgSelect.addEventListener("change", (e) => initBackground(e.target.value));

  document.getElementById("gradeInput")?.addEventListener("input", convertGradeToMarks);
  document.getElementById("marksInput")?.addEventListener("input", convertMarksToGrade);

  const cm = document.getElementById("converterModal");
  if (cm) cm.style.display = "none";
});

/* ------------------------
   Background animations
   ------------------------ */
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext?.("2d");
let width = 0, height = 0;
let rafId = null;
let currentBgType = "particles";
let particles = [];

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  if (canvas) {
    canvas.width = width;
    canvas.height = height;
  }
}

window.addEventListener("resize", () => {
  resizeCanvas();
  initBackground(currentBgType);
});

function initBackground(type) {
  if (!ctx) return;
  currentBgType = type || "particles";
  particles = [];
  resizeCanvas();
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 4 + 2,
      dx: (Math.random() - 0.5) * 1.2,
      dy: (Math.random() - 0.5) * 1.2,
      hue: Math.random() * 360
    });
  }
  if (rafId) cancelAnimationFrame(rafId);
  loop();
}

function drawParticles() {
  ctx.clearRect(0, 0, width, height);
  particles.forEach(p => {
    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
    grad.addColorStop(0, `hsla(${p.hue},80%,60%,0.8)`);
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
    ctx.fill();
    p.x += p.dx; p.y += p.dy;
    if (p.x < -50) p.x = width + 50;
    if (p.x > width + 50) p.x = -50;
    if (p.y < -50) p.y = height + 50;
    if (p.y > height + 50) p.y = -50;
  });
}
// Mode toggle button (uses existing `initBackground` to refresh canvas)
const body = document.body;
const modeBtn = document.createElement("button");
modeBtn.className = "mode-toggle";
modeBtn.textContent = "🌙 Dark Mode";
document.body.appendChild(modeBtn);

modeBtn.addEventListener("click", () => {
  body.classList.toggle("light");
  modeBtn.textContent = body.classList.contains("light")
    ? "🌞 Light Mode"
    : "🌙 Dark Mode";
  // Reinitialize background animation to pick up new colors/mode
  initBackground(currentBgType);
});

function loop() {
  if (!ctx) return;
  drawParticles();
  rafId = requestAnimationFrame(loop);
}

resizeCanvas();
initBackground("particles");

window.addSubject = addSubject;
window.removeSubject = removeSubject;
window.calculateCGPA = calculateCGPA;
window.toggleGradingScale = toggleGradingScale;
window.toggleConverter = toggleConverter;
window.toggleMode = toggleMode;

