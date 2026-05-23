const STORAGE_KEY = "stanza-diary.entries.v1";
const SETTINGS_KEY = "stanza-diary.settings.v1";
const SEED_KEY = "stanza-diary.seeded.v1";
const PIN_KEY = "stanza-diary.pin.v1";
const LEGACY_AUTH_KEY = "stanza-diary.auth.v1";

const state = {
  view: "today",
  selectedDate: todayKey(),
  calendarMonth: todayKey().slice(0, 7),
  editDate: null,
  filterTags: new Set(),
  autosaveTimer: null,
  entries: loadEntries(),
  settings: loadSettings(),
  isUnlocked: false,
};

localStorage.removeItem(LEGACY_AUTH_KEY);

const fields = {
  did: document.querySelector("#did"),
  learned: document.querySelector("#learned"),
  result: document.querySelector("#result"),
  failed: document.querySelector("#failed"),
  tags: document.querySelector("#tags"),
};

const editFields = {
  did: document.querySelector("#edit-did"),
  learned: document.querySelector("#edit-learned"),
  result: document.querySelector("#edit-result"),
  failed: document.querySelector("#edit-failed"),
  tags: document.querySelector("#edit-tags"),
};

const lockScreen = document.querySelector("#lock-screen");
const appScreen = document.querySelector("#app-screen");
const lockPinInput = document.querySelector("#lock-pin-input");
const lockPinDots = document.querySelector("#lock-pin-dots");
const lockPinError = document.querySelector("#lock-pin-error");
const pinModal = document.querySelector("#pin-modal");
const pinModalMessage = document.querySelector("#pin-modal-message");
const pinModalInput = document.querySelector("#pin-modal-input");
const pinModalDots = document.querySelector("#pin-modal-dots");
const pinModalError = document.querySelector("#pin-modal-error");
const pinModalConfirm = document.querySelector("[data-pin-modal-confirm]");
const pinModalCancel = document.querySelector("[data-pin-modal-cancel]");
const pinEnabledCheckbox = document.querySelector("#pin-enabled");
const pinControls = document.querySelector("#pin-controls");
const entryForm = document.querySelector("#entry-form");
const editForm = document.querySelector("#edit-form");
const searchInput = document.querySelector("#search");
const dateFromInput = document.querySelector("#date-from");
const dateToInput = document.querySelector("#date-to");
const backButton = document.querySelector("[data-back]");
const brand = document.querySelector(".app-brand");
const modal = document.querySelector("#modal");
const modalMessage = document.querySelector("#modal-message");
const modalConfirm = document.querySelector("[data-modal-confirm]");
const modalCancel = document.querySelector("[data-modal-cancel]");
const autosaveStatus = document.querySelector("#autosave-status");
const autosaveStatusText = document.querySelector("#autosave-status-text");
const autosaveStatusTime = document.querySelector("#autosave-status-time");
const dailyTemplateNote = document.querySelector("#daily-template-note");
const weeklySummary = document.querySelector("#weekly-summary");

seedEntries();
boot();

document.querySelectorAll("[data-nav]").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.nav));
});

document.querySelector("[data-open-settings]").addEventListener("click", () => setView("settings"));
backButton.addEventListener("click", () => setView("history"));

document.querySelector("[data-calendar-prev]").addEventListener("click", () => shiftCalendarMonth(-1));
document.querySelector("[data-calendar-next]").addEventListener("click", () => shiftCalendarMonth(1));

entryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearQueuedAutosave();
  try {
    saveSelectedDate();
    renderAll();
    setAutosaveStatus("saved");
    setView("history");
  } catch {
    setAutosaveStatus("error");
  }
});

Object.values(fields).forEach((field) => {
  field.addEventListener("input", () => {
    if (!state.settings.autosave) {
      setAutosaveStatus("off");
      return;
    }
    queueAutosave();
  });
});

editForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!state.editDate) return;
  state.entries[state.editDate] = entryFromFields(state.editDate, editFields);
  persistEntries();
  fillEntryForm(state.selectedDate);
  setView("history");
});

[searchInput, dateFromInput, dateToInput].forEach((input) => {
  input.addEventListener("input", renderHistory);
});

