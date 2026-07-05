import { PACKS, buildPuzzle, countSolutions, dailySeed, getRank, normalizeSeed } from "./puzzle-engine.js";

const app = document.querySelector("#app");
const menu = document.querySelector(".mobile-menu");
const adTemplate = document.querySelector("#ad-slot-template");
const solvedKey = "zaney-logic-solved";
const rankKey = "zaney-logic-solved-count";

const state = {
  puzzle: null,
  marks: {},
  activeTab: "evidence",
  hintIndex: 0,
  final: {},
  result: null,
  toast: "",
  generator: {
    seed: dailySeed(),
    packId: PACKS[0].id
  }
};

function init() {
  window.addEventListener("hashchange", route);
  document.body.addEventListener("click", handleClick);
  document.body.addEventListener("change", handleChange);
  route();
}

function route() {
  const hash = window.location.hash || "#daily";
  const sharedCase = new URLSearchParams(window.location.search).get("case");
  if (hash.startsWith("#generator")) {
    renderGenerator();
    return;
  }
  if (hash.startsWith("#packs")) {
    renderPacks();
    return;
  }
  if (hash.startsWith("#play-")) {
    const [, seed, packId = ""] = hash.match(/^#play-(\d+)(?:-(.+))?$/) || [];
    loadPuzzle(seed, packId);
    renderGame(false);
    return;
  }
  if (sharedCase) {
    loadPuzzle(sharedCase, new URLSearchParams(window.location.search).get("pack") || "");
    renderGame(false);
    return;
  }
  loadPuzzle(dailySeed());
  renderGame(true);
}

function loadPuzzle(seed, packId = "") {
  const next = buildPuzzle(normalizeSeed(seed), packId);
  if (!state.puzzle || state.puzzle.id !== next.id || state.puzzle.packId !== next.packId) {
    state.puzzle = next;
    state.marks = {};
    state.final = {};
    state.result = null;
    state.toast = "";
    state.hintIndex = 0;
    state.activeTab = "evidence";
  }
}

function renderGame(isDaily) {
  const puzzle = state.puzzle;
  const solved = getSolvedSet();
  const solvedCount = Number(localStorage.getItem(rankKey) || solved.size || 0);
  const rank = getRank(solvedCount);
  app.innerHTML = `
    <section class="screen" id="daily">
      <div class="case-layout">
        ${renderCaseFile(puzzle, isDaily)}
        ${renderRankStrip(rank, solvedCount)}
        ${renderAdSlot()}
        <div class="main-column">
          ${renderNotebookTabs()}
          ${renderNotebookPanel(puzzle)}
          ${renderClues(puzzle)}
          ${renderGrid(puzzle)}
        </div>
        <div class="side-column">
          ${renderProgressPanel(puzzle)}
          ${renderAssistant(puzzle)}
          ${renderFinalAnswer(puzzle)}
          ${renderSharePanel(puzzle)}
          ${renderAdSlot()}
        </div>
        ${renderBottomActions()}
        ${renderToast()}
      </div>
    </section>
  `;
}

function renderCaseFile(puzzle, isDaily) {
  return `
    <section class="case-file">
      <div class="story-section">
        <p class="case-kicker">${isDaily ? "Daily case" : "Generated case"} · ${puzzle.id} · ${puzzle.pack}</p>
        <h1>${escapeHtml(puzzle.title)}</h1>
        <div class="status-strip">
          <span>Introduction</span>
          <span>Evidence</span>
          <span>Witness statements</span>
          <span>Logic clues</span>
          <span>Final deduction</span>
          <span>Ending</span>
        </div>
        <p>${escapeHtml(puzzle.story)}</p>
        <p>Find who took ${escapeHtml(puzzle.object)}, where it was hidden, which evidence proves it, and when it happened.</p>
      </div>
      <img class="case-photo" src="${escapeHtml(puzzle.image)}" alt="${escapeHtml(`${puzzle.pack} evidence photograph`)}" />
    </section>
  `;
}

function renderRankStrip(rankInfo, solvedCount) {
  const remaining = rankInfo.next ? rankInfo.next.min - solvedCount : 0;
  const nextText = rankInfo.next ? `${remaining} ${remaining === 1 ? "solve" : "solves"} to ${rankInfo.next.name}` : "Top rank reached";
  return `
    <section class="rank-strip" id="rank">
      <strong>${rankInfo.rank.name}</strong>
      <div class="rank-meter" aria-label="Rank progress"><span style="width:${rankInfo.progress}%"></span></div>
      <span>${solvedCount} solved · ${nextText}</span>
    </section>
  `;
}

function renderNotebookTabs() {
  const tabs = [
    ["evidence", "Evidence"],
    ["witnesses", "Witnesses"],
    ["timeline", "Timeline"],
    ["suspects", "Suspects"],
    ["maps", "Maps"],
    ["notes", "Auto-notes"]
  ];
  return `
    <div class="notebook-tabs" role="tablist" aria-label="Interactive notebook">
      ${tabs
        .map(
          ([id, label]) => `
            <button type="button" data-action="set-tab" data-tab="${id}" role="tab" aria-selected="${state.activeTab === id}">
              ${label}
            </button>
          `
        )
        .join("")}
    </div>
  `;
}

function renderNotebookPanel(puzzle) {
  const tab = state.activeTab;
  if (tab === "timeline") {
    return panel("Timeline", puzzle.notebook.timeline.map((item) => evidenceRow(item.time, item.text)).join(""));
  }
  if (tab === "suspects") {
    return panel("Suspects", puzzle.notebook.suspects.map((item) => evidenceRow(item.name, item.note)).join(""));
  }
  if (tab === "maps") {
    return panel("Maps", puzzle.notebook.maps.map((item) => evidenceRow(item.place, item.note)).join(""));
  }
  if (tab === "notes") {
    return panel("Auto-notes", renderAutoNotes(puzzle));
  }
  const rows = puzzle.notebook[tab] ?? puzzle.notebook.evidence;
  return panel(titleCase(tab), rows.map((text, index) => evidenceRow(String(index + 1), text)).join(""));
}

function panel(title, body) {
  return `
    <section class="panel">
      <h2>${escapeHtml(title)}</h2>
      <div class="evidence-board">${body}</div>
    </section>
  `;
}

function evidenceRow(label, text) {
  return `
    <article class="evidence-card">
      <div class="evidence-icon">${escapeHtml(label)}</div>
      <p>${escapeHtml(text)}</p>
    </article>
  `;
}

function renderAutoNotes(puzzle) {
  const manual = Object.entries(state.marks)
    .filter(([, value]) => value !== "unknown")
    .slice(0, 6)
    .map(([key, value]) => {
      const [, suspect, category, item] = key.split("|");
      return evidenceRow(value === "yes" ? "✓" : "×", `${suspect} ${value === "yes" ? "connects to" : "does not connect to"} ${item} (${category}).`);
    })
    .join("");
  const clueNotes = puzzle.clues.slice(0, 4).map((clue) => evidenceRow(clue.positive ? "✓" : "×", clue.note)).join("");
  return manual || clueNotes;
}

function renderClues(puzzle) {
  return `
    <section class="panel">
      <h2>Logic clues</h2>
      <div class="clue-list">
        ${puzzle.clues
          .map(
            (clue) => `
              <article class="clue-row">
                <strong class="clue-number">${clue.number}</strong>
                <p>${escapeHtml(clue.text)}</p>
                <span class="check-mark">✓</span>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderGrid(puzzle) {
  const suspects = puzzle.categories[0].items;
  const groups = puzzle.categories.slice(1);
  return `
    <section class="panel">
      <h2>Evidence Board</h2>
      <div class="grid-wrap">
        <table class="logic-grid" aria-label="Logic grid">
          <colgroup>
            <col class="suspect-col" />
            ${groups.map((group) => group.items.map(() => `<col class="mark-col" />`).join("")).join("")}
          </colgroup>
          <thead>
            <tr class="group-header">
              <th rowspan="2">Suspects</th>
              ${groups.map((group) => `<th colspan="${group.items.length}">${escapeHtml(group.name)}</th>`).join("")}
            </tr>
            <tr>
              ${groups
                .map((group) =>
                  group.items.map((item) => `<th class="col-header"><span>${escapeHtml(item)}</span></th>`).join("")
                )
                .join("")}
            </tr>
          </thead>
          <tbody>
            ${suspects
              .map(
                (suspect) => `
                  <tr>
                    <th class="row-head">${escapeHtml(suspect)}</th>
                    ${groups
                      .map((group) =>
                        group.items
                          .map((item) => {
                            const key = markKey(suspect, group.name, item);
                            const value = state.marks[key] || "unknown";
                            return `<td><button class="cell-button ${value}" type="button" data-action="cycle-cell" data-key="${escapeHtml(key)}" aria-label="${escapeHtml(`${suspect}, ${group.name}, ${item}: ${value}`)}">${markSymbol(value)}</button></td>`;
                          })
                          .join("")
                      )
                      .join("")}
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderAssistant(puzzle) {
  const message = puzzle.notebook.hints[state.hintIndex % puzzle.notebook.hints.length];
  return `
    <section class="panel assistant-card">
      <h2>AI Detective Assistant</h2>
      <p>Never reveals the answer. It only points at reasoning you may have missed.</p>
      <div class="assistant-message">${escapeHtml(message)}</div>
      <div class="assistant-actions">
        <button class="ghost-button" type="button" data-action="assistant-hint">Ask for a nudge</button>
        <button class="ghost-button" type="button" data-action="check-grid">Check grid</button>
      </div>
    </section>
  `;
}

function renderProgressPanel(puzzle) {
  const stats = getProgressStats(puzzle);
  const tone = stats.contradictions ? "danger" : stats.progress >= 100 ? "success" : "";
  return `
    <section class="panel progress-card ${tone}">
      <div class="progress-card-head">
        <h2>Case progress</h2>
        <strong>${stats.progress}%</strong>
      </div>
      <div class="progress-meter" aria-label="Case progress"><span style="width:${stats.progress}%"></span></div>
      <dl class="progress-stats">
        <div><dt>Grid marks</dt><dd>${stats.marked}/${stats.total}</dd></div>
        <div><dt>Final answer</dt><dd>${stats.finalFilled}/4</dd></div>
        <div><dt>Conflicts</dt><dd>${stats.contradictions}</dd></div>
      </dl>
    </section>
  `;
}

function renderFinalAnswer(puzzle) {
  const [suspects, locations, evidence, times] = puzzle.categories;
  const result = state.result;
  return `
    <section class="panel final-form">
      <h2>Final deduction</h2>
      <div class="final-fields">
        ${selectField("culprit", "Who did it?", suspects.items)}
        ${selectField("location", "Where?", locations.items)}
        ${selectField("evidence", "Evidence?", evidence.items)}
        ${selectField("time", "When?", times.items)}
      </div>
      <button class="primary-button" type="button" data-action="validate-final">Validate</button>
      <div class="result-box ${result ? `show ${result.type}` : ""}" data-result aria-live="polite">${result ? escapeHtml(result.text) : ""}</div>
    </section>
  `;
}

function selectField(key, label, options) {
  return `
    <label class="field">
      <span>${escapeHtml(label)}</span>
      <select class="select-field" data-final="${key}">
        <option value="">Select</option>
        ${options.map((item) => `<option value="${escapeHtml(item)}" ${state.final[key] === item ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}
      </select>
    </label>
  `;
}

function renderSharePanel(puzzle) {
  const text = shareText(puzzle, getSolvedSet().has(puzzleSolveKey(puzzle)));
  return `
    <section class="panel">
      <h2>Share</h2>
      <p>Send today's case to friends on socials, iMessage, or WhatsApp.</p>
      <div class="share-row">
        <button class="share-button" type="button" data-action="share">Share</button>
        <a class="share-button" href="sms:&body=${encodeURIComponent(text)}">iMessage</a>
        <a class="share-button" href="https://wa.me/?text=${encodeURIComponent(text)}" target="_blank" rel="noreferrer">WhatsApp</a>
      </div>
    </section>
  `;
}

function renderToast() {
  return `<div class="toast ${state.toast ? "show" : ""}" role="status" aria-live="polite">${escapeHtml(state.toast)}</div>`;
}

function renderBottomActions() {
  return `
    <div class="bottom-actions" aria-label="Puzzle actions">
      <button type="button" data-action="set-tab" data-tab="notes">Notes</button>
      <button type="button" data-action="reset-grid">Reset</button>
      <button type="button" data-action="assistant-hint">Nudge</button>
      <button type="button" data-action="share">Share</button>
    </div>
  `;
}

function renderGenerator() {
  const generated = buildPuzzle(state.generator.seed, state.generator.packId);
  const solutionCount = countSolutions(generated, generated.clues, 2);
  app.innerHTML = `
    <section class="screen" id="generator">
      <div class="case-layout">
        <section class="case-file">
          <div class="story-section">
            <p class="case-kicker">Generator</p>
            <h1>Build a mystery</h1>
            <p>Create deterministic cases for Zaney Logic. Each generated case is checked by the solver before it can be played.</p>
          </div>
          <img class="case-photo" src="${escapeHtml(generated.image)}" alt="${escapeHtml(`${generated.pack} evidence photograph`)}" />
        </section>
        ${renderAdSlot()}
        <section class="generator-card">
          <h2>Generator controls</h2>
          <div class="generator-controls">
            <label class="field">
              <span>Pack</span>
              <select class="select-field" data-generator="packId">
                ${PACKS.map((pack) => `<option value="${pack.id}" ${state.generator.packId === pack.id ? "selected" : ""}>${pack.name}</option>`).join("")}
              </select>
            </label>
            <label class="field">
              <span>Seed</span>
              <input class="text-field" inputmode="numeric" data-generator="seed" value="${state.generator.seed}" />
            </label>
            <label class="field">
              <span>Difficulty</span>
              <select class="select-field" disabled>
                <option>MVP balanced</option>
              </select>
            </label>
          </div>
          <div class="mode-row" style="margin-top:12px">
            <button class="primary-button" type="button" data-action="generate-case">Generate</button>
            <button class="ghost-button" type="button" data-action="load-generated" data-seed="${generated.seed}" data-pack="${generated.packId}">Play this case</button>
          </div>
        </section>
        <section class="generator-card">
          <h2>${escapeHtml(generated.title)}</h2>
          <p>${escapeHtml(generated.story)}</p>
          <ul class="validation-list">
            <li>Unique solution checked: ${solutionCount === 1 ? "passed" : "failed"}</li>
            <li>Final answer validation ready</li>
            <li>Shareable seed: ${generated.id}</li>
            <li>Catalog audit target: 5,000 daily cases</li>
          </ul>
        </section>
        ${renderClues(generated)}
      </div>
    </section>
  `;
}

function renderPacks() {
  app.innerHTML = `
    <section class="screen" id="packs">
      <section class="case-file">
        <div class="story-section">
          <p class="case-kicker">Logic Grid Mysteries</p>
          <h1>Mystery packs</h1>
          <p>Every pack follows the same structure: introduction, evidence, witness statements, logic clues, final deduction, and ending.</p>
        </div>
        <img class="case-photo" src="assets/cases/detective-agency.jpg" alt="Detective agency evidence photograph" />
      </section>
      <div class="pack-grid" style="margin-top:14px">
        ${PACKS.map(
          (pack, index) => `
            <article class="pack-card">
              <img class="pack-photo" src="assets/cases/${pack.id}.jpg" alt="${escapeHtml(`${pack.name} evidence photograph`)}" />
              <strong>${escapeHtml(pack.name)}</strong>
              <p>${escapeHtml(pack.intro)}</p>
              <button class="ghost-button" type="button" data-action="pack-case" data-pack="${pack.id}" data-seed="${index + 1}">Try pack</button>
            </article>
          `
        ).join("")}
      </div>
    </section>
  `;
}

function handleClick(event) {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;

  if (action === "toggle-menu") {
    menu.hidden = !menu.hidden;
  }
  if (action === "set-tab") {
    state.activeTab = target.dataset.tab;
    renderGame((window.location.hash || "#daily") === "#daily");
  }
  if (action === "cycle-cell") {
    cycleCell(target.dataset.key);
    renderGame((window.location.hash || "#daily") === "#daily");
  }
  if (action === "reset-grid") {
    state.marks = {};
    state.result = null;
    renderGame((window.location.hash || "#daily") === "#daily");
  }
  if (action === "assistant-hint") {
    state.hintIndex += 1;
    renderGame((window.location.hash || "#daily") === "#daily");
  }
  if (action === "check-grid") {
    checkGrid();
  }
  if (action === "validate-final") {
    validateFinal();
  }
  if (action === "share") {
    shareCurrent();
  }
  if (action === "generate-case") {
    state.generator.seed = normalizeSeed(state.generator.seed + 1);
    renderGenerator();
  }
  if (action === "load-generated") {
    window.location.hash = `#play-${target.dataset.seed}-${target.dataset.pack}`;
  }
  if (action === "pack-case") {
    state.generator.packId = target.dataset.pack;
    state.generator.seed = Number(target.dataset.seed);
    window.location.hash = "#generator";
  }
}

function handleChange(event) {
  const finalKey = event.target.dataset.final;
  if (finalKey) {
    state.final[finalKey] = event.target.value;
    state.result = null;
    renderGame((window.location.hash || "#daily") === "#daily");
    return;
  }
  const generatorKey = event.target.dataset.generator;
  if (generatorKey) {
    state.generator[generatorKey] = generatorKey === "seed" ? normalizeSeed(event.target.value) : event.target.value;
    renderGenerator();
  }
}

function cycleCell(key) {
  const current = state.marks[key] || "unknown";
  const next = current === "unknown" ? "no" : current === "no" ? "yes" : "unknown";
  state.marks[key] = next;
  state.result = null;
  if (next === "yes") {
    const [, suspect, category, item] = key.split("|");
    for (const groupItem of state.puzzle.categories.find((cat) => cat.name === category).items) {
      const sibling = markKey(suspect, category, groupItem);
      if (sibling !== key && state.marks[sibling] !== "yes") state.marks[sibling] = "no";
    }
    for (const otherSuspect of state.puzzle.categories[0].items) {
      const sibling = markKey(otherSuspect, category, item);
      if (sibling !== key && state.marks[sibling] !== "yes") state.marks[sibling] = "no";
    }
  }
}

function validateFinal() {
  const solution = state.puzzle.solution;
  const filled = ["culprit", "location", "evidence", "time"].filter((key) => state.final[key]).length;
  if (filled < 4) {
    state.result = { type: "fail", text: "Complete all four final deduction fields before validating." };
    renderGame((window.location.hash || "#daily") === "#daily");
    return;
  }
  const correct = ["culprit", "location", "evidence", "time"].every((key) => state.final[key] === solution[key]);
  if (correct) {
    applySolutionMarks(state.puzzle);
    const newlySolved = markSolved(state.puzzle);
    state.result = {
      type: "success",
      text: `${state.puzzle.ending} Case closed.${newlySolved ? " Your rank progress has been updated." : " This case was already closed."}`
    };
    state.toast = newlySolved ? "Case closed. Rank updated." : "Case already closed.";
  } else {
    state.result = { type: "fail", text: "Not quite. The assistant recommends comparing two more clues before accusing anyone." };
    state.toast = "";
  }
  renderGame((window.location.hash || "#daily") === "#daily");
}

function checkGrid() {
  const wrong = Object.entries(state.marks).find(([key, value]) => {
    if (value === "unknown") return false;
    const [, suspect, category, item] = key.split("|");
    const isTrue = state.puzzle.assignment[suspect][category] === item;
    return value === "yes" ? !isTrue : isTrue;
  });
  const assistant = document.querySelector(".assistant-message");
  if (!assistant) return;
  assistant.textContent = wrong
    ? "One mark conflicts with the case file. Re-check the clue that created your latest connection."
    : "No conflicts found in your current grid. Keep going.";
}

async function shareCurrent() {
  const puzzle = state.puzzle ?? buildPuzzle(dailySeed());
  const solved = getSolvedSet().has(puzzleSolveKey(puzzle));
  const text = shareText(puzzle, solved);
  if (navigator.share) {
    await navigator.share({ title: "Zaney Logic", text, url: shareUrl(puzzle) }).catch(() => {});
    showToast("Share sheet opened.");
  } else {
    await navigator.clipboard?.writeText(`${text} ${shareUrl(puzzle)}`).catch(() => {});
    showToast("Share link copied.");
  }
}

function shareText(puzzle, solved = false) {
  return solved
    ? `I closed Zaney Logic ${puzzle.id}: ${puzzle.title}. Can you solve this logic grid mystery?`
    : `Zaney Logic ${puzzle.id}: ${puzzle.title}. Can you solve this logic grid mystery?`;
}

function shareUrl(puzzle) {
  const url = new URL(window.location.href);
  url.searchParams.set("case", String(puzzle.seed));
  url.searchParams.set("pack", puzzle.packId);
  url.hash = "";
  return url.toString();
}

function markSolved(puzzle) {
  const key = puzzleSolveKey(puzzle);
  const solved = getSolvedSet();
  if (solved.has(key)) return false;
  solved.add(key);
  localStorage.setItem(solvedKey, JSON.stringify([...solved]));
  localStorage.setItem(rankKey, String(solved.size));
  return true;
}

function getSolvedSet() {
  try {
    return new Set(JSON.parse(localStorage.getItem(solvedKey) || "[]"));
  } catch {
    return new Set();
  }
}

function puzzleSolveKey(puzzle) {
  return `${puzzle.packId}:${puzzle.id}`;
}

function getProgressStats(puzzle) {
  const total = puzzle.categories[0].items.length * puzzle.categories.slice(1).reduce((sum, category) => sum + category.items.length, 0);
  const marked = Object.values(state.marks).filter((value) => value && value !== "unknown").length;
  const finalFilled = ["culprit", "location", "evidence", "time"].filter((key) => state.final[key]).length;
  const contradictions = countContradictions(puzzle);
  const closed = state.result?.type === "success" || getSolvedSet().has(puzzleSolveKey(puzzle));
  const progress = closed ? 100 : Math.min(100, Math.round((marked / total) * 65 + (finalFilled / 4) * 35));
  return { total, marked, finalFilled, contradictions, progress };
}

function countContradictions(puzzle) {
  return Object.entries(state.marks).filter(([key, value]) => {
    if (!value || value === "unknown") return false;
    const [, suspect, category, item] = key.split("|");
    const isTrue = puzzle.assignment[suspect]?.[category] === item;
    return value === "yes" ? !isTrue : isTrue;
  }).length;
}

function applySolutionMarks(puzzle) {
  for (const suspect of puzzle.categories[0].items) {
    for (const category of puzzle.categories.slice(1)) {
      for (const item of category.items) {
        state.marks[markKey(suspect, category.name, item)] = puzzle.assignment[suspect]?.[category.name] === item ? "yes" : "no";
      }
    }
  }
}

function showToast(message) {
  state.toast = message;
  renderGame((window.location.hash || "#daily") === "#daily");
  window.setTimeout(() => {
    if (state.toast === message) {
      state.toast = "";
      renderGame((window.location.hash || "#daily") === "#daily");
    }
  }, 2200);
}

function renderAdSlot() {
  return adTemplate.innerHTML;
}

function markKey(suspect, category, item) {
  return `mark|${suspect}|${category}|${item}`;
}

function markSymbol(value) {
  if (value === "yes") return "✓";
  if (value === "no") return "×";
  return "•";
}

function titleCase(value) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

init();
