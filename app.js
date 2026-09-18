const STORAGE_KEY = "indoorGrowTrackerData";

const phaseChecklists = {
  "Preparação": [
    ["prep-power", "Verificar a parte elétrica", "Tomadas, extensões e equipamentos sem aquecimento anormal."],
    ["prep-cables", "Conferir cabos e conexões", "Tudo seco, bem fixado e longe de água."],
    ["prep-climate", "Testar o termo-higrômetro", "Faça uma leitura inicial e registre o horário."],
    ["prep-exhaust", "Testar a exaustão", "Observe o fluxo de ar e qualquer ruído fora do normal."],
    ["prep-air", "Testar a circulação interna", "Confirme que o equipamento está firme e funcionando."],
  ],
  "Germinação": [
    ["germ-date", "Registrar o início da fase", "Anote data e horário para manter a linha do tempo."],
    ["germ-climate", "Medir temperatura e umidade", "Salve a leitura junto com o horário."],
    ["germ-environment", "Observar o ambiente", "Registre qualquer mudança visível sem alterar a rotina automaticamente."],
    ["germ-equipment", "Conferir equipamentos e timer", "Confirme que tudo segue ligado e seguro."],
    ["germ-review", "Revisar o registro do dia", "Confirme que horário, medições e observações foram salvos."],
  ],
  "Muda": [
    ["seed-climate", "Medir temperatura e umidade", "Registre os valores e o horário."],
    ["seed-look", "Observar aparência geral", "Anote cor, postura e qualquer mudança percebida."],
    ["seed-equipment", "Conferir ventilação e equipamentos", "Verifique funcionamento e ruídos fora do normal."],
    ["seed-record", "Atualizar o registro diário", "Preencha medições e observações sem deixar campos importantes para depois."],
    ["seed-review", "Revisar o registro do dia", "Confirme que medições e observações foram salvas."],
  ],
  "Vegetativo": [
    ["veg-climate", "Medir temperatura e umidade", "Compare somente com as faixas que você cadastrou."],
    ["veg-light", "Registrar a leitura de luz", "Anote o valor e mantenha o ponto de medição consistente."],
    ["veg-look", "Fazer inspeção visual", "Registre alterações de cor, formato ou postura."],
    ["veg-equipment", "Conferir exaustão e circulação", "Verifique funcionamento e segurança."],
    ["veg-review", "Comparar com o dia anterior", "Observe a evolução das medições e das anotações."],
  ],
  "Início da floração": [
    ["flower-start-climate", "Medir temperatura e umidade", "Registre os valores e o horário."],
    ["flower-start-transition", "Registrar sinais da transição", "Descreva apenas o que consegue observar visualmente."],
    ["flower-start-equipment", "Conferir equipamentos", "Verifique iluminação, timer, exaustão e circulação."],
    ["flower-start-notes", "Atualizar as observações", "Anote qualquer mudança percebida desde o último registro."],
    ["flower-start-review", "Revisar o registro do dia", "Confirme que nenhuma ocorrência ficou sem anotação."],
  ],
  "Meio da floração": [
    ["flower-mid-climate", "Medir temperatura e umidade", "Registre valores e horário."],
    ["flower-mid-look", "Fazer inspeção visual", "Anote mudanças relevantes sem depender apenas da memória."],
    ["flower-mid-equipment", "Conferir o ambiente", "Verifique equipamentos, circulação e sinais de umidade acumulada."],
    ["flower-mid-record", "Atualizar o histórico", "Preencha as medições disponíveis."],
    ["flower-mid-review", "Comparar com os últimos dias", "Observe a evolução das medições registradas."],
  ],
  "Finalização": [
    ["finish-climate", "Medir temperatura e umidade", "Registre os valores e o horário."],
    ["finish-look", "Documentar a aparência", "Anote sinais visuais e mudanças desde a última observação."],
    ["finish-equipment", "Conferir equipamentos", "Observe o funcionamento geral e a segurança elétrica."],
    ["finish-history", "Revisar os últimos registros", "Compare os dados sem alterar a rotina automaticamente."],
    ["finish-summary", "Completar o resumo do dia", "Registre as mudanças e ocorrências percebidas."],
  ],
  "Colheita": [
    ["harvest-date", "Registrar data e horário", "Marque o início desta fase no histórico."],
    ["harvest-climate", "Medir o ambiente", "Registre temperatura e umidade."],
    ["harvest-equipment", "Conferir segurança e equipamentos", "Verifique organização, energia e circulação de ar."],
    ["harvest-notes", "Anotar observações", "Documente o estado visual e qualquer ocorrência."],
    ["harvest-review", "Revisar o histórico", "Confirme que data, horário e observações foram registrados."],
  ],
  "Secagem e trim": [
    ["dry-climate", "Medir temperatura e umidade", "Registre os valores sempre no mesmo horário."],
    ["dry-air", "Conferir circulação e exaustão", "Observe funcionamento e ruídos anormais."],
    ["dry-dark", "Conferir o ambiente", "Registre qualquer alteração de luz, odor ou umidade percebida."],
    ["dry-notes", "Atualizar o diário", "Descreva a evolução observada."],
    ["dry-review", "Comparar com o dia anterior", "Observe e registre a evolução percebida."],
  ],
  "Cura": [
    ["cure-climate", "Medir temperatura e umidade", "Registre os valores e o horário."],
    ["cure-container", "Inspecionar os recipientes", "Observe vedação, limpeza e qualquer alteração visível."],
    ["cure-record", "Atualizar o histórico", "Anote as verificações feitas hoje."],
    ["cure-review", "Revisar os dados recentes", "Compare com os registros anteriores."],
    ["cure-summary", "Completar o resumo do dia", "Confirme que as verificações foram registradas."],
  ],
};

