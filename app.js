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
    ["germ-photo", "Fazer o registro fotográfico", "Fotografe do mesmo ângulo para facilitar comparações."],
  ],
  "Muda": [
    ["seed-climate", "Medir temperatura e umidade", "Registre os valores e o horário."],
    ["seed-look", "Observar aparência geral", "Anote cor, postura e qualquer mudança percebida."],
    ["seed-equipment", "Conferir ventilação e equipamentos", "Verifique funcionamento e ruídos fora do normal."],
    ["seed-record", "Atualizar o registro diário", "Preencha medições e observações sem deixar campos importantes para depois."],
    ["seed-photo", "Adicionar a foto do dia", "Use enquadramento e distância semelhantes aos dias anteriores."],
  ],
  "Vegetativo": [
    ["veg-climate", "Medir temperatura e umidade", "Compare somente com as faixas que você cadastrou."],
    ["veg-light", "Registrar a leitura de luz", "Anote o valor e mantenha o ponto de medição consistente."],
    ["veg-look", "Fazer inspeção visual", "Registre alterações de cor, formato ou postura."],
    ["veg-equipment", "Conferir exaustão e circulação", "Verifique funcionamento e segurança."],
    ["veg-photo", "Adicionar a foto do dia", "Mantenha o mesmo ângulo sempre que possível."],
  ],
  "Início da floração": [
    ["flower-start-climate", "Medir temperatura e umidade", "Registre os valores e o horário."],
    ["flower-start-transition", "Registrar sinais da transição", "Descreva apenas o que consegue observar visualmente."],
    ["flower-start-equipment", "Conferir equipamentos", "Verifique iluminação, timer, exaustão e circulação."],
    ["flower-start-notes", "Atualizar as observações", "Anote qualquer mudança percebida desde o último registro."],
    ["flower-start-photo", "Adicionar a foto do dia", "Inclua uma visão geral e mantenha o enquadramento."],
  ],
  "Meio da floração": [
    ["flower-mid-climate", "Medir temperatura e umidade", "Registre valores e horário."],
    ["flower-mid-look", "Fazer inspeção visual", "Anote mudanças relevantes sem depender apenas da memória."],
    ["flower-mid-equipment", "Conferir o ambiente", "Verifique equipamentos, circulação e sinais de umidade acumulada."],
    ["flower-mid-record", "Atualizar o histórico", "Preencha as medições disponíveis."],
    ["flower-mid-photo", "Adicionar a foto do dia", "Use o mesmo ângulo das fotos anteriores."],
  ],
  "Finalização": [
    ["finish-climate", "Medir temperatura e umidade", "Registre os valores e o horário."],
    ["finish-look", "Documentar a aparência", "Anote sinais visuais e mudanças desde a última observação."],
    ["finish-equipment", "Conferir equipamentos", "Observe o funcionamento geral e a segurança elétrica."],
    ["finish-history", "Revisar os últimos registros", "Compare os dados sem alterar a rotina automaticamente."],
    ["finish-photo", "Adicionar uma foto detalhada", "Registre a visão geral e os detalhes que deseja acompanhar."],
  ],
  "Colheita": [
    ["harvest-date", "Registrar data e horário", "Marque o início desta fase no histórico."],
    ["harvest-climate", "Medir o ambiente", "Registre temperatura e umidade."],
    ["harvest-equipment", "Conferir segurança e equipamentos", "Verifique organização, energia e circulação de ar."],
    ["harvest-notes", "Anotar observações", "Documente o estado visual e qualquer ocorrência."],
    ["harvest-photo", "Fazer o registro fotográfico", "Salve uma foto geral antes de avançar."],
  ],
  "Secagem e trim": [
    ["dry-climate", "Medir temperatura e umidade", "Registre os valores sempre no mesmo horário."],
    ["dry-air", "Conferir circulação e exaustão", "Observe funcionamento e ruídos anormais."],
    ["dry-dark", "Conferir o ambiente", "Registre qualquer alteração de luz, odor ou umidade percebida."],
    ["dry-notes", "Atualizar o diário", "Descreva a evolução observada."],
    ["dry-photo", "Adicionar foto de acompanhamento", "Use o mesmo enquadramento para comparar os dias."],
  ],
  "Cura": [
    ["cure-climate", "Medir temperatura e umidade", "Registre os valores e o horário."],
    ["cure-container", "Inspecionar os recipientes", "Observe vedação, limpeza e qualquer alteração visível."],
    ["cure-record", "Atualizar o histórico", "Anote as verificações feitas hoje."],
    ["cure-review", "Revisar os dados recentes", "Compare com os registros anteriores."],
    ["cure-photo", "Adicionar foto de acompanhamento", "Mantenha iluminação e distância semelhantes."],
  ],
};

