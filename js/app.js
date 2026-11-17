(() => {
  'use strict';

  const main = document.getElementById('konten');
  const home = main.querySelector('.home');
  const dialog = document.getElementById('dialog');
  const dialogContent = document.getElementById('dialog-content');
  const imageDialog = document.getElementById('image-dialog');
  const imageContent = document.getElementById('image-content');
  const announcement = document.getElementById('announcement');
  const header = document.querySelector('.site-header');
  const engine = window.TryoutEngine;
  const view = window.TryoutQuestionView;
  const catalogView = window.TryoutCatalog;
  const rawPacks = window.TRYOUT_PACKS || [];
  const rawPrograms = window.TRYOUT_PROGRAMS || [];
  const pageSize = 40;
  const statusLabels = {
    answered: 'Sudah dijawab', flagged: 'Ragu-ragu', unanswered: 'Belum dijawab'
  };
  const icons = {
    next: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
    previous: '<path d="M20 12H5m6 6-6-6 6-6"/>',
    left: '<path d="m15 18-6-6 6-6"/>',
    right: '<path d="m9 18 6-6-6-6"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    list: '<rect x="4.5" y="4.5" width="5" height="5" rx="1"/><rect x="14.5" y="4.5" width="5" height="5" rx="1"/><rect x="4.5" y="14.5" width="5" height="5" rx="1"/><rect x="14.5" y="14.5" width="5" height="5" rx="1"/>',
    single: '<circle cx="6" cy="7" r="2"/><circle cx="6" cy="17" r="2"/><path d="M12 7h8m-8 10h8"/>',
    category: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 10h18m-11-6v16m5-6h3"/>',
    multiple: '<rect x="3" y="4" width="6" height="6" rx="1"/><rect x="3" y="14" width="6" height="6" rx="1"/><path d="M13 7h8m-8 10h8"/>',
    simulation: '<path d="M5 3h10l4 4v14H5zM14 3v5h5M8 12h8m-8 4h8"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    pause: '<path d="M9 5v14m6-14v14"/>',
    home: '<path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z"/>',
    submit: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12.5 2.3 2.3 4.7-4.8"/>',
    wrong: '<circle cx="12" cy="12" r="9"/><path d="m9.5 9.5 5 5m0-5-5 5"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z"/><path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20"/>'
  };

  let store;
  let packs;
  let catalog;
  let activePack;
  let session;
  let mode = 'beranda';
  let questionIndex = 0;
  let gridPage = 0;
  let exam;
  let drawer = false;
  let cleanupView = null;

  const el = (tag, className, content) => view.element(tag, className, content);

  function icon(name, size = 20) {
    const shell = el('span', 'control-icon');
    shell.setAttribute('aria-hidden', 'true');
    shell.innerHTML = '<svg width="' + size + '" height="' + size +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      icons[name] + '</svg>';
    return shell;
  }

  function button(label, style, action, iconName, iconFirst = false) {
    const control = el('button', style);
    control.type = 'button';
    if (iconName && iconFirst) control.append(icon(iconName));
    if (label) control.append(document.createTextNode(label));
    if (iconName && !iconFirst) control.append(icon(iconName));
    control.addEventListener('click', action);
    return control;
  }

  function iconButton(name, label, action, className = '') {
    const control = button('', 'icon-button ' + className, action, name);
    control.setAttribute('aria-label', label);
    return control;
  }

  function announce(message) {
    announcement.textContent = message;
  }

  function focusHeading(heading) {
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }

  function validatePacks(data) {
    if (!Array.isArray(data) || !data.length) throw new Error('Bank soal kosong.');
    const packIds = new Set();
    function checkIds(items) {
      return Array.isArray(items) && items.length > 0 &&
        items.every((item) => typeof item.id === 'string' && item.id) &&
        new Set(items.map((item) => item.id)).size === items.length;
    }
    const supported = new Set([
      'single', 'single_choice', 'multiple', 'multiple_select', 'category', 'statement_matrix',
      'true_false', 'matching', 'ordering', 'short_text', 'short_answer', 'numeric', 'essay', 'composite', 'unknown'
    ]);
    function validateQuestion(question) {
      if (!supported.has(question.type) || !Array.isArray(question.parts)) throw new Error('Tipe atau isi soal tidak valid.');
      if (['single', 'single_choice', 'multiple', 'multiple_select'].includes(question.type) && !checkIds(question.options)) {
        throw new Error('Opsi soal tidak valid.');
      }
      if (['category', 'statement_matrix'].includes(question.type) && (!checkIds(question.statements) || !checkIds(question.categories))) {
        throw new Error('Kategori soal tidak valid.');
      }
      if (question.type === 'composite') {
        if (!checkIds(question.questions)) throw new Error('Bagian soal tidak valid.');
        question.questions.forEach(validateQuestion);
      }
    }
    for (const pack of data) {
      if (!/^[a-z0-9-]+$/.test(pack.id) || !pack.title || packIds.has(pack.id) ||
          !Number.isFinite(pack.durationMinutes) || pack.durationMinutes <= 0 ||
          !checkIds(pack.questions)) throw new Error('Paket soal tidak valid.');
      packIds.add(pack.id);
      let previous = 0;
      for (const question of pack.questions) {
        if (!Number.isInteger(question.number) || question.number <= previous) throw new Error('Nomor soal tidak berurutan.');
        previous = question.number;
        validateQuestion(question);
      }
    }
    return new Map(data.map((pack) => [pack.id, pack]));
  }

  function go(page, pack) {
    const path = '#' + page + (pack ? '/' + pack.id : '');
    if (location.hash === path) route(true);
    else {
      location.hash = path;
      route(true);
    }
  }

  function packLabel(pack) {
    return pack.title;
  }

  function route(moveFocus = false) {
    const [page, packId] = location.hash.slice(1).split('/');
    const pack = packs.get(packId);
    if (dialog.open) dialog.close();
    if (imageDialog.open) imageDialog.close();
    showDrawer(false);
    cleanupView?.();
    cleanupView = null;
    if (!pack || !['ujian', 'hasil', 'tinjau'].includes(page)) {
      mode = 'beranda';
      activePack = null;
      session = null;
      exam = null;
      document.body.dataset.screen = mode;
      if (!home.isConnected) main.replaceChildren(home);
      catalog.activate();
      document.title = 'Tryout PPG';
      if (page === 'paket') {
        if (moveFocus) focusHeading(home.querySelector('#catalog-title'));
        home.querySelector('#paket').scrollIntoView({ block: 'start' });
      } else {
        if (moveFocus) focusHeading(home.querySelector('h1'));
        window.scrollTo(0, 0);
      }
      return;
    }
    activePack = pack;
    session = store.load(pack);
    if (!session) {
      history.replaceState(null, '', '#beranda');
      route(moveFocus);
      return;
    }
    if (page === 'ujian' && session.status === 'completed') {
      history.replaceState(null, '', '#hasil/' + pack.id);
      route(moveFocus);
      return;
    }
    if (page !== 'ujian' && session.status === 'in_progress') {
      history.replaceState(null, '', '#ujian/' + pack.id);
      route(moveFocus);
      return;
    }
    mode = page;
    document.body.dataset.screen = mode;
    document.title = (mode === 'hasil' ? 'Hasil' : mode === 'tinjau' ? 'Pembahasan' : packLabel(pack)) + ' | Tryout PPG';
    if (mode === 'hasil') renderResults(moveFocus);
    else if (mode === 'tinjau') renderReview(moveFocus);
    else {
      questionIndex = Math.max(0, pack.questions.findIndex((question) => question.id === session.currentQuestionId));
      gridPage = Math.floor(questionIndex / pageSize);
      renderExam(moveFocus);
      updateTimer();
      syncPauseDialog();
    }
    window.scrollTo(0, 0);
  }

  function dialogFrame(title, className, build, dismissible = true) {
    dialog.className = 'dialog ' + className;
    if (dismissible) dialog.removeAttribute('closedby');
    else dialog.setAttribute('closedby', 'none');
    const heading = el('div', 'dialog-header');
    const headingText = el('h2', '', title);
    headingText.id = 'dialog-title';
    heading.append(headingText);
    if (dismissible) heading.append(iconButton('close', 'Tutup dialog', () => dialog.close(), 'dialog-close'));
    dialogContent.replaceChildren(heading);
    build(dialogContent);
    if (!dialog.open) dialog.showModal();
    focusHeading(headingText);
  }

  function note(parent, text) {
    parent.append(el('p', 'local-note', text));
  }

  function startAttempt(pack, fresh = false) {
    const attempt = store.start(pack, { fresh });
    go(attempt.status === 'completed' ? 'hasil' : 'ujian', pack);
  }

  function confirmReset(pack) {
    dialogFrame('Mulai Ulang Tryout?', '', (parent) => {
      parent.append(el('p', 'dialog-intro', 'Pengerjaan dan hasil sebelumnya untuk paket ' + packLabel(pack) + ' akan dihapus dari browser ini.'));
      const actions = el('div', 'dialog-actions');
      actions.append(
        button('Batal', 'button button-secondary', () => dialog.close()),
        button('Mulai Ulang', 'button button-primary', () => startAttempt(pack, true))
      );
      parent.append(actions);
    });
  }

  function prepareExamAction() {
    if (mode !== 'ujian' || !activePack) return false;
    const current = store.load(activePack);
    if (!current) {
      go('beranda');
      return false;
    }
    if (current.status === 'completed') {
      session = current;
      go('hasil', activePack);
      return false;
    }
    if (current.pausedAt != null) {
      session = current;
      syncPauseDialog();
      return false;
    }
    session = current;
    showDrawer(false);
    return true;
  }

  function confirmBackHome() {
    if (!prepareExamAction()) return;
    dialogFrame('Kembali ke Beranda?', 'confirm-dialog', (parent) => {
      parent.append(
        el('p', 'dialog-intro', 'Apakah kamu yakin ingin kembali ke beranda?'),
        el('p', 'dialog-callout is-warning',
          'Proses pengerjaan dan seluruh jawaban pada paket ' + packLabel(activePack) + ' akan hilang dan tidak dapat dikembalikan.')
      );
      const actions = el('div', 'dialog-actions');
      actions.append(
        button('Batal', 'button button-secondary', () => dialog.close()),
        button('Ya, Kembali ke Beranda', 'button button-primary', () => {
          store.reset(activePack);
          go('beranda');
        })
      );
      parent.append(actions);
    });
  }

  function confirmSubmit() {
    if (!prepareExamAction()) return;
    const summary = engine.summarize(activePack, session);
    const details = ['Terjawab tuntas: ' + summary.completed + ' dari ' + summary.total + ' soal.'];
    if (summary.incomplete > 0) details.push('Belum tuntas: ' + summary.incomplete + ' soal.');
    if (summary.flagged > 0) details.push('Ditandai ragu-ragu: ' + summary.flagged + ' soal.');
    const hasPending = summary.incomplete > 0 || summary.flagged > 0;
    dialogFrame('Serahkan Jawaban?', 'confirm-dialog', (parent) => {
      parent.append(
        el('p', 'dialog-intro',
          'Apakah kamu sudah yakin semua jawaban telah benar? Jika dilanjutkan, pengerjaan selesai dan kamu tidak dapat kembali mengubah jawaban.'),
        el('p', 'dialog-callout' + (hasPending ? ' is-warning' : ' is-info'), details.join(' '))
      );
      const actions = el('div', 'dialog-actions');
      actions.append(
        button('Periksa Lagi', 'button button-secondary', () => dialog.close()),
        button('Lanjutkan & Serahkan', 'button button-primary', () => {
          session = store.finish(activePack);
          if (!session) go('beranda');
          else go('hasil', activePack);
        }, 'submit')
      );
      parent.append(actions);
    });
  }

  function timeText(seconds) {
    const whole = Math.max(0, Math.floor(seconds ?? 0));
    const fields = [Math.floor(whole / 3600), Math.floor(whole / 60) % 60, whole % 60];
    return fields.map((part) => String(part).padStart(2, '0')).join(':');
  }

  function updateTimer() {
    if (mode !== 'ujian' || !session) return;
    const remaining = engine.remainingSeconds(session);
    const value = timeText(remaining);
    for (const clock of [exam.desktopClock, exam.mobileClock]) {
      if (clock.value.textContent !== value) clock.value.textContent = value;
      clock.timer.classList.toggle('is-urgent', remaining > 0 && remaining <= 300);
    }
    if (remaining > 0) return;
    session = store.load(activePack);
    if (!session) go('beranda');
    else if (session.status === 'completed') go('hasil', activePack);
  }

  function setPaused(paused) {
    if (mode !== 'ujian') return;
    session = paused ? store.pause(activePack) : store.resume(activePack);
    if (!session) go('beranda');
    else if (session.status === 'completed') go('hasil', activePack);
    else {
      updateTimer();
      syncPauseDialog();
    }
  }

  function syncPauseDialog() {
    if (mode !== 'ujian') return;
    const isPauseDialog = dialog.open && dialog.classList.contains('pause-dialog');
    if (session?.pausedAt == null) {
      if (isPauseDialog) dialog.close();
      return;
    }
    if (isPauseDialog) return;
    if (imageDialog.open) imageDialog.close();
    showDrawer(false);
    dialogFrame('Tryout dijeda', 'pause-dialog', (parent) => {
      parent.append(
        el('p', 'dialog-intro', 'Sisa waktu'),
        el('strong', 'pause-time', timeText(engine.remainingSeconds(session))),
        el('p', 'dialog-intro', 'Jawabanmu tetap tersimpan. Waktu berjalan lagi setelah kamu lanjutkan.')
      );
      const actions = el('div', 'dialog-actions');
      actions.append(button('Lanjutkan Tryout', 'button button-primary', () => setPaused(false), 'next'));
      parent.append(actions);
    }, false);
  }

  function makeExamClock(placement) {
    const tools = el('div', 'exam-controls exam-controls-' + placement);
    const timer = el('div', 'timer');
    const value = el('span', '', timeText(engine.remainingSeconds(session)));
    value.setAttribute('role', 'timer');
    value.setAttribute('aria-label', 'Sisa waktu');
    timer.append(icon('clock', 18), value);
    tools.append(timer, button('Jeda', 'button button-secondary pause-button', () => setPaused(true), 'pause', true));
    return { tools, timer, value };
  }

  function makeExamActions(placement) {
    const actions = el('div', 'exam-actions exam-actions-' + placement);
    const homeButton = button('Beranda', 'button button-secondary exam-home-button', confirmBackHome, 'home', true);
    homeButton.setAttribute('aria-label', 'Kembali ke beranda');
    const submitButton = button('Serahkan', 'button button-primary exam-submit-button', confirmSubmit, 'submit', true);
    submitButton.setAttribute('aria-label', 'Serahkan jawaban');
    actions.append(homeButton, submitButton);
    return actions;
  }

  function renderExam(moveFocus) {
    const shell = el('section', 'exam-shell');
    const primary = el('div', 'exam-main');
    const progress = el('section', 'progress-panel');
    const card = el('article', 'question-card');
    card.setAttribute('aria-labelledby', 'question-title');
    const nav = el('nav', 'question-nav');
    nav.setAttribute('aria-label', 'Pindah soal');
    primary.append(progress);
    if (!store.persistent) note(primary, 'Penyimpanan browser diblokir. Jawaban hanya tersedia selama halaman terbuka.');
    primary.append(card, nav);
    const overlay = el('button', 'drawer-overlay');
    overlay.type = 'button';
    overlay.tabIndex = -1;
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    overlay.addEventListener('click', () => showDrawer(false, true));
    const panel = el('aside', 'question-panel');
    panel.id = 'question-panel';
    panel.setAttribute('aria-label', 'Daftar Soal');
    shell.append(primary, overlay, panel);
    main.replaceChildren(shell);
    exam = {
      primary, progress, card, nav, panel, overlay, mobileButton: null,
      desktopClock: makeExamClock('desktop'),
      mobileClock: makeExamClock('mobile'),
      panelActions: makeExamActions('panel'),
      mobileActions: makeExamActions('mobile')
    };
    renderQuestion(moveFocus);
  }

  function renderProgress() {
    const { completed, total } = engine.summarize(activePack, session);
    const label = el('div', 'progress-label');
    label.append(el('span', '', 'Progres pengerjaan'), el('strong', '', completed + ' / ' + total));
    label.title = 'Jawaban tuntas, termasuk soal yang ditandai ragu-ragu';
    const meter = el('progress', 'progress-bar');
    meter.setAttribute('aria-label', 'Soal dengan jawaban tuntas');
    meter.max = total;
    meter.value = completed;
    const mobile = button('Daftar Soal', 'button button-secondary mobile-list', () => showDrawer(true), 'list', true);
    mobile.setAttribute('aria-controls', 'question-panel');
    mobile.setAttribute('aria-expanded', String(drawer));
    exam.mobileButton = mobile;
    const top = el('div', 'progress-top');
    top.append(label);
    const mobileTools = el('div', 'mobile-exam-tools');
    mobileTools.append(exam.mobileClock.tools, mobile, exam.mobileActions);
    top.append(mobileTools);
    exam.progress.replaceChildren(top, meter);
  }

  function openImage(block) {
    const heading = el('div', 'dialog-header');
    heading.append(el('h2', '', block.caption || 'Gambar Soal'), iconButton('close', 'Tutup gambar', () => imageDialog.close()));
    const image = el('img', 'zoom-image');
    image.src = block.src;
    image.alt = block.alt || 'Gambar dari PDF soal';
    imageContent.replaceChildren(heading, image);
    imageDialog.showModal();
  }

  function renderQuestion(moveFocus) {
    const question = activePack.questions[questionIndex];
    const answer = session.answers[question.id];
    const part = el('div', 'question-header');
    const heading = el('h1', '', 'Soal ' + question.number);
    heading.id = 'question-title';
    const instruction = el('span', 'question-hint', view.hint(question));
    part.append(heading, instruction);
    const body = el('div', 'question-body');
    const stem = el('section', 'question-stem');
    stem.setAttribute('aria-label', 'Teks soal');
    stem.tabIndex = 0;
    const questionParts = el('div', 'question-parts');
    view.appendParts(questionParts, question.parts, openImage);
    stem.append(questionParts);
    const responses = el('section', 'question-responses');
    responses.setAttribute('aria-label', 'Pilihan jawaban');
    responses.tabIndex = 0;
    const response = el('div', 'answers');
    response.setAttribute('role', 'group');
    response.setAttribute('aria-label', 'Jawaban soal ' + question.number);
    const partial = el('p', 'partial-status', 'Jawaban belum lengkap.');
    partial.hidden = !engine.isPartial(question, answer);
    const update = (value) => {
      session = store.answer(activePack, question.id, value);
      if (session?.status !== 'in_progress') {
        go(session ? 'hasil' : 'beranda', session ? activePack : undefined);
        return;
      }
      if (session.pausedAt != null) {
        syncPauseDialog();
        return;
      }
      partial.hidden = !engine.isPartial(question, session.answers[question.id]);
      syncSummary();
    };
    view.renderAnswers(response, question, answer, update, {
      key: null, disabled: false,
      openImage, announce, path: question.id
    });
    responses.append(response, partial);
    body.append(stem, responses);
    const stemPosition = exam.card.querySelector('.question-stem')?.scrollTop ?? 0;
    const responsePosition = exam.card.querySelector('.question-responses')?.scrollTop ?? 0;
    exam.card.replaceChildren(part, body);
    syncSummary();
    renderQuestionNav(question);
    if (moveFocus) {
      focusHeading(heading);
    } else {
      stem.scrollTop = stemPosition;
      responses.scrollTop = responsePosition;
    }
  }

  function syncSummary() {
    renderProgress();
    renderPanel();
  }

  function buildSidePanel({ top, statsItems, items, legendItems, actions, currentNumber, onSelect, onPage, focusPage }) {
    const heading = el('div', 'panel-heading');
    heading.append(el('h2', '', 'Daftar Soal'), iconButton('close', 'Tutup daftar soal', () => showDrawer(false, true), 'panel-close'));
    const stats = el('div', 'stats-grid');
    for (const [key, count, label] of statsItems) {
      const stat = el('div', 'stat stat-' + key);
      stat.append(el('strong', '', count), el('span', '', label));
      stats.append(stat);
    }
    const grid = el('div', 'number-grid');
    const start = gridPage * pageSize;
    for (const item of items.slice(start, start + pageSize)) {
      const current = item.number === currentNumber;
      const number = button(String(item.number), 'question-number is-' + item.status + (current ? ' is-current' : ''), () => onSelect(item));
      number.dataset.number = String(item.number);
      number.setAttribute('aria-label', item.label);
      number.title = item.label;
      if (current) number.setAttribute('aria-current', 'step');
      grid.append(number);
    }
    const pages = Math.max(1, Math.ceil(items.length / pageSize));
    const pagination = el('div', 'pagination');
    const previous = iconButton('left', 'Halaman nomor sebelumnya', () => {
      gridPage -= 1;
      onPage(true);
    });
    const next = iconButton('right', 'Halaman nomor berikutnya', () => {
      gridPage += 1;
      onPage(true);
    });
    previous.disabled = gridPage === 0;
    next.disabled = gridPage === pages - 1;
    pagination.append(previous, el('span', '', (gridPage + 1) + ' / ' + pages), next);
    const legend = el('ul', 'legend');
    for (const [key, label] of legendItems) {
      const item = el('li');
      item.append(el('span', 'legend-dot is-' + key), document.createTextNode(label));
      legend.append(item);
    }
    exam.panel.replaceChildren(
      ...(top ? [top] : []),
      heading,
      stats,
      grid,
      pagination,
      legend,
      ...(actions ? [actions] : [])
    );
    if (focusPage) {
      announce('Halaman daftar soal ' + (gridPage + 1) + ' dari ' + pages);
      grid.querySelector('button')?.focus();
    }
  }

  function renderPanel(focusPage = false) {
    const summary = engine.summarize(activePack, session);
    const items = activePack.questions.map((question, index) => {
      const answer = session.answers[question.id];
      const status = engine.getQuestionStatus(question, answer, session.flagged[question.id]);
      const label = 'Soal ' + question.number + ', ' + statusLabels[status] +
        (engine.isPartial(question, answer) ? ', jawaban belum lengkap' : '');
      return { number: question.number, index, status, label };
    });
    buildSidePanel({
      top: exam.desktopClock.tools,
      statsItems: [['answered', summary.answered, 'Dijawab'], ['flagged', summary.flagged, 'Ragu-ragu'], ['unanswered', summary.unanswered, 'Belum dijawab']],
      items,
      legendItems: [
        ['answered', statusLabels.answered],
        ['flagged', statusLabels.flagged],
        ['unanswered', statusLabels.unanswered],
        ['current', 'Soal sedang dikerjakan']
      ],
      actions: exam.panelActions,
      currentNumber: activePack.questions[questionIndex]?.number,
      onSelect: (item) => moveQuestion(item.index),
      onPage: renderPanel,
      focusPage
    });
  }

  function showDrawer(open, restore = false) {
    if (!exam || !exam.panel.isConnected) {
      drawer = false;
      return;
    }
    drawer = open;
    exam.panel.classList.toggle('is-open', open);
    exam.overlay.hidden = !open;
    exam.mobileButton?.setAttribute('aria-expanded', String(open));
    exam.primary.inert = open;
    header.inert = open;
    document.body.classList.toggle('drawer-open', open);
    if (open) {
      exam.panel.setAttribute('role', 'dialog');
      exam.panel.setAttribute('aria-modal', 'true');
      exam.panel.querySelector('.panel-close')?.focus();
    } else {
      exam.panel.removeAttribute('role');
      exam.panel.removeAttribute('aria-modal');
      if (restore) exam.mobileButton?.focus();
    }
  }

  function moveQuestion(index) {
    if (index < 0 || index >= activePack.questions.length) return;
    showDrawer(false);
    session = store.navigate(activePack, activePack.questions[index].id);
    if (session?.status !== 'in_progress') {
      go(session ? 'hasil' : 'beranda', session ? activePack : undefined);
      return;
    }
    if (session.pausedAt != null) {
      syncPauseDialog();
      return;
    }
    questionIndex = index;
    gridPage = Math.floor(index / pageSize);
    renderQuestion(true);
  }

  function renderQuestionNav(question) {
    const previous = button('Sebelumnya', 'button button-secondary', () => moveQuestion(questionIndex - 1), 'previous', true);
    previous.disabled = questionIndex === 0;
    const last = questionIndex === activePack.questions.length - 1;
    const next = button(last ? 'Soal Terakhir' : 'Selanjutnya', 'button button-primary', () => moveQuestion(questionIndex + 1), 'next');
    next.disabled = last;
    const center = el('div', 'nav-center');
    const flag = el('label', 'flag-control');
    const input = el('input');
    input.type = 'checkbox';
    input.checked = Boolean(session.flagged[question.id]);
    input.addEventListener('change', () => {
      session = store.flag(activePack, question.id, input.checked);
      if (!session) go('beranda');
      else if (session.status === 'completed') go('hasil', activePack);
      else if (session.pausedAt != null) syncPauseDialog();
      else syncSummary();
    });
    flag.append(input, el('span', '', 'Tandai Ragu-ragu'));
    center.append(flag);
    exam.nav.replaceChildren(previous, center, next);
  }

  function resultStats(values) {
    const container = el('dl', 'results-stats');
    for (const [value, label] of values) {
      const item = el('div', 'result-stat');
      item.append(el('dt', '', label), el('dd', '', value));
      container.append(item);
    }
    return container;
  }

  function renderResults(moveFocus) {
    exam = null;
    const grading = engine.grade(activePack, session);
    const counts = engine.summarize(activePack, session);
    const shell = el('section', 'results-shell');
    const card = el('article', 'results-card');
    const heading = el('h1', '', 'Hasil Tryout PPG');
    card.append(el('p', 'result-kicker', session.completionReason === 'timeout' ? 'Waktu habis' : 'Tryout selesai'), heading,
      el('p', 'result-pack-name', packLabel(activePack)));
    const score = el('div', 'result-score');
    if (grading.score == null) {
      score.append(el('strong', '', 'Belum dapat dinilai'),
        el('span', '', grading.gradable === 0 ? 'Kunci jawaban belum tersedia.' : 'Kunci belum lengkap untuk menghasilkan nilai akhir paket.'));
    } else {
      score.append(el('strong', '', new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(grading.score)),
        el('span', '', 'Nilai dari 100'));
    }
    card.append(score);
    const figure = grading.gradable > 0 ? [
      [grading.correct, 'Benar'], [grading.incorrect, 'Salah'], [grading.unanswered, 'Kosong atau belum tuntas']
    ] : [];
    if (grading.ungraded > 0) figure.push([grading.ungraded, 'Belum dapat dinilai']);
    card.append(resultStats(figure));
    card.append(resultStats([
      [counts.completed + ' / ' + counts.total, 'Soal tuntas'],
      [timeText(engine.elapsedSeconds(session)), 'Waktu digunakan'],
      [timeText(engine.remainingSeconds(session)), 'Waktu tersisa']
    ]));
    if (grading.score != null) note(card, 'Nilai = poin diperoleh ÷ poin maksimum × 100.');
    if (grading.ungradedQuestions.length) {
      note(card, 'Nomor yang belum dapat dinilai: ' + grading.ungradedQuestions.map((question) => question.number ?? question).join(', ') + '.');
    }
    const actions = el('div', 'result-actions');
    const hasExplanation = activePack.questions.some((question) => question.explanation?.length);
    actions.append(
      button('Kembali ke Beranda', 'button button-secondary', () => go('beranda'), 'previous', true),
      button('Mulai Ulang', 'button button-secondary', () => confirmReset(activePack)),
      button(hasExplanation ? 'Lihat Pembahasan' : 'Tinjau Jawaban', 'button button-primary', () => go('tinjau', activePack), 'next')
    );
    card.append(actions);
    note(card, store.persistent ? 'Hasil disimpan di browser ini.' : 'Hasil tersedia sementara selama halaman ini terbuka.');
    shell.append(card);
    main.replaceChildren(shell);
    if (moveFocus) focusHeading(heading);
  }

  function formatAnswerSummary(question, value) {
    const kind = question.type === 'true_false' ? (question.statements?.length ? 'category' : 'single') :
      ({ single_choice: 'single', multiple_select: 'multiple', statement_matrix: 'category' }[question.type] || question.type);
    if (kind === 'single') return typeof value === 'string' && value ? value : 'Belum dijawab';
    if (kind === 'multiple') return Array.isArray(value) && value.length ? value.join(', ') : 'Belum dijawab';
    if (kind === 'category') {
      const categories = new Map((question.categories || []).map((c) => [c.id, c.text]));
      const rows = (question.statements || []).map((statement) => {
        const chosen = value?.[statement.id];
        return chosen ? statement.id + ': ' + (categories.get(chosen) || chosen) : null;
      }).filter(Boolean);
      return rows.length ? rows.join(' · ') : 'Belum dijawab';
    }
    return null;
  }

  function renderReview(moveFocus) {
    const grading = engine.grade(activePack, session);
    const statusText = {
      correct: 'Benar',
      incorrect: 'Salah',
      unanswered: 'Kosong',
      ungraded: 'Belum dinilai'
    };
    const items = activePack.questions.map((question, index) => {
      const answer = session.answers[question.id];
      const grade = engine.gradeQuestion(question, answer);
      const partial = engine.isPartial(question, answer);
      const label = 'Soal ' + question.number + ', ' + (partial ? 'Belum tuntas' : statusText[grade.status]);
      return { question, number: question.number, index, answer, grade, partial, status: grade.status, label };
    });

    let activeFilter = 'all';
    let activeNumber = items[0]?.number ?? 1;
    gridPage = 0;

    const shell = el('section', 'exam-shell study-shell');
    const primary = el('div', 'exam-main study-main');
    const topbar = el('header', 'study-topbar');
    const topHead = el('div', 'study-topbar-head');
    const info = el('div', 'study-topbar-info');
    const heading = el('h1', '', 'Pembahasan · ' + packLabel(activePack));
    heading.id = 'study-title';
    const scoreText = grading.score == null
      ? 'Belum dapat dinilai'
      : 'Nilai ' + new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(grading.score) +
        ' · ' + grading.correct + '/' + grading.gradable + ' benar';
    info.append(heading, el('span', 'study-score-pill', scoreText));

    const mobileListBtn = button('Daftar Soal', 'button button-secondary mobile-list', () => showDrawer(true), 'list', true);
    mobileListBtn.setAttribute('aria-controls', 'question-panel');
    mobileListBtn.setAttribute('aria-expanded', String(drawer));
    const topActions = el('div', 'study-topbar-actions');
    topActions.append(
      mobileListBtn,
      button('Hasil', 'button button-secondary', () => go('hasil', activePack), 'previous', true),
      button('Beranda', 'button button-primary', () => go('beranda'), 'home', true)
    );
    topHead.append(info, topActions);

    const filterChoices = [
      ['all', 'Semua', items.length],
      ['incorrect', 'Salah', grading.incorrect],
      ['correct', 'Benar', grading.correct],
      ['unanswered', 'Kosong', grading.unanswered]
    ];
    if (grading.ungraded > 0) filterChoices.push(['ungraded', 'Belum Dinilai', grading.ungraded]);

    const filters = el('div', 'study-filters');
    filters.setAttribute('role', 'group');
    filters.setAttribute('aria-label', 'Filter status jawaban');
    const filterButtons = new Map();

    const scrollArea = el('div', 'study-scroll');
    const list = el('div', 'study-list');
    scrollArea.append(list);

    topbar.append(topHead, filters);
    primary.append(topbar);
    if (!store.persistent) note(primary, 'Penyimpanan browser diblokir. Hasil tersedia selama halaman terbuka.');
    primary.append(scrollArea);

    const overlay = el('button', 'drawer-overlay');
    overlay.type = 'button';
    overlay.tabIndex = -1;
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    overlay.addEventListener('click', () => showDrawer(false, true));
    const panel = el('aside', 'question-panel study-panel');
    panel.id = 'question-panel';
    panel.setAttribute('aria-label', 'Daftar Soal Pembahasan');

    shell.append(primary, overlay, panel);
    main.replaceChildren(shell);

    const panelScore = el('div', 'study-panel-score');
    panelScore.append(
      el('span', '', 'Nilai Akhir'),
      el('strong', '', grading.score == null ? '—' : new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(grading.score))
    );
    const panelActions = el('div', 'exam-actions exam-actions-panel');
    const resultBtn = button('Hasil', 'button button-secondary', () => go('hasil', activePack), 'previous', true);
    resultBtn.setAttribute('aria-label', 'Kembali ke hasil');
    const homeBtn = button('Beranda', 'button button-primary', () => go('beranda'), 'home', true);
    homeBtn.setAttribute('aria-label', 'Kembali ke beranda');
    panelActions.append(resultBtn, homeBtn);

    exam = { primary, panel, overlay, mobileButton: mobileListBtn };

    const cardByNumber = new Map();

    function buildStudyCard(item) {
      const { question, answer, grade, partial } = item;
      const card = el('article', 'study-card is-' + grade.status);
      card.id = 'study-q-' + question.number;
      card.dataset.number = String(question.number);

      const cardHeader = el('div', 'study-card-header');
      const meta = el('div', 'study-card-meta');
      const cardTitle = el('h2', 'study-card-number', 'Soal ' + question.number);
      meta.append(cardTitle);
      if (question.section) meta.append(el('span', 'study-tag', question.section));
      meta.append(el('span', 'study-tag is-format', question.formatLabel || view.hint(question)));

      const verdictLabel = partial ? 'Belum Tuntas' : statusText[grade.status];
      const verdictIcon = grade.status === 'correct' ? 'submit' : grade.status === 'incorrect' ? 'wrong' : null;
      const verdict = el('span', 'study-verdict is-' + grade.status);
      if (verdictIcon) verdict.append(icon(verdictIcon, 16));
      verdict.append(document.createTextNode(verdictLabel));
      cardHeader.append(meta, verdict);

      const body = el('div', 'study-card-body');
      const questionCol = el('div', 'study-question-col');
      const parts = el('div', 'question-parts');
      view.appendParts(parts, question.parts, openImage);
      const answers = el('div', 'answers');
      answers.setAttribute('role', 'group');
      answers.setAttribute('aria-label', 'Jawaban soal ' + question.number);
      view.renderAnswers(answers, question, answer, () => {}, {
        key: question.correctAnswer, disabled: true,
        openImage, announce, path: question.id
      });
      questionCol.append(parts, answers);

      const explCol = el('aside', 'study-explanation-col');
      explCol.setAttribute('aria-label', 'Pembahasan soal ' + question.number);
      const explBox = el('div', 'study-explanation-box');
      const explHead = el('div', 'study-explanation-head');
      explHead.append(icon('book', 18), el('h3', '', 'Pembahasan'));
      explBox.append(explHead);

      const keySummary = question.correctAnswer != null ? formatAnswerSummary(question, question.correctAnswer) : null;
      if (keySummary) {
        const userSummary = formatAnswerSummary(question, answer);
        const keyBox = el('div', 'study-key-box');
        const keyRow = el('div', 'study-key-row');
        keyRow.append(el('span', 'study-key-label', 'Kunci jawaban'), el('strong', 'study-key-value', keySummary));
        const userRow = el('div', 'study-key-row');
        userRow.append(el('span', 'study-key-label', 'Jawaban kamu'), el('span', 'study-user-value', userSummary));
        keyBox.append(keyRow, userRow);
        explBox.append(keyBox);
      }

      const explContent = el('div', 'study-explanation-content');
      if (question.explanation?.length) {
        view.appendParts(explContent, question.explanation, openImage);
      } else {
        explContent.append(el('p', 'local-note', 'Pembahasan belum tersedia untuk soal ini.'));
      }
      explBox.append(explContent);
      explCol.append(explBox);
      body.append(questionCol, explCol);
      card.append(cardHeader, body);
      return card;
    }

    function syncActiveHighlight(number) {
      if (activeNumber === number) return;
      activeNumber = number;
      const targetPage = Math.floor((number - 1) / pageSize);
      if (targetPage !== gridPage) {
        gridPage = targetPage;
        renderStudyPanel(false);
        return;
      }
      for (const btn of exam.panel.querySelectorAll('.question-number')) {
        const isTarget = Number(btn.dataset.number) === number;
        btn.classList.toggle('is-current', isTarget);
        if (isTarget) btn.setAttribute('aria-current', 'step');
        else btn.removeAttribute('aria-current');
      }
    }

    function renderStudyPanel(focusPage = false) {
      buildSidePanel({
        top: panelScore,
        statsItems: [
          ['correct', grading.correct, 'Benar'],
          ['incorrect', grading.incorrect, 'Salah'],
          ['unanswered', grading.unanswered, 'Kosong']
        ],
        items,
        legendItems: [
          ['correct', 'Benar'],
          ['incorrect', 'Salah'],
          ['unanswered', 'Kosong'],
          ['current', 'Sedang dilihat']
        ],
        actions: panelActions,
        currentNumber: activeNumber,
        onSelect: (item) => jumpToQuestion(item.number),
        onPage: renderStudyPanel,
        focusPage
      });
    }

    let ignoreScrollUntil = 0;

    function renderStudyList() {
      const visible = activeFilter === 'all' ? items : items.filter((item) => item.status === activeFilter);
      cardByNumber.clear();
      if (!visible.length) {
        const empty = el('div', 'study-empty');
        const label = filterChoices.find(([key]) => key === activeFilter)?.[1] || '';
        empty.append(
          el('p', '', 'Tidak ada soal dengan status ' + label + '.'),
          button('Tampilkan Semua Soal', 'button button-secondary', () => applyFilter('all'))
        );
        list.replaceChildren(empty);
        renderStudyPanel(false);
        return;
      }
      const fragment = document.createDocumentFragment();
      for (const item of visible) {
        const card = buildStudyCard(item);
        cardByNumber.set(item.number, card);
        fragment.append(card);
      }
      list.replaceChildren(fragment);
      if (!cardByNumber.has(activeNumber)) activeNumber = visible[0].number;
      renderStudyPanel(false);
    }

    function applyFilter(filterKey) {
      if (activeFilter === filterKey) return;
      activeFilter = filterKey;
      for (const [key, control] of filterButtons) control.setAttribute('aria-pressed', String(key === filterKey));
      renderStudyList();
      if (window.matchMedia('(min-width: 1100px)').matches) scrollArea.scrollTop = 0;
      else window.scrollTo(0, 0);
    }

    function jumpToQuestion(number) {
      showDrawer(false);
      const targetItem = items.find((item) => item.number === number);
      if (!targetItem) return;
      if (activeFilter !== 'all' && targetItem.status !== activeFilter) {
        activeFilter = 'all';
        for (const [key, control] of filterButtons) control.setAttribute('aria-pressed', String(key === 'all'));
        renderStudyList();
      }
      activeNumber = number;
      gridPage = Math.floor(targetItem.index / pageSize);
      renderStudyPanel(false);
      const card = cardByNumber.get(number);
      if (!card) return;
      ignoreScrollUntil = Date.now() + 500;
      if (window.matchMedia('(min-width: 1100px)').matches) {
        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        const offset = topbar.getBoundingClientRect().height + 10;
        const top = window.scrollY + card.getBoundingClientRect().top - offset;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      }
    }

    for (const [key, label, count] of filterChoices) {
      const chip = button(label + ' (' + count + ')', 'catalog-filter', () => applyFilter(key));
      chip.setAttribute('aria-pressed', String(key === activeFilter));
      filterButtons.set(key, chip);
      filters.append(chip);
    }

    renderStudyList();

    let rafId = 0;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        if (mode !== 'tinjau' || !cardByNumber.size || Date.now() < ignoreScrollUntil) return;
        const isDesktop = window.matchMedia('(min-width: 1100px)').matches;
        const atBottom = isDesktop
          ? scrollArea.scrollTop + scrollArea.clientHeight >= scrollArea.scrollHeight - 4
          : window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
        if (atBottom) {
          let last = null;
          for (const number of cardByNumber.keys()) last = number;
          if (last != null) syncActiveHighlight(last);
          return;
        }
        const threshold = isDesktop
          ? scrollArea.getBoundingClientRect().top + 90
          : topbar.getBoundingClientRect().bottom + 40;
        let current = null;
        for (const [number, card] of cardByNumber) {
          const rect = card.getBoundingClientRect();
          if (rect.bottom > threshold) {
            current = number;
            break;
          }
        }
        if (current != null) syncActiveHighlight(current);
      });
    };
    scrollArea.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    cleanupView = () => {
      if (rafId) cancelAnimationFrame(rafId);
      scrollArea.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', onScroll);
    };

    if (moveFocus) focusHeading(heading);
  }

  for (const modal of [dialog, imageDialog]) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal && !modal.classList.contains('pause-dialog')) modal.close();
    });
  }
  dialog.addEventListener('cancel', (event) => {
    if (dialog.classList.contains('pause-dialog')) event.preventDefault();
  });
  dialog.addEventListener('close', () => {
    syncPauseDialog();
    catalog?.clearSelection?.();
  });

  try {
    if (!view || !engine || !catalogView) throw new Error('Aplikasi tidak dapat dimuat.');
    packs = validatePacks(rawPacks);
    store = engine.createSessionStore();
    catalog = catalogView.create({
      home,
      packs,
      programs: rawPrograms,
      store,
      engine,
      button,
      icon,
      iconButton,
      timeText,
      start: startAttempt,
      openDialog: dialogFrame,
      closeDialog: () => dialog.close()
    });
    document.querySelector('.skip-link').addEventListener('click', (event) => {
      event.preventDefault();
      main.focus();
    });
    window.addEventListener('hashchange', () => {
      const current = '#' + mode + (activePack ? '/' + activePack.id : '');
      if (location.hash === current) return;
      if (mode === 'ujian') {
        const attempt = store.load(activePack);
        if (attempt?.status === 'in_progress') {
          history.replaceState(null, '', current);
          return;
        }
        if (attempt?.status === 'completed') history.replaceState(null, '', '#hasil/' + activePack.id);
      }
      route(true);
    });
    window.addEventListener('storage', () => {
      if (mode === 'beranda') {
        catalog.refresh();
        return;
      }
      if (mode !== 'ujian') return;
      const updated = store.load(activePack);
      if (!updated) go('beranda');
      else if (updated.status === 'completed') go('hasil', activePack);
      else if (updated.startedAt !== session.startedAt) route();
      else {
        const answersChanged = JSON.stringify(updated.answers) !== JSON.stringify(session.answers) ||
          JSON.stringify(updated.flagged) !== JSON.stringify(session.flagged);
        session = updated;
        if (answersChanged) renderQuestion(false);
        updateTimer();
        syncPauseDialog();
      }
    });
    window.matchMedia('(min-width: 1100px)').addEventListener('change', (event) => {
      if (event.matches && drawer) showDrawer(false);
    });
    document.addEventListener('keydown', (event) => {
      if (!drawer) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        showDrawer(false, true);
      }
      if (event.key !== 'Tab') return;
      const controls = [...exam.panel.querySelectorAll('button:not(:disabled)')];
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    });
    document.addEventListener('visibilitychange', updateTimer);
    window.addEventListener('pageshow', () => {
      if (mode === 'beranda') catalog.refresh();
      else updateTimer();
    });
    window.setInterval(updateTimer, 250);
    route();
  } catch (error) {
    console.error(error);
    const message = home.querySelector('.catalog-empty');
    message.hidden = false;
    message.textContent = 'Bank soal belum dapat dibuka. Pastikan semua berkas proyek tersimpan dalam folder yang sama, lalu muat ulang halaman.';
    home.querySelector('.catalog-tools').hidden = true;
  }
})();