const phaseTimeline = [
  { from: 1, to: 4, phase: "Germinação" },
  { from: 5, to: 19, phase: "Muda" },
  { from: 20, to: 34, phase: "Vegetativo" },
  { from: 35, to: 42, phase: "Início da floração" },
  { from: 43, to: 56, phase: "Meio da floração" },
  { from: 57, to: 70, phase: "Finalização" },
  { from: 71, to: 77, phase: "Colheita" },
  { from: 78, to: 91, phase: "Secagem e trim" },
  { from: 92, to: Infinity, phase: "Cura" },
];

const phaseGuidance = {
  "Preparação": "Defina a data inicial e confirme que o ambiente e os instrumentos estão prontos para registrar dados.",
  "Germinação": "Acompanhe o início da linha do tempo, registre o ambiente e documente mudanças visíveis.",
  "Muda": "Observe a aparência geral e mantenha medições consistentes no mesmo local e horário.",
  "Vegetativo": "Priorize consistência nos registros ambientais, inspeção visual e funcionamento dos equipamentos.",
  "Início da floração": "Registre sinais visuais da transição e acompanhe cuidadosamente o ambiente.",
  "Meio da floração": "Mantenha o histórico diário completo e observe mudanças sem depender apenas da memória.",
  "Finalização": "Compare os registros recentes e documente a evolução visual e ambiental.",
  "Colheita": "Marque a data, registre o ambiente e documente o estado geral desta etapa.",
  "Secagem e trim": "Acompanhe o ambiente em horários consistentes e registre qualquer mudança percebida.",
  "Cura": "Mantenha o histórico de verificações, ambiente e observações visuais.",
};

const defaultState = {
  version: 3,
  settings: {
    phase: "Preparação",
    startDate: "",
  },
  logs: {},
  checks: {},
  materials: [],
};

let state = loadState();
let calendarCursor = new Date();
let selectedDate = localDateKey(new Date());

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function localDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ? {
      ...structuredClone(defaultState),
      ...saved,
      settings: { ...defaultState.settings, ...(saved.settings || {}) },
      logs: saved.logs || {},
      checks: saved.checks || {},
      materials: saved.materials || [],
    } : structuredClone(defaultState);
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatDate(dateOrKey, options = {}) {
  const date = typeof dateOrKey === "string" ? new Date(`${dateOrKey}T12:00:00`) : dateOrKey;
  return new Intl.DateTimeFormat("pt-BR", options).format(date);
}