const PHOTO_DB_NAME = "indoorGrowTrackerPhotos";
const PHOTO_STORE = "photos";
let photos = [];
let photoUrls = [];
let viewerUrl = "";

const defaultState = {
  version: 2,
  settings: {
    phase: "Preparação",
    startDate: "",
    targets: { tempMin: "", tempMax: "", humidityMin: "", humidityMax: "" },
  },
  logs: {},
  checks: {},
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
      settings: { ...defaultState.settings, ...(saved.settings || {}), targets: { ...defaultState.settings.targets, ...(saved.settings?.targets || {}) } },
      logs: saved.logs || {},
      checks: saved.checks || {},
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
  $("#today-title").textContent = formatDate(now, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  $("#current-phase").textContent = state.settings.phase || "Não definida";
  if (state.settings.startDate) {
    const start = new Date(`${state.settings.startDate}T12:00:00`);
    const today = new Date(`${localDateKey(now)}T12:00:00`);
    const diff = Math.floor((today - start) / 86400000) + 1;
    $("#day-count").textContent = diff > 0 ? `Dia ${diff}` : "Preparação";
  } else {
    $("#day-count").textContent = "Preparação";
  }
}

function latestLog() {
  return Object.values(state.logs).sort((a, b) => `${b.date}T${b.time || "00:00"}`.localeCompare(`${a.date}T${a.time || "00:00"}`))[0];
}

function numberOrDash(value) {
  return value === "" || value == null ? "—" : value;
}

function interpret(log) {
  if (!log) return { label: "Sem dados", className: "", text: "Registre as primeiras medições para iniciar o histórico." };
  const t = state.settings.targets;
  const notes = [];
  const compare = (value, min, max, name) => {
    if (value === "" || value == null) return;
    const n = Number(value);
    if (min !== "" && n < Number(min)) notes.push(`${name} abaixo da faixa definida`);
    if (max !== "" && n > Number(max)) notes.push(`${name} acima da faixa definida`);
  };
  compare(log.temperature, t.tempMin, t.tempMax, "Temperatura");
  compare(log.humidity, t.humidityMin, t.humidityMax, "Umidade");
  if (!log.exhaustion) notes.push("exaustão não confirmada");
  if (!log.circulation) notes.push("circulação não confirmada");
  if (notes.length) return { label: "Revisar", className: "is-attention", text: `${notes.join("; ")}.` };
  const hasTargets = Object.values(t).some((value) => value !== "");
  return {
    label: hasTargets ? "Dentro da faixa" : "Registrado",
    className: "is-good",
    text: hasTargets ? "Os valores informados estão dentro das faixas que você definiu." : "Registro salvo. Defina faixas em Ajustes para ativar a comparação automática.",
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
  const phase = phaseChecklists[state.settings.phase] ? state.settings.phase : "Preparação";
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

function updateProgress(items = phaseChecklists[state.settings.phase] || phaseChecklists["Preparação"]) {
  const key = localDateKey(new Date());
  const ids = items.map((item) => Array.isArray(item) ? item[0] : item.id);
  const count = ids.filter((id) => state.checks[key]?.[id]).length;
  $("#check-progress").textContent = `${count}/${ids.length}`;
  $("#check-progress-bar").style.width = `${(count / ids.length) * 100}%`;
}

function openPhotoDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(PHOTO_DB_NAME, 1);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(PHOTO_STORE)) {
        database.createObjectStore(PHOTO_STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getPhotos() {
  const database = await openPhotoDatabase();
  return new Promise((resolve, reject) => {
    const request = database.transaction(PHOTO_STORE, "readonly").objectStore(PHOTO_STORE).getAll();
    request.onsuccess = () => {
      const result = request.result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      database.close();
      resolve(result);
    };
    request.onerror = () => reject(request.error);
  });
}

async function storePhoto(photo) {
  const database = await openPhotoDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(PHOTO_STORE, "readwrite");
    transaction.objectStore(PHOTO_STORE).put(photo);
    transaction.oncomplete = () => { database.close(); resolve(); };
    transaction.onerror = () => reject(transaction.error);
  });
}

function compressPhoto(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const maxSide = 1600;
      const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.naturalWidth * scale);
      canvas.height = Math.round(image.naturalHeight * scale);
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(objectUrl);
        blob ? resolve(blob) : reject(new Error("Falha ao processar a imagem"));
      }, "image/jpeg", .82);
    };
    image.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error("Imagem inválida")); };
    image.src = objectUrl;
  });
}