document.querySelector("#reminders").addEventListener("change", (event) => {
  state.settings.reminders = event.target.checked;
  persistSettings();
});

document.querySelector("#autosave").addEventListener("change", (event) => {
  state.settings.autosave = event.target.checked;
  persistSettings();
  if (state.settings.autosave) {
    queueAutosave();
  } else {
    clearQueuedAutosave();
    setAutosaveStatus("off");
  }
});

document.querySelector("[data-export]").addEventListener("click", exportEntries);
document.querySelector("#import-json").addEventListener("change", importEntries);
document.querySelector("[data-apply-template]").addEventListener("click", applyDailyTemplate);

lockPinInput.addEventListener("input", onLockPinInput);
lockScreen.addEventListener("click", focusLockPin);
document.querySelector("[data-pin-reset]").addEventListener("click", onPinReset);

pinEnabledCheckbox.addEventListener("change", onPinToggle);
document.querySelector("[data-pin-change]").addEventListener("click", onPinChange);

document.querySelector("[data-clear]").addEventListener("click", async () => {
  const confirmed = await confirmAction("Очистить все записи? Это действие нельзя отменить.");
  if (!confirmed) return;
  state.entries = {};
  localStorage.setItem(SEED_KEY, "true");
  persistEntries();
  fillEntryForm(state.selectedDate);
  renderAll();
  setView("today");
});

function boot() {
  document.querySelector("#reminders").checked = state.settings.reminders;
  document.querySelector("#autosave").checked = state.settings.autosave;
  fillEntryForm(state.selectedDate);
  setAutosaveStatus(state.settings.autosave ? "saved" : "off");
  renderAll();
  registerServiceWorker();
  refreshPinControls();

  if (hasStoredPin()) {
    showLockScreen();
  } else {
    unlockApp();
  }
}

function showLockScreen() {
  state.isUnlocked = false;
  appScreen.classList.add("is-hidden");
  lockScreen.classList.remove("is-hidden");
  clearPinInput(lockPinInput, lockPinDots);
  lockPinError.textContent = "";
  setTimeout(focusLockPin, 0);
}

function unlockApp() {
  state.isUnlocked = true;
  lockScreen.classList.add("is-hidden");
  appScreen.classList.remove("is-hidden");
  setView("today");
}

function focusLockPin() {
  if (!lockScreen.classList.contains("is-hidden")) {
    lockPinInput.focus();
  }
}

function setView(view) {
  state.view = view;
  document.querySelectorAll(".view").forEach((section) => {
    section.classList.toggle("is-active", section.dataset.view === view);
  });
  document.querySelectorAll("[data-nav]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.nav === (view === "edit" ? "history" : view));
  });

  backButton.classList.toggle("is-hidden", view !== "edit");
  brand.innerHTML =
    view === "edit"
      ? "<span>// редактирование</span>"
      : '<span class="material-symbols-outlined brand-icon">terminal</span><span>Дневник</span>';

  renderAll();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function shiftCalendarMonth(delta) {
  const date = new Date(`${state.calendarMonth}-01T12:00:00`);
  date.setMonth(date.getMonth() + delta);
  state.calendarMonth = date.toISOString().slice(0, 7);
  renderCalendar();
}

function selectDate(date) {
  if (state.settings.autosave) {
    clearQueuedAutosave();
    try {
      saveSelectedDate();
    } catch {
      setAutosaveStatus("error");
      return;
    }
  }
  state.selectedDate = date;
  state.calendarMonth = date.slice(0, 7);
  fillEntryForm(date);
  setAutosaveStatus(state.settings.autosave ? "saved" : "off");
  renderAll();
}

function saveSelectedDate(updateTimestamp = true) {
  const entry = entryFromFields(state.selectedDate, fields, updateTimestamp);
  if (hasEntryText(entry)) {
    state.entries[state.selectedDate] = entry;
  } else {
    delete state.entries[state.selectedDate];
  }
  persistEntries();
}

function queueAutosave() {
  setAutosaveStatus("saving");
  clearTimeout(state.autosaveTimer);
  state.autosaveTimer = setTimeout(() => {
    try {
      saveSelectedDate();
      renderAll();
      setAutosaveStatus("saved");
    } catch {
      setAutosaveStatus("error");
    } finally {
      state.autosaveTimer = null;
    }
  }, 550);
}