function renderHeader() {
  const now = new Date();
  const day = getDayNumber();
  const phase = getAutomaticPhase(day);
  $("#today-title").textContent = formatDate(now, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  $("#current-phase").textContent = phase;
  $("#day-count").textContent = day > 0 ? `Dia ${day}` : "Preparação";
}

function getDayNumber() {
  if (!state.settings.startDate) return 0;
  const start = new Date(`${state.settings.startDate}T12:00:00`);
  const today = new Date(`${localDateKey(new Date())}T12:00:00`);
  return Math.floor((today - start) / 86400000) + 1;
}

function getAutomaticPhase(day) {
  if (day < 1) return "Preparação";
  return phaseTimeline.find((item) => day >= item.from && day <= item.to)?.phase || "Cura";
}

function renderDailyPlan() {
  const day = getDayNumber();
  const phase = getAutomaticPhase(day);
  $("#plan-day").textContent = day > 0 ? `Dia ${day}` : "Antes do início";
  $("#plan-phase").textContent = phase;
  $("#plan-expectation").textContent = phaseGuidance[phase];
  const measures = [
    "Registrar temperatura e umidade com data e horário.",
    "Confirmar o funcionamento da exaustão, circulação e timer.",
    "Anotar alterações visuais ou ocorrências no registro diário.",
    "Comparar os dados com os registros anteriores e com documentação confiável.",
  ];
  $("#plan-measures").innerHTML = measures.map((item) => `<li>${item}</li>`).join("");
}

function latestLog() {
  return Object.values(state.logs).sort((a, b) => `${b.date}T${b.time || "00:00"}`.localeCompare(`${a.date}T${a.time || "00:00"}`))[0];
}

function numberOrDash(value) {
  return value === "" || value == null ? "—" : value;
}

function interpret(log) {
  if (!log) return { label: "Sem dados", className: "", text: "Registre as primeiras medições para iniciar o histórico." };
  const notes = [];
  if (!log.exhaustion) notes.push("exaustão não confirmada");
  if (!log.circulation) notes.push("circulação não confirmada");
  if (notes.length) return { label: "Revisar", className: "is-attention", text: `${notes.join("; ")}.` };
  return {
    label: "Registrado",
    className: "is-good",
    text: "Registro ambiental salvo. Compare a evolução com os dias anteriores.",
  };
}

function renderMetrics() {
  const log = latestLog();
  $("#metric-temp").textContent = numberOrDash(log?.temperature);
  $("#metric-humidity").textContent = numberOrDash(log?.humidity);
  $("#metric-light").textContent = numberOrDash(log?.light);
  const result = interpret(log);
  const status = $("#reading-status");
  status.textContent = result.label;
  status.className = `status-pill ${result.className}`.trim();
  $("#interpretation").textContent = result.text;
}

function renderChecklist() {
  const key = localDateKey(new Date());
  const checked = state.checks[key] || {};
  const automaticPhase = getAutomaticPhase(getDayNumber());
  const phase = phaseChecklists[automaticPhase] ? automaticPhase : "Preparação";
  const checklistItems = phaseChecklists[phase].map(([id, title, detail]) => ({ id, title, detail }));
  $("#checklist-title").textContent = `Checklist · ${phase}`;
  $("#checklist").innerHTML = checklistItems.map((item) => `
    <label class="check-row">
      <input type="checkbox" data-check="${item.id}" ${checked[item.id] ? "checked" : ""} />
      <span class="check-copy"><strong>${item.title}</strong><small>${item.detail}</small></span>
    </label>
  `).join("");
  $$("[data-check]").forEach((input) => input.addEventListener("change", () => {
    state.checks[key] ||= {};
    state.checks[key][input.dataset.check] = input.checked;
    saveState();
    updateProgress(checklistItems);
  }));
  updateProgress(checklistItems);
}

function updateProgress(items = phaseChecklists[getAutomaticPhase(getDayNumber())] || phaseChecklists["Preparação"]) {
  const key = localDateKey(new Date());
  const ids = items.map((item) => Array.isArray(item) ? item[0] : item.id);
  const count = ids.filter((id) => state.checks[key]?.[id]).length;
  $("#check-progress").textContent = `${count}/${ids.length}`;
  $("#check-progress-bar").style.width = `${(count / ids.length) * 100}%`;
}

function renderCalendar() {
  const year = calendarCursor.getFullYear();
  const month = calendarCursor.getMonth();
  $("#month-label").textContent = formatDate(calendarCursor, { month: "long", year: "numeric" });
  const first = new Date(year, month, 1);
  const gridStart = new Date(year, month, 1 - first.getDay());
  const today = localDateKey(new Date());
  const days = [];
  for (let i = 0; i < 42; i += 1) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    const key = localDateKey(date);
    const classes = ["calendar-day"];
    if (date.getMonth() !== month) classes.push("other");
    if (key === today) classes.push("today");
    if (key === selectedDate) classes.push("selected");
    if (state.logs[key]) classes.push("has-log");
    days.push(`<button class="${classes.join(" ")}" type="button" data-date="${key}" aria-label="${formatDate(key, { dateStyle: "full" })}">${date.getDate()}</button>`);
  }
  $("#calendar-grid").innerHTML = days.join("");
  $$("[data-date]").forEach((button) => button.addEventListener("click", () => {
    selectedDate = button.dataset.date;
    renderCalendar();
    renderSelectedDay();
  }));
}

