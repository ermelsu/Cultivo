
const KEY = "indoorGrowTracker.v1";

const defaultState = {
  targets: { tempMin:"", tempMax:"", rhMin:"", rhMax:"" },
  phases: [
    { id: crypto.randomUUID(), name:"Preparação", start: todayISO(), end: todayISO(), notes:"Ambiente, equipamentos, segurança e medições." },
    { id: crypto.randomUUID(), name:"Fase inicial", start: addDays(todayISO(),1), end:addDays(todayISO(),7), notes:"Fase genérica configurável." },
    { id: crypto.randomUUID(), name:"Crescimento", start:addDays(todayISO(),8), end:addDays(todayISO(),28), notes:"Fase genérica configurável." },
    { id: crypto.randomUUID(), name:"Fase reprodutiva", start:addDays(todayISO(),29), end:addDays(todayISO(),63), notes:"Fase genérica configurável." },
    { id: crypto.randomUUID(), name:"Pós-colheita", start:addDays(todayISO(),64), end:addDays(todayISO(),77), notes:"Fase genérica configurável." }
  ],
  logs: [],
  prepChecks: {
    power:false, cables:false, thermometer:false, exhaust:false,
    circulation:false, timer:false, dryrun:false, notes:false
  },
  dark:false
};

function todayISO(){
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0,10);
}
function addDays(iso, n){
  const d = new Date(iso+"T12:00:00");
  d.setDate(d.getDate()+n);
  return d.toISOString().slice(0,10);
}
function load(){
  const raw = localStorage.getItem(KEY);
  if(!raw) return structuredClone(defaultState);
  try { return {...structuredClone(defaultState), ...JSON.parse(raw)} }
  catch { return structuredClone(defaultState); }
}
let state = load();
function save(){ localStorage.setItem(KEY, JSON.stringify(state)); }

const checklistItems = [
  ["power","Verificar tomadas, extensões e ausência de sobrecarga."],
  ["cables","Confirmar que cabos e conexões estão secos e bem fixados."],
  ["thermometer","Testar termo-higrômetro e registrar uma leitura inicial."],
  ["exhaust","Testar exaustão e verificar se está funcionando sem ruído anormal."],
  ["circulation","Testar circulação interna de ar."],
  ["timer","Testar temporizador/automação dos equipamentos."],
  ["dryrun","Fazer um teste do ambiente vazio por algumas horas."],
  ["notes","Registrar qualquer aquecimento, ruído, oscilação ou manutenção necessária."]
];

function renderPrep(){
  const el = document.querySelector("#prepChecklist");
  el.innerHTML = "";
  checklistItems.forEach(([id,label])=>{
    const row = document.createElement("label");
    row.className = "check-item";
    row.innerHTML = `<input type="checkbox" ${state.prepChecks[id]?"checked":""}><span>${label}</span>`;
    row.querySelector("input").addEventListener("change", e=>{
      state.prepChecks[id] = e.target.checked; save();
    });
    el.appendChild(row);
  });
}

function activePhase(date=todayISO()){
  return state.phases
    .slice()
    .sort((a,b)=>a.start.localeCompare(b.start))
    .find(p=>date>=p.start && date<=p.end);
}

function renderToday(){
  const d = new Date();
  document.querySelector("#todayTitle").textContent =
    d.toLocaleDateString("pt-BR",{weekday:"long",day:"2-digit",month:"long",year:"numeric"});
  const p = activePhase();
  document.querySelector("#todayPhase").textContent = p ? `Fase atual: ${p.name}` : "Nenhuma fase programada para hoje.";
}

function renderTargets(){
  tempMinTarget.value = state.targets.tempMin ?? "";
  tempMaxTarget.value = state.targets.tempMax ?? "";
  rhMinTarget.value = state.targets.rhMin ?? "";
  rhMaxTarget.value = state.targets.rhMax ?? "";
}
saveTargetsBtn.addEventListener("click", ()=>{
  state.targets = {
    tempMin: tempMinTarget.value,
    tempMax: tempMaxTarget.value,
    rhMin: rhMinTarget.value,
    rhMax: rhMaxTarget.value
  };
  save();
  interpretForm();
});