function clearQueuedAutosave() {
  clearTimeout(state.autosaveTimer);
  state.autosaveTimer = null;
}

function setAutosaveStatus(status) {
  const labels = {
    saved: "сохранено",
    saving: "сохраняю...",
    error: "ошибка сохранения",
    off: "автосохранение выключено",
  };
  autosaveStatus.dataset.status = status;
  autosaveStatusText.textContent = labels[status] || labels.saved;
  autosaveStatusTime.textContent = status === "saved" ? formatSaveTime(new Date()) : "";
}

function entryFromFields(date, source, updateTimestamp = true) {
  return {
    date,
    did: source.did.value.trim(),
    learned: source.learned.value.trim(),
    result: source.result.value.trim(),
    failed: source.failed.value.trim(),
    tags: splitTags(source.tags.value),
    updatedAt: updateTimestamp ? new Date().toISOString() : state.entries[date]?.updatedAt || new Date().toISOString(),
  };
}

function fillEntryForm(date) {
  const entry = state.entries[date] || emptyEntry(date);
  fields.did.value = entry.did;
  fields.learned.value = entry.learned;
  fields.result.value = entry.result;
  fields.failed.value = entry.failed;
  fields.tags.value = entry.tags.join(", ");
  document.querySelector("#today-date").textContent = formatDate(date, true);
  document.querySelector("#selected-entry-title").textContent =
    date === todayKey() ? "// запись на сегодня" : `// запись на ${formatDate(date)}`;
}

function renderAll() {
  renderStats();
  renderDailyTemplate();
  renderCalendar();
  renderHistory();
  renderWeeklyOverview();
  renderCharts();
}

function renderStats() {
  const entries = entryList();
  const streak = currentStreak(entries);
  document.querySelector("#streak-count").textContent = streak;
  document.querySelector("#total-count").textContent = entries.length;
  document.querySelector("#stat-total").textContent = entries.length;
  document.querySelector("#stat-streak").textContent = streak;
  document.querySelector("#stat-best").textContent = bestStreak(entries);
  document.querySelector("#stat-week").textContent = entries.length ? Math.max(1, Math.round((entries.length / 9) * 10) / 10) : 0;
  document.querySelector("#history-title").textContent = `// записи (всего ${entries.length})`;
}

function renderDailyTemplate() {
  const template = getDailyTemplate(state.selectedDate);
  dailyTemplateNote.textContent = template.note;
}

async function applyDailyTemplate() {
  const template = getDailyTemplate(state.selectedDate);
  const current = entryFromFields(state.selectedDate, fields, false);
  const hasText = hasEntryText(current);
  const emptyFields = Object.entries(fields).filter(([key, field]) => key !== "tags" && !field.value.trim());

  if (hasText && !emptyFields.length && fields.tags.value.trim()) {
    await notice("В записи уже есть текст. Шаблон добавляется только в пустые поля.");
    return;
  }

  if (hasText) {
    const confirmed = await confirmAction("Добавить шаблон только в пустые поля этой записи?");
    if (!confirmed) return;
  }

  if (!fields.did.value.trim()) fields.did.value = template.did;
  if (!fields.learned.value.trim()) fields.learned.value = template.learned;
  if (!fields.result.value.trim()) fields.result.value = template.result;
  if (!fields.failed.value.trim()) fields.failed.value = template.failed;
  if (!fields.tags.value.trim()) fields.tags.value = template.tags.join(", ");

  fields.did.focus();
  if (state.settings.autosave) {
    queueAutosave();
  } else {
    setAutosaveStatus("off");
  }
}