function renderSelectedDay() {
  const log = state.logs[selectedDate];
  $("#selected-day-title").textContent = formatDate(selectedDate, { weekday: "long", day: "numeric", month: "long" });
  if (!log) {
    $("#selected-day-summary").textContent = "Nenhum registro salvo nesta data.";
    return;
  }
  const parts = [];
  if (log.temperature !== "") parts.push(`${log.temperature} °C`);
  if (log.humidity !== "") parts.push(`${log.humidity}% de umidade`);
  if (log.light !== "") parts.push(`${log.light} PPFD`);
  $("#selected-day-summary").textContent = `${parts.join(" · ") || "Registro sem medições"}${log.notes ? ` — ${log.notes}` : ""}`;
}

function renderHistory() {
  const logs = Object.values(state.logs).sort((a, b) => `${b.date}T${b.time || "00:00"}`.localeCompare(`${a.date}T${a.time || "00:00"}`));
  if (!logs.length) {
    $("#history-list").innerHTML = '<div class="empty-state">Nenhum registro ainda.<br />Use “Registrar hoje” para começar.</div>';
    return;
  }
  $("#history-list").innerHTML = logs.map((log) => {
    const metrics = [
      log.temperature !== "" ? `${log.temperature} °C` : "",
      log.humidity !== "" ? `${log.humidity}% UR` : "",
      log.light !== "" ? `${log.light} PPFD` : "",
      log.ph !== "" ? `pH ${log.ph}` : "",
      log.ec ? `EC/PPM ${escapeHtml(log.ec)}` : "",
    ].filter(Boolean);
    return `<article class="history-item">
      <header><h3>${formatDate(log.date, { weekday: "short", day: "numeric", month: "short" })}</h3><time>${log.time || "—"}</time></header>
      <div class="history-metrics">${metrics.map((metric) => `<span>${metric}</span>`).join("") || "<span>Sem medições</span>"}</div>
      ${log.notes ? `<p>${escapeHtml(log.notes)}</p>` : ""}
    </article>`;
  }).join("");
}

function renderSettings() {
  const form = $("#settings-form");
  form.startDate.value = state.settings.startDate || "";
}

function renderMaterials() {
  const list = $("#materials-list");
  const total = state.materials.length;
  const done = state.materials.filter((item) => item.done).length;
  $("#material-progress").textContent = `${done}/${total}`;
  $("#material-progress-bar").style.width = total ? `${(done / total) * 100}%` : "0%";
  if (!total) {
    list.innerHTML = '<div class="empty-state">Nenhum material cadastrado.</div>';
    return;
  }
  list.innerHTML = state.materials.map((item) => `
    <div class="material-row ${item.done ? "is-done" : ""}">
      <input class="material-check" type="checkbox" data-material-check="${item.id}" ${item.done ? "checked" : ""} aria-label="Marcar ${escapeHtml(item.name)} como concluído" />
      <span class="material-name">${escapeHtml(item.name)}</span>
      <button class="material-delete" type="button" data-material-delete="${item.id}" aria-label="Excluir ${escapeHtml(item.name)}">×</button>
    </div>
  `).join("");
  $$('[data-material-check]').forEach((input) => input.addEventListener('change', () => {
    const item = state.materials.find((entry) => entry.id === input.dataset.materialCheck);
    if (item) item.done = input.checked;
    saveState();
    renderMaterials();
  }));
  $$('[data-material-delete]').forEach((button) => button.addEventListener('click', () => {
    state.materials = state.materials.filter((entry) => entry.id !== button.dataset.materialDelete);
    saveState();
    renderMaterials();
  }));
}