function clearPhotoUrls() {
  photoUrls.forEach((url) => URL.revokeObjectURL(url));
  photoUrls = [];
}

function photoDateLabel(photo) {
  return `${formatDate(photo.date, { day: "2-digit", month: "2-digit", year: "numeric" })} · ${photo.time}`;
}

async function renderPhotos() {
  try {
    photos = await getPhotos();
  } catch {
    photos = [];
  }
  clearPhotoUrls();
  const empty = $("#photo-empty");
  const main = $("#photo-main");
  const thumbnails = $("#photo-thumbnails");
  if (!photos.length) {
    empty.hidden = false;
    main.hidden = true;
    thumbnails.innerHTML = "";
    return;
  }
  empty.hidden = true;
  main.hidden = false;
  const mainUrl = URL.createObjectURL(photos[0].blob);
  photoUrls.push(mainUrl);
  $("#photo-main-image").src = mainUrl;
  $("#photo-main-meta").textContent = photoDateLabel(photos[0]);
  main.dataset.photoId = photos[0].id;
  thumbnails.innerHTML = photos.slice(0, 12).map((photo, index) => {
    const url = URL.createObjectURL(photo.blob);
    photoUrls.push(url);
    return `<button class="photo-thumb" type="button" data-photo-id="${photo.id}" aria-label="Ampliar foto de ${photoDateLabel(photo)}"><img src="${url}" alt="Miniatura ${index + 1}" /></button>`;
  }).join("");
  $$("[data-photo-id]", thumbnails).forEach((button) => button.addEventListener("click", () => openPhotoViewer(button.dataset.photoId)));
}

function openPhotoViewer(id) {
  const photo = photos.find((item) => item.id === id);
  if (!photo) return;
  if (viewerUrl) URL.revokeObjectURL(viewerUrl);
  viewerUrl = URL.createObjectURL(photo.blob);
  $("#photo-viewer-image").src = viewerUrl;
  $("#photo-viewer-meta").textContent = `${photoDateLabel(photo)} · ${photo.phase}`;
  $("#photo-viewer").showModal();
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
  form.phase.value = state.settings.phase || "";
  form.startDate.value = state.settings.startDate || "";
  Object.entries(state.settings.targets).forEach(([key, value]) => { form[key].value = value; });
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
        settings: { ...defaultState.settings, ...(parsed.settings || {}), targets: { ...defaultState.settings.targets, ...(parsed.settings?.targets || {}) } },
        logs: parsed.logs || {},
        checks: parsed.checks || {},
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
  renderMetrics();
  renderChecklist();
  renderCalendar();
  renderSelectedDay();
  renderHistory();
  renderSettings();
  renderPhotos();
}

$("#open-entry").addEventListener("click", () => openEntry());
$("#photo-main").addEventListener("click", (event) => openPhotoViewer(event.currentTarget.dataset.photoId));
$("#photo-input").addEventListener("change", async (event) => {
  const [file] = event.target.files;
  if (!file) return;
  try {
    showToast("Preparando a foto…");
    const blob = await compressPhoto(file);
    const now = new Date();
    await storePhoto({
      id: crypto.randomUUID ? crypto.randomUUID() : `photo-${Date.now()}`,
      blob,
      date: localDateKey(now),
      time: now.toTimeString().slice(0, 5),
      phase: state.settings.phase,
      createdAt: now.toISOString(),
    });
    await renderPhotos();
    showToast("Foto salva neste aparelho.");
  } catch {
    showToast("Não foi possível salvar essa foto.");
  }
  event.target.value = "";
});
$("#photo-viewer-close").addEventListener("click", () => $("#photo-viewer").close());
$("#photo-viewer").addEventListener("click", (event) => {
  if (event.target === event.currentTarget) event.currentTarget.close();
});
$("#photo-viewer").addEventListener("close", () => {
  if (viewerUrl) URL.revokeObjectURL(viewerUrl);
  viewerUrl = "";
  $("#photo-viewer-image").removeAttribute("src");
});
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
  state.settings.phase = data.get("phase").trim() || "Não definida";
  state.settings.startDate = data.get("startDate");
  state.settings.targets = {
    tempMin: data.get("tempMin"), tempMax: data.get("tempMax"),
    humidityMin: data.get("humidityMin"), humidityMax: data.get("humidityMax"),
  };
  saveState();
  renderAll();
  showToast("Ajustes salvos.");
});

$("#export-data").addEventListener("click", exportData);
$("#import-data").addEventListener("change", (event) => {
  const [file] = event.target.files;
  if (file) importData(file);
  event.target.value = "";
});

renderAll();