function renderPhases(){
  const el = document.querySelector("#phasesList");
  el.innerHTML = "";
  state.phases.slice().sort((a,b)=>a.start.localeCompare(b.start)).forEach(p=>{
    const row = document.createElement("div");
    row.className = "phase";
    row.innerHTML = `
      <div><strong>${escapeHtml(p.name)}</strong><div class="muted small">${escapeHtml(p.notes||"")}</div></div>
      <div class="dates">${fmt(p.start)} → ${fmt(p.end)}</div>
      <div class="phase-actions">
        <button class="secondary edit">Editar</button>
        <button class="secondary delete">Excluir</button>
      </div>`;
    row.querySelector(".edit").addEventListener("click",()=>openPhase(p));
    row.querySelector(".delete").addEventListener("click",()=>{
      if(confirm("Excluir esta fase?")){
        state.phases = state.phases.filter(x=>x.id!==p.id); save(); renderPhases(); renderToday();
      }
    });
    el.appendChild(row);
  });
}

function openPhase(p=null){
  phaseId.value = p?.id || "";
  phaseName.value = p?.name || "";
  phaseStart.value = p?.start || todayISO();
  phaseEnd.value = p?.end || todayISO();
  phaseNotes.value = p?.notes || "";
  phaseDialog.showModal();
}
addPhaseBtn.addEventListener("click",()=>openPhase());

phaseForm.addEventListener("submit",(e)=>{
  if(e.submitter?.value==="cancel") return;
  e.preventDefault();
  const obj = {
    id: phaseId.value || crypto.randomUUID(),
    name: phaseName.value.trim(),
    start: phaseStart.value,
    end: phaseEnd.value,
    notes: phaseNotes.value.trim()
  };
  if(obj.end < obj.start){ alert("A data final não pode ser anterior à inicial."); return; }
  const ix = state.phases.findIndex(x=>x.id===obj.id);
  if(ix>=0) state.phases[ix]=obj; else state.phases.push(obj);
  save(); renderPhases(); renderToday(); phaseDialog.close();
});

function interpretValues(t, rh){
  const out = [];
  const tmn = num(state.targets.tempMin), tmx = num(state.targets.tempMax);
  const rmn = num(state.targets.rhMin), rmx = num(state.targets.rhMax);

  if(t==null && rh==null){
    out.push(["warn","Registre temperatura e umidade para receber uma leitura automática."]);
    return out;
  }
  if(t!=null && tmn!=null && t<tmn) out.push(["warn",`Temperatura abaixo da faixa definida (${tmn}–${tmx ?? "?"} °C).`]);
  if(t!=null && tmx!=null && t>tmx) out.push(["warn",`Temperatura acima da faixa definida (${tmn ?? "?"}–${tmx} °C).`]);
  if(t!=null && tmn!=null && tmx!=null && t>=tmn && t<=tmx) out.push(["ok","Temperatura dentro da faixa definida por você."]);

  if(rh!=null && rmn!=null && rh<rmn) out.push(["warn",`Umidade abaixo da faixa definida (${rmn}–${rmx ?? "?"}%).`]);
  if(rh!=null && rmx!=null && rh>rmx) out.push(["warn",`Umidade acima da faixa definida (${rmn ?? "?"}–${rmx}%).`]);
  if(rh!=null && rmn!=null && rmx!=null && rh>=rmn && rh<=rmx) out.push(["ok","Umidade dentro da faixa definida por você."]);

  if(out.length===0) out.push(["warn","Defina faixas de referência para o sistema comparar as leituras."]);
  return out;
}

function interpretForm(){
  const msgs = interpretValues(num(temp.value), num(rh.value));
  interpretation.innerHTML = msgs.map(([type,msg])=>`<div class="msg ${type}">${msg}</div>`).join("");
}
temp.addEventListener("input", interpretForm);
rh.addEventListener("input", interpretForm);