function switchView(target) {
  $$(".view").forEach((view) => {
    const active = view.dataset.view === target;
    view.hidden = !active;
    view.classList.toggle("is-active", active);
  });
  $$(".nav-item").forEach((button) => button.classList.toggle("is-active", button.dataset.target === target));
  if (target === "calendar") { renderCalendar(); renderSelectedDay(); }
  if (target === "history") renderHistory();
  if (target === "materials") renderMaterials();
  if (target === "settings") renderSettings();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openEntry(date = localDateKey(new Date())) {
  const dialog = $("#entry-dialog");
  const form = $("#entry-form");
  const log = state.logs[date];
  form.reset();
  form.date.value = date;
  form.time.value = log?.time || new Date().toTimeString().slice(0, 5);
  ["temperature", "humidity", "light", "ph", "ec", "notes"].forEach((name) => { form[name].value = log?.[name] ?? ""; });
  form.exhaustion.checked = Boolean(log?.exhaustion);
  form.circulation.checked = Boolean(log?.circulation);
  dialog.showModal();
}

function saveEntry(form) {
  const data = new FormData(form);
  const date = data.get("date");
  state.logs[date] = {
    date,
    time: data.get("time"),
    temperature: data.get("temperature"),
    humidity: data.get("humidity"),
    light: data.get("light"),
    ph: data.get("ph"),
    ec: data.get("ec"),
    exhaustion: data.get("exhaustion") === "on",
    circulation: data.get("circulation") === "on",
    notes: data.get("notes").trim(),
    updatedAt: new Date().toISOString(),
  };
  saveState();
  renderAll();
  showToast("Registro salvo neste aparelho.");
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `grow-tracker-backup-${localDateKey(new Date())}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (!parsed || typeof parsed !== "object") throw new Error();
      state = {
        ...structuredClone(defaultState),
        ...parsed,
        settings: { ...defaultState.settings, ...(parsed.settings || {}) },
        logs: parsed.logs || {},
      checks: parsed.checks || {},
      materials: parsed.materials || [],
      };
      saveState();
      renderAll();
      showToast("Backup importado com sucesso.");
    } catch {
      showToast("Não foi possível importar esse arquivo.");
    }
  };
  reader.readAsText(file);
}

function escapeHtml(text) {
  const node = document.createElement("div");
  node.textContent = String(text);
  return node.innerHTML;
}

let toastTimer;
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function renderAll() {
  renderHeader();
  renderDailyPlan();
  renderMetrics();
  renderChecklist();
  renderCalendar();
  renderSelectedDay();
  renderHistory();
  renderSettings();
  renderMaterials();
}

$("#open-entry").addEventListener("click", () => openEntry());
$$('.nav-item').forEach((button) => button.addEventListener("click", () => switchView(button.dataset.target)));
$("#prev-month").addEventListener("click", () => { calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() - 1, 1); renderCalendar(); });
$("#next-month").addEventListener("click", () => { calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() + 1, 1); renderCalendar(); });

$("#entry-form").addEventListener("submit", (event) => {
  if (event.submitter?.value === "cancel") return;
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  saveEntry(event.currentTarget);
  $("#entry-dialog").close();
});

$("#entry-dialog").addEventListener("click", (event) => {
  if (event.target === event.currentTarget) event.currentTarget.close();
});

$("#settings-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  state.settings.startDate = data.get("startDate");
  saveState();
  renderAll();
  showToast("Ajustes salvos.");
});

$("#material-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = $("#material-input");
  const name = input.value.trim();
  if (!name) return;
  state.materials.unshift({
    id: crypto.randomUUID ? crypto.randomUUID() : `material-${Date.now()}`,
    name,
    done: false,
    createdAt: new Date().toISOString(),
  });
  saveState();
  input.value = "";
  renderMaterials();
  showToast("Material adicionado.");
});

$("#export-data").addEventListener("click", exportData);
$("#import-data").addEventListener("change", (event) => {
  const [file] = event.target.files;
  if (file) importData(file);
  event.target.value = "";
});

renderAll();
