(function (root) {
  'use strict';

  const schemaVersion = 1;
  const storagePrefix = 'tryoutPPG:v1:';
  const versions = new WeakMap();
  const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
  const isRecord = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

  function questionType(question) {
    if (question.type === 'true_false') return question.statements?.length ? 'category' : 'single';
    const types = {
      single_choice: 'single',
      multiple_select: 'multiple',
      statement_matrix: 'category',
      short_answer: 'short_text'
    };
    return types[question.type] || question.type;
  }

  function hasId(choices, id) {
    return choices.some((choice) => choice.id === id);
  }

  function selectionBounds(question) {
    const constraints = question.constraints || question;
    const exact = constraints.exactSelections;
    return {
      min: exact ?? constraints.minSelections ?? 1,
      max: exact ?? constraints.maxSelections ?? Infinity
    };
  }

  function cleanRows(rows, answer, clean) {
    if (!isRecord(answer)) return {};
    const entries = [];
    for (const row of rows) {
      if (!own(answer, row.id)) continue;
      const value = clean(row, answer[row.id]);
      if (hasResponse(value)) entries.push([row.id, value]);
    }
    return Object.fromEntries(entries);
  }

  function cleanIds(choices, answer) {
    return Array.isArray(answer) ? [...new Set(answer.filter((id) => hasId(choices, id)))] : [];
  }

  function cleanText(answer) {
    return typeof answer === 'string' ? answer : '';
  }

  function cleanAnswer(question, answer) {
    switch (questionType(question)) {
      case 'single':
        return hasId(question.options, answer) ? answer : null;
      case 'multiple':
        return cleanIds(question.options, answer);
      case 'category':
        return cleanRows(question.statements, answer,
          (_, value) => hasId(question.categories, value) ? value : null);
      case 'matching':
        return cleanRows(question.items, answer, (_, value) => hasId(question.choices, value) ? value : null);
      case 'ordering':
        return cleanIds(question.items, answer);
      case 'short_text':
      case 'numeric':
        return question.fields?.length ? cleanRows(question.fields, answer, (_, value) => cleanText(value)) :
          cleanText(answer);
      case 'essay':
      case 'unknown':
        return cleanText(answer);
      case 'composite':
        return cleanRows(question.questions, answer, cleanAnswer);
      default:
        return null;
    }
  }

  function hasResponse(cleaned) {
    if (Array.isArray(cleaned)) return cleaned.length > 0;
    if (isRecord(cleaned)) return Object.keys(cleaned).length > 0;
    return typeof cleaned === 'string' ? cleaned.trim().length > 0 : cleaned !== null;
  }

  function completeRows(rows, cleaned) {
    return hasResponse(cleaned) && rows.every(({ id, required }) => required === false || own(cleaned, id));
  }

  function isComplete(question, answer) {
    const cleaned = cleanAnswer(question, answer);
    switch (questionType(question)) {
      case 'single':
        return cleaned !== null;
      case 'multiple': {
        const { min, max } = selectionBounds(question);
        return cleaned.length >= Math.max(1, min) && cleaned.length <= max;
      }
      case 'category':
        return completeRows(question.statements, cleaned);
      case 'matching': {
        const selected = Object.values(cleaned);
        return completeRows(question.items, cleaned) &&
          (question.constraints?.allowReuse !== false || new Set(selected).size === selected.length);
      }
      case 'ordering':
        return cleaned.length > 0 && cleaned.length === question.items.length;
      case 'short_text':
      case 'numeric':
        return question.fields?.length ? completeRows(question.fields, cleaned) : hasResponse(cleaned);
      case 'essay':
      case 'unknown':
        return hasResponse(cleaned);
      case 'composite':
        return hasResponse(cleaned) && question.questions.every((child) =>
          child.required === false || isComplete(child, cleaned[child.id]));
      default:
        return false;
    }
  }

  function isAnswered(question, answer) {
    return questionType(question) === 'multiple' ? hasResponse(cleanAnswer(question, answer)) :
      isComplete(question, answer);
  }

  function isPartial(question, answer) {
    return hasResponse(cleanAnswer(question, answer)) && !isComplete(question, answer);
  }

  function getQuestionStatus(question, answer, flagged) {
    if (flagged) return 'flagged';
    return isComplete(question, answer) ? 'answered' : 'unanswered';
  }

  function summarize(pack, session) {
    const summary = {
      total: pack.questions.length,
      answered: 0,
      flagged: 0,
      unanswered: 0,
      completed: 0,
      incomplete: 0,
      partial: 0
    };
    for (const question of pack.questions) {
      const answer = session?.answers[question.id];
      const flagged = session?.flagged[question.id];
      summary[getQuestionStatus(question, answer, flagged)] += 1;
      summary[isComplete(question, answer) ? 'completed' : 'incomplete'] += 1;
      if (isPartial(question, answer)) summary.partial += 1;
    }
    return summary;
  }

  function isValidKey(question, key) {
    if (!isComplete(question, key)) return false;
    const cleaned = cleanAnswer(question, key);
    const type = questionType(question);
    if (type === 'essay' || type === 'unknown') return false;
    if (type === 'short_text' || type === 'numeric') {
      const policy = question.scoring;
      const values = isRecord(cleaned) ? Object.values(cleaned) : [cleaned];
      const validRule = policy?.policy === 'exact_text' ||
        (type === 'numeric' && policy?.policy === 'numeric_tolerance' &&
          Number.isFinite(policy.tolerance) && policy.tolerance >= 0 &&
          values.every((value) => Number.isFinite(parseNumber(value, policy))));
      if (!validRule) return false;
    }
    if (type === 'composite' && !question.questions.every((child) =>
      (!own(cleaned, child.id) && child.required === false) || isValidKey(child, key[child.id]))) {
      return false;
    }
    if (Array.isArray(cleaned)) return cleaned.length === key.length;
    if (isRecord(cleaned)) return Object.keys(cleaned).length === Object.keys(key).length;
    return true;
  }

  function parseNumber(value, policy) {
    if (typeof value !== 'string') return NaN;
    let input = value.trim();
    if (policy.unit) {
      if (!input.endsWith(policy.unit)) return NaN;
      input = input.slice(0, -policy.unit.length).trimEnd();
    }
    if (policy.decimalSeparator === ',') {
      if (input.includes('.')) return NaN;
      input = input.replace(',', '.');
    }
    if (!/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?$/i.test(input)) return NaN;
    return Number(input);
  }

  function matchesText(question, answer, key) {
    const policy = question.scoring;
    const compare = policy.policy === 'exact_text' ? (left, right) => left === right :
      (left, right) => Math.abs(parseNumber(left, policy) - parseNumber(right, policy)) <= policy.tolerance;
    return isRecord(key) ? Object.keys(key).every((id) => compare(answer[id], key[id])) : compare(answer, key);
  }

  function matchesKey(question, answer, key) {
    const cleaned = cleanAnswer(question, answer);
    switch (questionType(question)) {
      case 'single':
        return cleaned === key;
      case 'multiple':
        return cleaned.length === key.length && key.every((id) => cleaned.includes(id));
      case 'category':
      case 'matching':
        return Object.keys(key).every((id) => cleaned[id] === key[id]);
      case 'ordering':
        return key.every((id, index) => cleaned[index] === id);
      case 'short_text':
      case 'numeric':
        return matchesText(question, cleaned, key);
      case 'composite':
        return question.questions.every((child) =>
          !own(key, child.id) || matchesKey(child, cleaned[child.id], key[child.id]));
      default:
        return false;
    }
  }

  function gradeQuestion(question, answer, key = question.correctAnswer, scoringPolicy = {}) {
    if (!isValidKey(question, key)) return { status: 'ungraded', points: null, maxPoints: null };

    const weight = question.weight ?? 1;
    const maxPoints = weight * (scoringPolicy.correctPoints ?? 1);
    if (!isComplete(question, answer)) {
      return { status: 'unanswered', points: weight * (scoringPolicy.unansweredPoints ?? 0), maxPoints };
    }
    if (!matchesKey(question, answer, key)) {
      return { status: 'incorrect', points: weight * (scoringPolicy.incorrectPoints ?? 0), maxPoints };
    }
    return { status: 'correct', points: maxPoints, maxPoints };
  }

  function grade(pack, session) {
    const policy = pack.scoring || pack.scoringPolicy || {};
    const result = {
      total: pack.questions.length,
      gradable: 0,
      ungraded: 0,
      correct: 0,
      incorrect: 0,
      unanswered: 0,
      score: null,
      points: 0,
      maxPoints: 0,
      ungradedQuestions: []
    };
    for (const question of pack.questions) {
      const item = gradeQuestion(question, session?.answers[question.id], question.correctAnswer, policy);
      result[item.status] += 1;
      if (item.status === 'ungraded') {
        result.ungradedQuestions.push(question.number);
        continue;
      }
      result.gradable += 1;
      result.points += item.points;
      result.maxPoints += item.maxPoints;
    }
    if (result.ungraded === 0 && result.maxPoints > 0) {
      const scale = policy.maxDisplayedScore ?? 100;
      const score = result.points / result.maxPoints * scale;
      result.score = Math.round(Math.max(0, Math.min(scale, score)) * 100) / 100;
    }
    return result;
  }

  function durationSeconds(pack) {
    const minutes = pack.durationMinutes;
    return Number.isFinite(minutes) && minutes > 0 ? Math.max(1, Math.round(minutes * 60)) : 90 * 60;
  }

  function examVersion(pack) {
    if (!versions.has(pack)) {
      const bank = JSON.stringify([pack.version, durationSeconds(pack), pack.scoring,
        pack.scoringPolicy, pack.questions]);
      let hash = 2166136261;
      for (let index = 0; index < bank.length; index += 1) {
        hash = Math.imul(hash ^ bank.charCodeAt(index), 16777619);
      }
      versions.set(pack, (hash >>> 0).toString(36));
    }
    return versions.get(pack);
  }

  function remainingSeconds(session, now = Date.now()) {
    if (!session) return 0;
    const measuredAt = session.status === 'completed' ? session.finishedAt : session.pausedAt ?? now;
    return Math.max(0, Math.min(session.durationSeconds, Math.ceil((session.endAt - measuredAt) / 1000)));
  }

  function elapsedSeconds(session, now = Date.now()) {
    return session ? session.durationSeconds - remainingSeconds(session, now) : 0;
  }

  function finalized(session, reason, now) {
    return {
      ...session,
      status: 'completed',
      pausedAt: null,
      finishedAt: reason === 'timeout' ? session.endAt : Math.max(session.startedAt + session.pausedDurationMs, now),
      completionReason: reason
    };
  }

  function restore(pack, saved) {
    if (!isRecord(saved) || saved.schemaVersion !== schemaVersion ||
        saved.examVersion !== examVersion(pack) || saved.examId !== pack.id ||
        saved.durationSeconds !== durationSeconds(pack) || !Number.isFinite(saved.startedAt) ||
        !['in_progress', 'completed'].includes(saved.status) ||
        !isRecord(saved.answers) || !isRecord(saved.flagged)) return null;

    const pausedAt = saved.pausedAt ?? null;
    const pausedDurationMs = saved.pausedDurationMs ?? 0;
    const earliestActiveTime = saved.startedAt + pausedDurationMs;
    if (!Number.isFinite(pausedDurationMs) || pausedDurationMs < 0 || !Number.isFinite(saved.endAt) ||
        saved.endAt !== saved.startedAt + saved.durationSeconds * 1000 + pausedDurationMs) return null;

    const complete = saved.status === 'completed';
    if (pausedAt !== null && (complete || !Number.isFinite(pausedAt) ||
        pausedAt < earliestActiveTime || pausedAt >= saved.endAt)) return null;
    if (complete && (!Number.isFinite(saved.finishedAt) || saved.finishedAt < earliestActiveTime ||
        saved.finishedAt > saved.endAt || !['manual', 'timeout'].includes(saved.completionReason))) {
      return null;
    }

    const answers = Object.create(null);
    const flagged = Object.create(null);
    for (const question of pack.questions) {
      const id = question.id;
      const cleaned = cleanAnswer(question, own(saved.answers, id) ? saved.answers[id] : null);
      if (hasResponse(cleaned)) answers[id] = cleaned;
      if (own(saved.flagged, id) && saved.flagged[id] === true) flagged[id] = true;
    }

    return {
      schemaVersion,
      examVersion: saved.examVersion,
      examId: pack.id,
      status: saved.status,
      startedAt: saved.startedAt,
      endAt: saved.endAt,
      durationSeconds: saved.durationSeconds,
      pausedAt,
      pausedDurationMs,
      currentQuestionId: hasId(pack.questions, saved.currentQuestionId) ?
        saved.currentQuestionId : pack.questions[0]?.id,
      answers,
      flagged,
      finishedAt: complete ? saved.finishedAt : null,
      completionReason: complete ? saved.completionReason : null
    };
  }

  function browserStorage() {
    try {
      return root.localStorage;
    } catch {
      return null;
    }
  }

  function createSessionStore({ storage = browserStorage(), clock = Date.now } = {}) {
    const memory = new Map();
    let persistent = Boolean(storage);

    function read(key) {
      if (persistent) {
        try {
          const raw = storage.getItem(key);
          if (raw === null) memory.delete(key);
          else memory.set(key, raw);
        } catch {
          persistent = false;
        }
      }
      return memory.get(key);
    }

    function write(key, session) {
      const raw = session ? JSON.stringify(session) : null;
      if (raw === null) memory.delete(key);
      else memory.set(key, raw);
      if (!persistent) return;
      try {
        if (raw === null) storage.removeItem(key);
        else storage.setItem(key, raw);
      } catch {
        persistent = false;
      }
    }

    function load(pack, now = clock()) {
      const key = storagePrefix + pack.id;
      const raw = read(key);
      if (raw === undefined) return null;
      let saved;
      try {
        saved = JSON.parse(raw);
      } catch {
        return null;
      }
      const session = restore(pack, saved);
      if (session?.status === 'in_progress' && session.pausedAt === null && now >= session.endAt) {
        const closed = finalized(session, 'timeout', now);
        write(key, closed);
        return closed;
      }
      return session;
    }

    function start(pack, { fresh = false } = {}) {
      const now = clock();
      if (!fresh) {
        const existing = load(pack, now);
        if (existing) return existing;
      }

      const duration = durationSeconds(pack);
      const session = {
        schemaVersion,
        examVersion: examVersion(pack),
        examId: pack.id,
        status: 'in_progress',
        startedAt: now,
        endAt: now + duration * 1000,
        durationSeconds: duration,
        pausedAt: null,
        pausedDurationMs: 0,
        answers: Object.create(null),
        flagged: Object.create(null),
        currentQuestionId: pack.questions[0]?.id,
        finishedAt: null,
        completionReason: null
      };
      write(storagePrefix + pack.id, session);
      return session;
    }

    function update(pack, transform, { allowPaused = false } = {}) {
      const now = clock();
      const session = load(pack, now);
      if (session?.status !== 'in_progress' || (!allowPaused && session.pausedAt !== null)) return session;
      const updated = transform(session, now);
      if (updated) write(storagePrefix + pack.id, updated);
      return updated || session;
    }

    return {
      get persistent() {
        return persistent;
      },
      load,
      start,
      reset(pack) {
        write(storagePrefix + pack.id, null);
        return null;
      },
      pause(pack) {
        return update(pack, (session, now) => {
          session.pausedAt = Math.max(session.startedAt + session.pausedDurationMs, now);
          return session;
        });
      },
      resume(pack) {
        return update(pack, (session, now) => {
          if (session.pausedAt === null) return null;
          session.pausedDurationMs += Math.max(0, now - session.pausedAt);
          session.endAt = session.startedAt + session.durationSeconds * 1000 + session.pausedDurationMs;
          session.pausedAt = null;
          return session;
        }, { allowPaused: true });
      },
      answer(pack, questionId, value) {
        return update(pack, (session) => {
          const question = pack.questions.find(({ id }) => id === questionId);
          if (!question) return null;
          const cleaned = cleanAnswer(question, value);
          if (questionType(question) === 'multiple' && cleaned.length > selectionBounds(question).max) return null;
          if (hasResponse(cleaned)) session.answers[questionId] = cleaned;
          else delete session.answers[questionId];
          return session;
        });
      },
      flag(pack, questionId, flagged) {
        return update(pack, (session) => {
          if (!hasId(pack.questions, questionId)) return null;
          if (flagged) session.flagged[questionId] = true;
          else delete session.flagged[questionId];
          return session;
        });
      },
      navigate(pack, questionId) {
        return update(pack, (session) => {
          if (!hasId(pack.questions, questionId) || session.currentQuestionId === questionId) return null;
          session.currentQuestionId = questionId;
          return session;
        });
      },
      finish(pack) {
        return update(pack, (session, now) => finalized(session, 'manual', now));
      }
    };
  }

  const engine = {
    createSessionStore,
    durationSeconds,
    remainingSeconds,
    elapsedSeconds,
    isAnswered,
    isComplete,
    isPartial,
    getQuestionStatus,
    summarize,
    gradeQuestion,
    grade
  };

  if (typeof module === 'object' && module.exports) module.exports = engine;
  else root.TryoutEngine = engine;
})(globalThis);