logForm.addEventListener("submit",(e)=>{
  e.preventDefault();
  const item = {
    date: logDate.value,
    temp: temp.value,
    rh: rh.value,
    light: light.value,
    exhaust: exhaust.value,
    fan: fan.value,
    notes: notes.value.trim(),
    savedAt: new Date().toISOString()
  };
  const ix = state.logs.findIndex(x=>x.date===item.date);
  if(ix>=0 && !confirm("Já existe um registro nesta data. Substituir?")) return;
  if(ix>=0) state.logs[ix]=item; else state.logs.push(item);
  save(); renderHistory(); interpretForm();
});

function renderHistory(){
  const el = document.querySelector("#history");
  if(!state.logs.length){
    el.innerHTML = `<p class="muted">Nenhum registro salvo.</p>`; return;
  }
  const rows = state.logs.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(x=>{
    const p = activePhase(x.date);
    const messages = interpretValues(num(x.temp),num(x.rh)).map(m=>m[1]).join(" ");
    return `<tr>
      <td>${fmt(x.date)}</td>
      <td>${escapeHtml(p?.name||"—")}</td>
      <td>${escapeHtml(x.temp||"—")}</td>
      <td>${escapeHtml(x.rh||"—")}</td>
      <td>${escapeHtml(x.light||"—")}</td>
      <td>${escapeHtml(x.exhaust||"—")}</td>
      <td>${escapeHtml(x.fan||"—")}</td>
      <td>${escapeHtml(messages)}</td>
      <td>${escapeHtml(x.notes||"—")}</td>
      <td><button class="secondary" onclick="removeLog('${x.date}')">Excluir</button></td>
    </tr>`;
  }).join("");
  el.innerHTML = `<table>
    <thead><tr><th>Data</th><th>Fase</th><th>Temp.</th><th>Umid.</th><th>Luz</th><th>Exaustão</th><th>Ventilação</th><th>Leitura</th><th>Notas</th><th></th></tr></thead>
    <tbody>${rows}</tbody></table>`;
}
window.removeLog = (date)=>{
  if(confirm("Excluir este registro?")){
    state.logs = state.logs.filter(x=>x.date!==date); save(); renderHistory();
  }
};

openTodayBtn.addEventListener("click", ()=>{
  logDate.value = todayISO();
  document.querySelector("#logForm").scrollIntoView({behavior:"smooth",block:"start"});
});
clearFormBtn.addEventListener("click", ()=>{
  logDate.value=todayISO(); temp.value=""; rh.value=""; light.value="";
  exhaust.value=""; fan.value=""; notes.value=""; interpretForm();
});

exportBtn.addEventListener("click", ()=>{
  const blob = new Blob([JSON.stringify(state,null,2)],{type:"application/json"});
  const a = document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download=`indoor-grow-tracker-${todayISO()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
});
importInput.addEventListener("change", async e=>{
  const f = e.target.files?.[0]; if(!f) return;
  try{
    const data = JSON.parse(await f.text());
    state = {...structuredClone(defaultState), ...data};
    save(); boot();
  }catch{ alert("Arquivo JSON inválido."); }
  e.target.value="";
});

themeBtn.addEventListener("click",()=>{
  state.dark=!state.dark; save();
  document.body.classList.toggle("dark",state.dark);
});

function fmt(iso){
  if(!iso) return "—";
  return new Date(iso+"T12:00:00").toLocaleDateString("pt-BR");
}
function num(v){
  if(v===null || v===undefined || v==="") return null;
  const n = Number(v); return Number.isFinite(n)?n:null;
}
function escapeHtml(s){
  return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}
function boot(){
  document.body.classList.toggle("dark",!!state.dark);
  logDate.value=todayISO();
  renderPrep(); renderTargets(); renderPhases(); renderToday(); renderHistory(); interpretForm();
}
boot();