function getDailyTemplate(date) {
  const day = new Date(`${date}T12:00:00`).getDay();
  const isWeekend = day === 0 || day === 6;
  const isMonday = day === 1;
  const isFriday = day === 5;

  if (isMonday) {
    return {
      note: "понедельник: мягкий старт недели",
      did: "- Что сегодня запустил:\n- Какой один шаг был главным:\n- Что помогло войти в ритм:",
      learned: "- Что стало понятнее:\n- Какую мысль беру в неделю:",
      result: "- Главное решение:\n- Что важно не распылить завтра:",
      failed: "- Что мешало старту:\n- Что можно упростить:",
      tags: ["неделя", "план"],
    };
  }

  if (isFriday) {
    return {
      note: "пятница: собрать итоги перед выходными",
      did: "- Что удалось завершить:\n- Что продвинулось:\n- Что можно признать победой:",
      learned: "- Что неделя показала:\n- Что хочу повторить:",
      result: "- Итог недели:\n- Что перенести дальше:",
      failed: "- Что осталось висеть:\n- Что не стоит тащить в выходные:",
      tags: ["итоги", "неделя"],
    };
  }

  if (isWeekend) {
    return {
      note: "выходной: больше личного пространства",
      did: "- Что сегодня было живым:\n- Что восстановило силы:\n- Что сделал для себя:",
      learned: "- Что заметил о себе:\n- Какая мысль вернулась:",
      result: "- Что хочется сохранить:\n- Какой маленький вывод дня:",
      failed: "- Что забрало энергию:\n- От чего можно отказаться:",
      tags: ["личное", "восстановление"],
    };
  }

  return {
    note: "будний день: короткая честная структура",
    did: "- Главное событие дня:\n- Что продвинулось:\n- Маленькая победа:",
    learned: "- Что понял:\n- Что заметил:\n- Что стоит проверить позже:",
    result: "- Один вывод:\n- Что забрать в завтра:",
    failed: "- Что помешало:\n- Где застрял:\n- Что можно упростить:",
    tags: ["день"],
  };
}

function renderCalendar() {
  const grid = document.querySelector("#calendar-grid");
  const monthDate = new Date(`${state.calendarMonth}-01T12:00:00`);
  const monthName = new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric" }).format(monthDate);
  document.querySelector("#calendar-month").textContent = monthName;

  const start = new Date(monthDate);
  const weekday = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - weekday);
  grid.textContent = "";

  Array.from({ length: 42 }).forEach((_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    const key = day.toISOString().slice(0, 10);
    const button = document.createElement("button");
    button.className = "calendar-day";
    button.type = "button";
    button.textContent = String(day.getDate());
    button.classList.toggle("is-outside", key.slice(0, 7) !== state.calendarMonth);
    button.classList.toggle("is-selected", key === state.selectedDate);
    button.classList.toggle("has-entry", hasEntryText(state.entries[key]));
    button.addEventListener("click", () => selectDate(key));
    grid.append(button);
  });
}

function renderHistory() {
  const list = document.querySelector("#history-list");
  const query = searchInput.value.trim().toLowerCase();
  const from = dateFromInput.value;
  const to = dateToInput.value;
  const entries = entryList().filter((entry) => {
    if (from && entry.date < from) return false;
    if (to && entry.date > to) return false;
    if (state.filterTags.size && !entry.tags.some((tag) => state.filterTags.has(tag))) return false;
    const haystack = [entry.date, entry.did, entry.learned, entry.result, entry.failed, entry.tags.join(" ")]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });

  list.textContent = "";
  if (!entries.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "записей не найдено";
    list.append(empty);
    renderFilterTags();
    return;
  }

  entries.forEach((entry, index) => {
    const card = document.createElement("details");
    card.className = "history-card";
    card.open = index === 0;
    card.innerHTML = `
      <summary>
        <div>
          <span class="history-date">${formatDate(entry.date)}</span>
          <div class="tag-row">${entry.tags.map(tagTemplate).join("")}</div>
        </div>
        <span class="material-symbols-outlined">add</span>
      </summary>
      <div class="history-content">
        ${historyBlock("// что сделал", entry.did)}
        ${historyBlock("// что изучил", entry.learned)}
        ${historyBlock("// к чему пришёл", entry.result)}
        ${historyBlock("// что не получилось", entry.failed)}
        <footer class="history-actions">
          <button class="text-button" type="button" data-edit="${entry.date}">
            <span class="material-symbols-outlined">edit</span>редактировать
          </button>
          <button class="text-button danger" type="button" data-delete="${entry.date}">
            <span class="material-symbols-outlined">delete</span>удалить
          </button>
        </footer>
      </div>
    `;
    list.append(card);
  });

  list.querySelectorAll("[data-edit]").forEach((button) => {
    button.addEventListener("click", () => openEdit(button.dataset.edit));
  });
  list.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => deleteEntry(button.dataset.delete));
  });

  renderFilterTags();
}

