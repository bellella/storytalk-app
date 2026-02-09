import { QuizDtoData } from '@/lib/api/generated/model/quizDtoData';

// Runtime type guards
export function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

export function isStr(v: unknown): v is string {
  return typeof v === 'string';
}

export function isTokenArray(
  v: unknown
): v is Array<{ id: string; t: string }> {
  return (
    Array.isArray(v) && v.every((x) => isObj(x) && isStr(x.id) && isStr(x.t))
  );
}

export function isStrArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every(isStr);
}

// Sentence Build types and parser
export type SentenceBuildParsed = {
  promptKorean?: string;
  tokensAll: Array<{ id: string; t: string }>;
  tokenTextMap: Record<string, string>;
  answerTokenIds: string[];
  punctuation: string;
};

export function parseSentenceBuildData(
  data: QuizDtoData | undefined
): SentenceBuildParsed | null {
  if (!isObj(data)) return null;

  const tokensAll = data.tokensAll;
  const answerTokenIds = data.answerTokenIds;

  if (!isTokenArray(tokensAll)) return null;
  if (!isStrArray(answerTokenIds)) return null;

  const allIds = new Set(tokensAll.map((t) => t.id));
  if (!answerTokenIds.every((id) => allIds.has(id))) return null;

  const tokenTextMap: Record<string, string> = {};
  for (const t of tokensAll) tokenTextMap[t.id] = t.t;

  let punctuation = '';
  if (isObj(data.settings) && isObj(data.settings.autoPunctuation)) {
    const append = data.settings.autoPunctuation.append;
    if (isStr(append)) punctuation = append;
  }

  return {
    promptKorean: isStr(data.promptKorean) ? data.promptKorean : undefined,
    tokensAll,
    tokenTextMap,
    answerTokenIds,
    punctuation,
  };
}

// Sentence Cloze types and parser
export type SentenceClozeParsed = {
  promptKorean?: string;
  parts: Array<{ type: 'text'; t: string } | { type: 'slot'; slotId: string }>;
  choices: Array<{ id: string; t: string }>;
  answerBySlot: Record<string, string>;
  slotIds: string[];
};

export function parseSentenceClozeData(
  data: QuizDtoData | undefined
): SentenceClozeParsed | null {
  if (!isObj(data)) return null;

  const partsRaw = data.parts;
  const choicesRaw = data.choices;
  const answerBySlotRaw = data.answerBySlot;

  if (!Array.isArray(partsRaw)) return null;
  if (!isTokenArray(choicesRaw)) return null;
  if (!isObj(answerBySlotRaw)) return null;

  const parts: SentenceClozeParsed['parts'] = [];
  const slotIds: string[] = [];

  for (const p of partsRaw) {
    if (!isObj(p) || !isStr(p.type)) return null;
    if (p.type === 'text') {
      if (!isStr(p.t)) return null;
      parts.push({ type: 'text', t: p.t });
    } else if (p.type === 'slot') {
      if (!isStr(p.slotId)) return null;
      parts.push({ type: 'slot', slotId: p.slotId });
      slotIds.push(p.slotId);
    } else {
      return null;
    }
  }

  if (new Set(slotIds).size !== slotIds.length) return null;

  const answerBySlot: Record<string, string> = {};
  for (const [k, v] of Object.entries(answerBySlotRaw)) {
    if (!isStr(k) || !isStr(v)) return null;
    answerBySlot[k] = v;
  }

  if (!slotIds.every((sid) => !!answerBySlot[sid])) return null;

  const choiceIds = new Set(choicesRaw.map((c) => c.id));
  if (!slotIds.every((sid) => choiceIds.has(answerBySlot[sid]))) return null;

  return {
    promptKorean: isStr(data.questionKorean) ? data.questionKorean : undefined,
    parts,
    choices: choicesRaw,
    answerBySlot,
    slotIds,
  };
}
