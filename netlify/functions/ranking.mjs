import { getStore } from '@netlify/blobs';

const STORE_NAME = 'if-rush-ranking';
const RANKING_KEY = 'global-top';
const RANKING_LIMIT = 10;
const MAX_BODY_BYTES = 4096;
const JSON_HEADERS = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
};

function jsonResponse(status, payload) {
    return new Response(JSON.stringify(payload), {
        status,
        headers: JSON_HEADERS,
    });
}

function sanitizeRankingName(value) {
    const cleanName = String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase()
        .replace(/[^A-Z]/g, '')
        .slice(0, 14);
    return cleanName || 'ALUNOIF';
}

function compareRankingEntries(a, b) {
    if (b.score !== a.score) return b.score - a.score;
    if (b.time !== a.time) return b.time - a.time;
    return a.name.localeCompare(b.name);
}

function normalizeScoreEntry(entry) {
    if (!entry || !Number.isFinite(Number(entry.score))) return null;
    return {
        name: sanitizeRankingName(entry.name),
        score: Math.min(999999, Math.max(0, Math.floor(Number(entry.score)))),
        time: Math.min(36000, Math.max(0, Math.floor(Number(entry.time || 0)))),
    };
}

function normalizeRanking(input) {
    const list = Array.isArray(input) ? input : Array.isArray(input?.ranking) ? input.ranking : [];
    return list
        .map(normalizeScoreEntry)
        .filter(Boolean)
        .sort(compareRankingEntries)
        .slice(0, RANKING_LIMIT);
}

function entriesMatch(entry, target) {
    return entry
        && target
        && entry.name === target.name
        && entry.score === target.score
        && entry.time === target.time;
}

async function readRanking() {
    const store = getStore(STORE_NAME);
    const savedRanking = await store.get(RANKING_KEY, { type: 'json' });
    return normalizeRanking(savedRanking);
}

async function writeRanking(ranking) {
    const store = getStore(STORE_NAME);
    await store.setJSON(RANKING_KEY, {
        ranking,
        updatedAt: new Date().toISOString(),
    });
}

async function readRequestJson(request) {
    const length = Number(request.headers.get('content-length') || 0);
    if (length > MAX_BODY_BYTES) return null;
    try {
        const rawBody = await request.text();
        if (rawBody.length > MAX_BODY_BYTES) return null;
        return JSON.parse(rawBody);
    } catch {
        return null;
    }
}

export default async function rankingHandler(request) {
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                Allow: 'GET, POST, DELETE, OPTIONS',
            },
        });
    }

    if (request.method === 'GET') {
        try {
            const ranking = await readRanking();
            return jsonResponse(200, { ranking, source: 'online' });
        } catch {
            return jsonResponse(503, { error: 'ranking_unavailable', ranking: [] });
        }
    }

    if (request.method === 'POST') {
        const payload = await readRequestJson(request);
        const entry = normalizeScoreEntry(payload?.entry || payload);
        if (!entry) {
            return jsonResponse(400, { error: 'invalid_score_entry' });
        }

        try {
            const currentRanking = await readRanking();
            const ranking = normalizeRanking([...currentRanking, entry]);
            await writeRanking(ranking);
            return jsonResponse(200, { ranking, source: 'online' });
        } catch {
            return jsonResponse(503, { error: 'ranking_unavailable', ranking: [] });
        }
    }

    if (request.method === 'DELETE') {
        const payload = await readRequestJson(request);
        const requestedIndex = Math.floor(Number(payload?.index));
        const targetEntry = normalizeScoreEntry(payload?.entry);

        try {
            const currentRanking = await readRanking();
            let deleteIndex = Number.isInteger(requestedIndex) ? requestedIndex : -1;
            if (deleteIndex < 0 || deleteIndex >= currentRanking.length || (targetEntry && !entriesMatch(currentRanking[deleteIndex], targetEntry))) {
                deleteIndex = currentRanking.findIndex(entry => entriesMatch(entry, targetEntry));
            }
            if (deleteIndex < 0) {
                return jsonResponse(200, { ranking: currentRanking, source: 'online', deleted: false });
            }

            const ranking = currentRanking.filter((_, index) => index !== deleteIndex);
            await writeRanking(ranking);
            return jsonResponse(200, { ranking, source: 'online', deleted: true });
        } catch {
            return jsonResponse(503, { error: 'ranking_unavailable', ranking: [] });
        }
    }

    return jsonResponse(405, { error: 'method_not_allowed' });
}