function renderFilterTags() {
  const activeHost = document.querySelector("#active-tags");
  const filterHost = document.querySelector("#filter-tags");
  const active = Array.from(state.filterTags);

  activeHost.innerHTML = active.map((tag) => `<button class="tag-chip filter-chip is-active" type="button" data-filter-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`).join("");
  if (dateFromInput.value || dateToInput.value || active.length) {
    const reset = document.createElement("button");
    reset.className = "text-button";
    reset.type = "button";
    reset.textContent = "сбросить фильтры";
    reset.addEventListener("click", () => {
      state.filterTags.clear();
      dateFromInput.value = "";
      dateToInput.value = "";
      renderHistory();
    });
    activeHost.append(reset);
  }

  filterHost.innerHTML = topTags()
    .slice(0, 8)
    .map(({ tag }) => `<button class="tag-chip filter-chip ${state.filterTags.has(tag) ? "is-active" : ""}" type="button" data-filter-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`)
    .join("");

  document.querySelectorAll("[data-filter-tag]").forEach((button) => {
    button.addEventListener("click", () => {
      const tag = button.dataset.filterTag;
      if (state.filterTags.has(tag)) {
        state.filterTags.delete(tag);
      } else {
        state.filterTags.add(tag);
      }
      renderHistory();
    });
  });
}

function renderCharts() {
  const heatmap = document.querySelector("#heatmap");
  const wordChart = document.querySelector("#word-chart");
  const topTagsHost = document.querySelector("#top-tags");
  const dates = new Set(entryList().map((entry) => entry.date));

  heatmap.textContent = "";
  Array.from({ length: 98 }).forEach((_, index) => {
    const cell = document.createElement("span");
    cell.className = "heat-cell";
    const sampleDate = offsetDate(index - 97);
    const level = dates.has(sampleDate) ? (index % 4) + 1 : index % 11 === 0 ? 1 : 0;
    cell.dataset.level = String(level);
    heatmap.append(cell);
  });

  wordChart.textContent = "";
  monthlyWordBars().forEach((height) => {
    const bar = document.createElement("span");
    bar.className = "bar";
    bar.style.height = `${height}%`;
    wordChart.append(bar);
  });

  const tags = topTags();
  topTagsHost.textContent = "";
  if (!tags.length) {
    topTagsHost.innerHTML = '<div class="empty-state">тегов пока нет</div>';
    return;
  }
  const max = tags[0].count || 1;
  tags.slice(0, 5).forEach(({ tag, count }) => {
    const row = document.createElement("div");
    row.className = "tag-stat";
    row.innerHTML = `
      <span>${escapeHtml(tag)}</span>
      <div class="tag-meter"><span style="width:${Math.max(12, (count / max) * 100)}%"></span></div>
      <span>${count}</span>
    `;
    topTagsHost.append(row);
  });
}

