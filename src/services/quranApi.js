import { QURAN_API_BASE } from '../utils/constants';

const cache = new Map();

function cacheKey(endpoint, params) {
  return `${endpoint}?${new URLSearchParams(params).toString()}`;
}

async function fetchApi(endpoint, params = {}) {
  const key = cacheKey(endpoint, params);
  if (cache.has(key)) return cache.get(key);

  const base = QURAN_API_BASE.endsWith('/') ? QURAN_API_BASE : `${QURAN_API_BASE}/`;
  const url = new URL(endpoint.replace(/^\//, ''), base);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Quran API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  cache.set(key, data);
  return data;
}

export async function getJuzList() {
  const data = await fetchApi('/juzs');
  return data.juzs;
}

export async function getChapters() {
  const data = await fetchApi('/chapters');
  return data.chapters;
}

export async function getVersesByJuz(juzNumber, { language = 'en', page = 1, perPage = 50 } = {}) {
  const data = await fetchApi(`/verses/by_juz/${juzNumber}`, {
    words: 'true',
    language,
    word_fields: 'text_uthmani',
    per_page: String(perPage),
    page: String(page),
  });
  return {
    verses: data.verses,
    pagination: data.pagination,
  };
}

export async function getVerseTranslation(verseKey, translationId) {
  const data = await fetchApi(`/verses/by_key/${verseKey}`, {
    translations: String(translationId),
  });
  return data.verse;
}
