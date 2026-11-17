(() => {
  'use strict';

  const textTypes = new Set(['short_text', 'numeric', 'essay', 'unknown']);
  const aliases = {
    single_choice: 'single', multiple_select: 'multiple', statement_matrix: 'category',
    short_answer: 'short_text'
  };
  const hints = {
    single: 'Pilih satu jawaban yang paling tepat',
    multiple: 'Jawaban dapat lebih dari satu',
    category: 'Pilih satu kategori untuk setiap pernyataan',
    matching: 'Pasangkan setiap pernyataan',
    ordering: 'Susun pilihan dalam urutan yang tepat',
    short_text: 'Tulis jawaban singkat',
    numeric: 'Masukkan jawaban berupa angka',
    essay: 'Tulis jawaban Anda',
    composite: 'Jawab setiap bagian soal',
    unknown: 'Ikuti petunjuk pada soal'
  };

  function element(tag, className, content) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content != null) el.textContent = content;
    return el;
  }

  function type(question) {
    if (question.type === 'true_false') return question.statements?.length ? 'category' : 'single';
    return aliases[question.type] || question.type;
  }

  function hint(question) {
    return question.instruction || hints[type(question)] || hints.unknown;
  }

  function appendParts(parent, parts, openImage) {
    if (typeof parts === 'string') parts = [{ type: 'text', text: parts }];
    for (const block of parts || []) {
      if (block.type === 'text') {
        parent.append(element('p', 'source-text', block.text));
      } else if (block.type === 'image') {
        if (!/^(?:\.\/)?assets\/questions\/[a-z0-9_./-]+\.(?:png|webp|jpe?g|svg)$/i.test(block.src) ||
            block.src.includes('..')) continue;
        const figure = element('figure', 'question-figure');
        const button = element('button', 'question-image-button');
        button.type = 'button';
        button.setAttribute('aria-label', 'Perbesar ' + (block.alt || 'gambar soal'));
        const image = element('img');
        image.src = block.src;
        image.alt = block.alt || 'Gambar dari PDF soal';
        if (block.width && block.height) {
          image.width = block.width;
          image.height = block.height;
        }
        button.append(image);
        button.addEventListener('click', () => openImage(block));
        figure.append(button);
        if (block.caption) figure.append(element('figcaption', '', block.caption));
        parent.append(figure);
      } else if (block.type === 'table') {
        const wrap = element('div', 'stimulus-table-wrap');
        const table = element('table', 'stimulus-table');
        if (block.caption) table.append(element('caption', '', block.caption));
        const makeRow = (cells, header) => {
          const row = element('tr');
          for (const cell of cells) {
            const td = element(header ? 'th' : 'td');
            if (header) td.scope = 'col';
            if (Array.isArray(cell)) appendParts(td, cell, openImage);
            else if (cell?.parts) appendParts(td, cell.parts, openImage);
            else td.textContent = cell?.text ?? cell ?? '';
            row.append(td);
          }
          return row;
        };
        if (block.headers?.length) {
          const thead = element('thead');
          thead.append(makeRow(block.headers, true));
          table.append(thead);
        }
        const tbody = element('tbody');
        for (const cells of block.rows || []) tbody.append(makeRow(cells, false));
        table.append(tbody);
        wrap.append(table);
        parent.append(wrap);
      }
    }
  }

  function itemContent(parent, item, openImage) {
    if (item.text) parent.append(element('span', 'source-inline', item.text));
    if (item.parts) appendParts(parent, item.parts, openImage);
  }

  function optionInputs(parent, question, answer, update, settings, kind) {
    const { disabled, key, path, openImage } = settings;
    const options = question.options || [];
    const selected = new Set(kind === 'multiple' ? answer || [] : [answer]);
    const correct = new Set(kind === 'multiple' && Array.isArray(key) ? key : [key]);
    for (const option of options) {
      const row = element('div', 'option-row');
      const label = element('label', 'option-label');
      const input = element('input');
      input.type = kind === 'multiple' ? 'checkbox' : 'radio';
      input.name = 'jawaban-' + path;
      input.value = option.id;
      input.checked = selected.has(option.id);
      input.disabled = disabled;
      const letter = element('span', 'option-letter', option.id + '.');
      const content = element('span', 'option-text');
      itemContent(content, { text: option.text }, openImage);
      label.append(input, letter, content);
      row.append(label);
      if (option.parts) {
        const media = element('div', 'option-parts');
        appendParts(media, option.parts, openImage);
        row.append(media);
      }
      row.classList.toggle('is-selected', input.checked);
      if (disabled) {
        const isCorrect = correct.has(option.id);
        if (isCorrect) {
          row.classList.add('is-correct-option');
          row.append(element('span', 'option-key', input.checked ? 'Jawaban kamu · Kunci' : 'Kunci jawaban'));
        } else if (input.checked) {
          row.classList.add('is-wrong-option');
          row.append(element('span', 'option-key is-wrong', 'Jawaban kamu'));
        }
      }
      input.addEventListener('change', () => {
        if (kind === 'single') {
          update(option.id);
          parent.querySelectorAll('.option-row').forEach((node) => {
            node.classList.toggle('is-selected', node.querySelector('input').checked);
          });
          return;
        }
        if (input.checked) selected.add(option.id);
        else selected.delete(option.id);
        const max = question.constraints?.exactSelections ?? question.exactSelections ??
          question.constraints?.maxSelections ?? question.maxSelections;
        if (Number.isInteger(max) && selected.size > max) {
          selected.delete(option.id);
          input.checked = false;
          settings.announce('Maksimal ' + max + ' pilihan.');
        }
        row.classList.toggle('is-selected', input.checked);
        update([...selected]);
      });
      parent.append(row);
    }
  }

  function matrixInputs(parent, question, answer, update, settings) {
    const state = { ...answer };
    const table = element('table', 'category-table');
    table.setAttribute('role', 'table');
    const thead = element('thead');
    const heading = element('tr');
    thead.setAttribute('role', 'rowgroup');
    heading.setAttribute('role', 'row');
    const label = element('th', '', question.statementLabel || 'Pernyataan');
    label.scope = 'col';
    label.setAttribute('role', 'columnheader');
    heading.append(label);
    for (const category of question.categories || []) {
      const th = element('th', '', category.text);
      th.scope = 'col';
      th.setAttribute('role', 'columnheader');
      heading.append(th);
    }
    thead.append(heading);
    table.append(thead);
    const body = element('tbody');
    body.setAttribute('role', 'rowgroup');
    for (const statement of question.statements || []) {
      const row = element('tr');
      row.setAttribute('role', 'row');
      const th = element('th', '', '');
      th.scope = 'row';
      th.setAttribute('role', 'rowheader');
      itemContent(th, statement, settings.openImage);
      row.append(th);
      for (const category of question.categories || []) {
        const cell = element('td');
        cell.setAttribute('role', 'cell');
        const choice = element('label', 'category-choice');
        const input = element('input');
        input.type = 'radio';
        input.name = settings.path + '-' + statement.id;
        input.value = category.id;
        input.checked = state[statement.id] === category.id;
        input.disabled = settings.disabled;
        input.setAttribute('aria-label', category.text + ' untuk pernyataan ' + (body.rows.length + 1));
        choice.append(input, element('span', 'category-mobile-label', category.text));
        if (settings.disabled) {
          const isKey = settings.key?.[statement.id] === category.id;
          if (isKey) {
            choice.classList.add('is-correct-option');
            cell.classList.add('is-correct-cell');
            choice.append(element('span', 'matrix-key', input.checked ? 'Benar · Kunci' : 'Kunci'));
          } else if (input.checked) {
            choice.classList.add('is-wrong-option');
            cell.classList.add('is-wrong-cell');
            choice.append(element('span', 'matrix-key is-wrong', 'Pilihanmu'));
          }
        }
        input.addEventListener('change', () => {
          state[statement.id] = category.id;
          update({ ...state });
        });
        cell.append(choice);
        row.append(cell);
      }
      body.append(row);
    }
    table.append(body);
    parent.append(table);
  }

  function matchingInputs(parent, question, answer, update, settings) {
    const state = { ...answer };
    const selects = [];
    for (const item of question.items || []) {
      const row = element('label', 'field-row');
      row.append(element('span', '', item.text));
      const select = element('select', 'answer-field');
      const placeholder = element('option', '', 'Pilih pasangan');
      placeholder.value = '';
      select.append(placeholder);
      for (const choice of question.choices || []) {
        const option = element('option', '', choice.text);
        option.value = choice.id;
        select.append(option);
      }
      select.value = state[item.id] || '';
      select.disabled = settings.disabled;
      selects.push(select);
      const refreshChoices = () => {
        if (question.constraints?.allowReuse !== false) return;
        const used = new Set(Object.values(state));
        for (const field of selects) {
          for (const option of field.options) {
            option.disabled = option.value !== field.value && used.has(option.value);
          }
        }
      };
      select.addEventListener('change', () => {
        if (select.value) state[item.id] = select.value;
        else delete state[item.id];
        refreshChoices();
        update({ ...state });
      });
      refreshChoices();
      row.append(select);
      if (settings.key?.[item.id]) {
        const value = question.choices.find((choice) => choice.id === settings.key[item.id]);
        if (value) row.append(element('span', 'option-key', 'Kunci: ' + value.text));
      }
      parent.append(row);
    }
  }

  function orderingInputs(parent, question, answer, update, settings) {
    const items = new Map((question.items || []).map((item) => [item.id, item.text]));
    const ids = answer?.length ? [...answer] : [...items.keys()];
    const grid = element('ol', 'ordering-list');
    const draw = (focusIndex, focusOffset) => {
      grid.replaceChildren();
      ids.forEach((id, index) => {
        const row = element('li', 'ordering-row');
        row.append(element('span', '', items.get(id)));
        for (const offset of [-1, 1]) {
          const text = offset === -1 ? 'Naik' : 'Turun';
          const button = element('button', 'button button-secondary', text);
          button.type = 'button';
          button.setAttribute('aria-label', text + 'kan ' + items.get(id));
          button.disabled = settings.disabled || index + offset < 0 || index + offset >= ids.length;
          button.addEventListener('click', () => {
            const next = index + offset;
            [ids[index], ids[next]] = [ids[next], ids[index]];
            update([...ids]);
            draw(next, next + offset < 0 || next + offset >= ids.length ? -offset : offset);
          });
          row.append(button);
          if (index === focusIndex && offset === focusOffset) queueMicrotask(() => button.focus());
        }
        grid.append(row);
      });
    };
    draw();
    parent.append(grid);
    if (!settings.disabled) {
      const use = element('button', 'button button-secondary', 'Gunakan urutan ini');
      use.type = 'button';
      use.addEventListener('click', () => update([...ids]));
      parent.append(use);
    } else if (Array.isArray(settings.key)) {
      parent.append(element('p', 'option-key', 'Kunci: ' + settings.key.map((id) => items.get(id)).join(' → ')));
    }
  }

  function textInputs(parent, question, answer, update, settings, kind) {
    const fields = question.fields?.length ? question.fields : [{ id: '', text: 'Jawaban Anda' }];
    const state = typeof answer === 'object' ? { ...answer } : {};
    for (const field of fields) {
      const label = element('label', 'field-row');
      label.append(element('span', '', field.text));
      const input = element(kind === 'essay' ? 'textarea' : 'input', 'answer-field');
      if (kind === 'numeric') input.inputMode = 'decimal';
      if (kind === 'essay') input.rows = 6;
      input.value = field.id ? state[field.id] ?? '' : answer ?? '';
      input.readOnly = settings.disabled;
      input.addEventListener('input', () => {
        if (field.id) {
          state[field.id] = input.value;
          update({ ...state });
        } else {
          update(input.value);
        }
      });
      label.append(input);
      const key = field.id ? settings.key?.[field.id] : settings.key;
      if (key != null) label.append(element('span', 'option-key', 'Kunci: ' + key));
      parent.append(label);
    }
  }

  function renderAnswers(parent, question, answer, update, settings) {
    const kind = type(question);
    if (kind === 'single' || kind === 'multiple') {
      optionInputs(parent, question, answer, update, settings, kind);
    } else if (kind === 'category') {
      matrixInputs(parent, question, answer, update, settings);
    } else if (kind === 'matching') {
      matchingInputs(parent, question, answer, update, settings);
    } else if (kind === 'ordering') {
      orderingInputs(parent, question, answer, update, settings);
    } else if (kind === 'composite') {
      const state = { ...answer };
      for (const [index, child] of (question.questions || []).entries()) {
        const fieldset = element('fieldset', 'composite-group');
        fieldset.append(element('legend', '', child.title || 'Bagian ' + (index + 1)));
        appendParts(fieldset, child.parts, settings.openImage);
        const area = element('div', 'answers');
        renderAnswers(area, child, state[child.id], (value) => {
          state[child.id] = value;
          update({ ...state });
        }, { ...settings, key: settings.key?.[child.id], path: settings.path + '-' + child.id });
        fieldset.append(area);
        parent.append(fieldset);
      }
    } else if (textTypes.has(kind)) {
      textInputs(parent, question, answer, update, settings, kind);
    } else {
      parent.append(element('p', 'local-note', 'Format jawaban soal ini belum tersedia.'));
    }
  }

  window.TryoutQuestionView = { element, hint, appendParts, renderAnswers };
})();