function renderWeeklyOverview() {
  const days = Array.from({ length: 7 }, (_, index) => offsetDate(index - 6));
  const entries = days.map((date) => state.entries[date]).filter(hasEntryText);
  const filledDays = entries.length;
  const missedDays = 7 - filledDays;
  const words = entries.reduce((sum, entry) => sum + wordCount(entry), 0);
  const tags = new Map();
  entries.forEach((entry) => entry.tags.forEach((tag) => tags.set(tag, (tags.get(tag) || 0) + 1)));
  const topTag = Array.from(tags.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || "нет";
  const longest = entries.reduce((winner, entry) => (wordCount(entry) > wordCount(winner) ? entry : winner), emptyEntry(todayKey()));
  const longestLabel = hasEntryText(longest) ? formatDate(longest.date) : "нет";

  weeklySummary.innerHTML = [
    weeklyCard(filledDays, "заполнено дней"),
    weeklyCard(missedDays, "пропущено дней"),
    weeklyCard(words, "слов за неделю"),
    weeklyCard(topTag, "главный тег"),
    weeklyCard(longestLabel, "самая длинная запись"),
    weeklyCard(buildWeeklyHint(filledDays, missedDays), "локальный вывод"),
  ].join("");
}

function weeklyCard(value, label) {
  return `<article class="weekly-card"><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></article>`;
}

function buildWeeklyHint(filledDays, missedDays) {
  if (!filledDays) return "начать с одной записи";
  if (missedDays <= 1) return "ритм держится";
  if (filledDays >= 3) return "есть опора";
  return "нужен мягкий ритм";
}

function monthlyWordBars() {
  const months = Array(12).fill(0);
  entryList().forEach((entry) => {
    const month = Number(entry.date.slice(5, 7)) - 1;
    months[month] += wordCount(entry);
  });
  const max = Math.max(...months, 1);
  return months.map((count) => (count ? Math.max(16, Math.round((count / max) * 100)) : 10));
}

function openEdit(date) {
  const entry = state.entries[date];
  if (!entry) return;
  state.editDate = date;
  document.querySelector("#edit-title").innerHTML = `${formatDate(date)}<span class="cursor">_</span>`;
  editFields.did.value = entry.did;
  editFields.learned.value = entry.learned;
  editFields.result.value = entry.result;
  editFields.failed.value = entry.failed;
  editFields.tags.value = entry.tags.join(", ");
  setView("edit");
}

async function deleteEntry(date) {
  const confirmed = await confirmAction(`Удалить запись за ${formatDate(date)}?`);
  if (!confirmed) return;
  delete state.entries[date];
  persistEntries();
  if (date === state.selectedDate) fillEntryForm(date);
  renderAll();
}

function confirmAction(message) {
  return openModal(message, true);
}

function notice(message) {
  return openModal(message, false);
}

function openModal(message, needsCancel) {
  return new Promise((resolve) => {
    modalMessage.textContent = message;
    modal.classList.remove("is-hidden");
    modalCancel.classList.toggle("is-hidden", !needsCancel);
    document.querySelector(".modal-actions").classList.toggle("is-notice", !needsCancel);
    modalConfirm.textContent = needsCancel ? "подтвердить" : "закрыть";

    const cleanup = (result) => {
      modal.classList.add("is-hidden");
      modalConfirm.removeEventListener("click", onConfirm);
      modalCancel.removeEventListener("click", onCancel);
      resolve(result);
    };
    const onConfirm = () => cleanup(true);
    const onCancel = () => cleanup(false);
    modalConfirm.addEventListener("click", onConfirm);
    modalCancel.addEventListener("click", onCancel);
  });
}

function entryList() {
  return Object.values(state.entries)
    .filter(hasEntryText)
    .sort((a, b) => b.date.localeCompare(a.date));
}

function historyBlock(title, text) {
  if (!text) return "";
  return `<section class="history-block"><h3>${title}</h3><p>${escapeHtml(text)}</p></section>`;
}

function tagTemplate(tag) {
  const value = typeof tag === "string" ? tag : tag.tag;
  return `<span class="tag-chip">${escapeHtml(value)}</span>`;
}

function topTags() {
  const counts = new Map();
  entryList().forEach((entry) => {
    entry.tags.forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1));
  });
  return Array.from(counts, ([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count);
}

function hasEntryText(entry) {
  return Boolean(entry && [entry.did, entry.learned, entry.result, entry.failed, entry.tags.join("")].some(Boolean));
}

function emptyEntry(date) {
  return { date, did: "", learned: "", result: "", failed: "", tags: [], updatedAt: new Date().toISOString() };
}

function loadEntries() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return normalizeEntries(raw);
  } catch {
    return {};
  }
}

function loadSettings() {
  try {
    return { reminders: false, autosave: true, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}") };
  } catch {
    return { reminders: false, autosave: true };
  }
}

function seedEntries() {
  if (Object.keys(state.entries).length || localStorage.getItem(SEED_KEY) === "true") return;
  const yesterday = offsetDate(-1);
  const twoDaysAgo = offsetDate(-2);
  state.entries[yesterday] = {
    date: yesterday,
    did: "Записал важные события дня и разобрал накопившиеся мысли.",
    learned: "Понял, что короткая вечерняя запись помогает лучше закрывать день.",
    result: "Лучше писать честно и коротко, чем откладывать идеальную формулировку.",
    failed: "",
    tags: ["мысли", "планирование"],
    updatedAt: new Date().toISOString(),
  };
  state.entries[twoDaysAgo] = {
    date: twoDaysAgo,
    did: "Собрал список дел и выделил одно главное действие на завтра.",
    learned: "Когда день описан по блокам, проще увидеть повторяющиеся темы.",
    result: "",
    failed: "Не получилось лечь вовремя.",
    tags: ["дом", "ритм"],
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(SEED_KEY, "true");
  persistEntries();
}

function persistEntries() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.entries));
}

function persistSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || location.protocol === "file:") return;
  navigator.serviceWorker.register("sw.js").catch(() => {});
}

function hasStoredPin() {
  const record = getStoredPin();
  return Boolean(record && record.hash && record.salt);
}

function getStoredPin() {
  try {
    return JSON.parse(localStorage.getItem(PIN_KEY) || "null");
  } catch {
    return null;
  }
}

function generateSalt() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}

async function hashPin(pin, salt) {
  const buffer = new TextEncoder().encode(`${pin}::${salt}`);
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function savePin(pin) {
  const salt = generateSalt();
  const hash = await hashPin(pin, salt);
  localStorage.setItem(PIN_KEY, JSON.stringify({ hash, salt }));
}

function clearStoredPin() {
  localStorage.removeItem(PIN_KEY);
}

async function verifyPinAttempt(pin) {
  const record = getStoredPin();
  if (!record) return false;
  const hash = await hashPin(pin, record.salt);
  return hash === record.hash;
}

function updatePinDots(dotsContainer, length) {
  dotsContainer.querySelectorAll(".pin-dot").forEach((dot, index) => {
    dot.classList.toggle("is-filled", index < length);
  });
}

function clearPinInput(input, dotsContainer) {
  input.value = "";
  updatePinDots(dotsContainer, 0);
}

function shake(dotsContainer) {
  dotsContainer.classList.remove("is-shake");
  void dotsContainer.offsetWidth;
  dotsContainer.classList.add("is-shake");
}

async function onLockPinInput() {
  const value = lockPinInput.value.replace(/\D/g, "").slice(0, 4);
  lockPinInput.value = value;
  updatePinDots(lockPinDots, value.length);
  lockPinError.textContent = "";
  if (value.length === 4) {
    const ok = await verifyPinAttempt(value);
    if (ok) {
      unlockApp();
    } else {
      lockPinError.textContent = "неверный PIN";
      shake(lockPinDots);
      clearPinInput(lockPinInput, lockPinDots);
      focusLockPin();
    }
  }
}

async function onPinReset() {
  const confirmed = await confirmAction(
    "Сбросить PIN? Дневник откроется без блокировки. Записи останутся, но напомню: они и так не зашифрованы — это была только UX-блокировка.",
  );
  if (!confirmed) return;
  clearStoredPin();
  refreshPinControls();
  unlockApp();
}

async function onPinToggle(event) {
  if (event.target.checked) {
    const pin = await promptNewPin();
    if (!pin) {
      event.target.checked = false;
      return;
    }
    await savePin(pin);
    await notice("PIN установлен. В следующий раз попросим его при открытии.");
  } else {
    const confirmed = await confirmAction("Отключить PIN-защиту? Дневник будет открываться без блокировки.");
    if (!confirmed) {
      event.target.checked = true;
      return;
    }
    clearStoredPin();
  }
  refreshPinControls();
}

async function onPinChange() {
  const pin = await promptNewPin();
  if (!pin) return;
  await savePin(pin);
  await notice("PIN обновлён.");
}

function refreshPinControls() {
  const enabled = hasStoredPin();
  pinEnabledCheckbox.checked = enabled;
  pinControls.classList.toggle("is-hidden", !enabled);
}

async function promptNewPin() {
  while (true) {
    const first = await openPinModal("задай PIN", "4 цифры");
    if (first === null) return null;
    const second = await openPinModal("повтори PIN", "ещё раз те же 4 цифры");
    if (second === null) return null;
    if (first === second) return first;
    await notice("PIN-ы не совпали. Попробуй ещё раз.");
  }
}

function openPinModal(title, message) {
  return new Promise((resolve) => {
    document.querySelector("#pin-modal-title").textContent = `// ${title}`;
    pinModalMessage.textContent = message;
    pinModalError.textContent = "";
    clearPinInput(pinModalInput, pinModalDots);
    pinModal.classList.remove("is-hidden");
    requestAnimationFrame(() => pinModalInput.focus());

    const onCardClick = (event) => {
      if (event.target.tagName !== "BUTTON") {
        pinModalInput.focus();
      }
    };
    pinModal.addEventListener("click", onCardClick);

    const onInput = () => {
      const value = pinModalInput.value.replace(/\D/g, "").slice(0, 4);
      pinModalInput.value = value;
      updatePinDots(pinModalDots, value.length);
      pinModalError.textContent = "";
    };
    const onConfirm = () => {
      const value = pinModalInput.value;
      if (value.length !== 4) {
        pinModalError.textContent = "введи 4 цифры";
        shake(pinModalDots);
        return;
      }
      cleanup(value);
    };
    const onCancel = () => cleanup(null);
    const onKey = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        onConfirm();
      } else if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
      }
    };
    const cleanup = (result) => {
      pinModal.classList.add("is-hidden");
      pinModalInput.removeEventListener("input", onInput);
      pinModalConfirm.removeEventListener("click", onConfirm);
      pinModalCancel.removeEventListener("click", onCancel);
      pinModalInput.removeEventListener("keydown", onKey);
      pinModal.removeEventListener("click", onCardClick);
      resolve(result);
    };
    pinModalInput.addEventListener("input", onInput);
    pinModalConfirm.addEventListener("click", onConfirm);
    pinModalCancel.addEventListener("click", onCancel);
    pinModalInput.addEventListener("keydown", onKey);
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// =============== normalize ===============

function normalizeEntries(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  return Object.fromEntries(
    Object.entries(raw)
      .filter(([date]) => /^\d{4}-\d{2}-\d{2}$/.test(date))
      .map(([date, entry]) => [
        date,
        {
          date,
          did: String(entry.did || ""),
          learned: String(entry.learned || ""),
          result: String(entry.result || ""),
          failed: String(entry.failed || ""),
          tags: Array.isArray(entry.tags) ? entry.tags.map(String) : splitTags(String(entry.tags || "")),
          updatedAt: String(entry.updatedAt || new Date().toISOString()),
        },
      ]),
  );
}

// =============== import/export ===============

function exportEntries() {
  const blob = new Blob([JSON.stringify(state.entries, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `diary-${todayKey()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

async function importEntries(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const imported = normalizeEntries(JSON.parse(await file.text()));
    state.entries = { ...state.entries, ...imported };
    persistEntries();
    fillEntryForm(state.selectedDate);
    renderAll();
    await notice(`Импортировано записей: ${Object.keys(imported).length}`);
  } catch {
    await notice("Не получилось импортировать JSON-файл.");
  } finally {
    event.target.value = "";
  }
}

// =============== dates ===============

function todayKey() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

function offsetDate(offset) {
  const date = new Date(`${todayKey()}T12:00:00`);
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

function daysBetween(a, b) {
  return Math.round((new Date(`${b}T12:00:00`) - new Date(`${a}T12:00:00`)) / 86_400_000);
}

function formatDate(date, withWeekday = false) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(withWeekday ? { weekday: "long" } : {}),
  }).format(new Date(`${date}T12:00:00`));
}

function formatSaveTime(date) {
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// =============== tags ===============

function splitTags(value) {
  return value
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
}

// =============== stats ===============

function wordCount(entry) {
  return [entry.did, entry.learned, entry.result, entry.failed].join(" ").trim().split(/\s+/).filter(Boolean).length;
}

function currentStreak(entries) {
  const dates = new Set(entries.map((entry) => entry.date));
  let streak = 0;
  let date = todayKey();
  while (dates.has(date)) {
    streak += 1;
    date = offsetDate(-streak);
  }
  return streak;
}

function bestStreak(entries) {
  const dates = entries.map((entry) => entry.date).sort();
  let best = 0;
  let current = 0;
  let previous = null;
  dates.forEach((date) => {
    current = previous && daysBetween(previous, date) === 1 ? current + 1 : 1;
    best = Math.max(best, current);
    previous = date;
  });
  return best;
}
