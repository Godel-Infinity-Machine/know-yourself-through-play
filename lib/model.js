import { randomUUID } from 'node:crypto';
export const freshMemory = () => ({ version: 1, revision: 0, facts: [], observations: [], hypotheses: [], importState: null });
export const id = (prefix) => `${prefix}-${randomUUID().slice(0, 8)}`;
export function object(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value))
        throw new Error('Expected an object');
    return value;
}
export function text(value, name, max = 2000) {
    if (typeof value !== 'string' || !value.trim() || value.length > max || /\u0000/.test(value))
        throw new Error(`Invalid ${name}`);
    return value.trim();
}
export function strings(value, name) {
    if (!Array.isArray(value) || value.length > 30)
        throw new Error(`Invalid ${name}`);
    return [...new Set(value.map(v => text(v, name, 600)))];
}
export function validateMemory(value) {
    const m = object(value);
    if (m.version !== 1 || !Number.isSafeInteger(m.revision) || Number(m.revision) < 0)
        throw new Error('Unsupported or corrupt memory; original file preserved');
    for (const key of ['facts', 'observations', 'hypotheses'])
        if (!Array.isArray(m[key]))
            throw new Error(`Corrupt memory: ${key}`);
    if (m.facts.length > 500 || m.hypotheses.length > 100 || m.observations.length > 20000)
        throw new Error('Memory capacity exceeded; export and curate it locally');
    const facts = m.facts.map(item => {
        const f = object(item), source = object(f.source);
        if (source.kind !== 'user')
            throw new Error('Invalid fact provenance');
        return { id: text(f.id, 'id'), quote: text(f.quote, 'quote'), createdAt: text(f.createdAt, 'createdAt'), source: { kind: 'user', sessionId: text(source.sessionId, 'sessionId'), messageId: text(source.messageId, 'messageId') } };
    });
    const observations = m.observations.map(item => {
        const o = object(item);
        if (!Number.isSafeInteger(o.appId) || Number(o.appId) < 1 || o.owned !== true || o.source !== 'steam-api' || !Number.isSafeInteger(o.playtimeMinutes) || Number(o.playtimeMinutes) < 0)
            throw new Error('Invalid observation');
        for (const key of ['recentMinutes', 'lastPlayed'])
            if (o[key] !== null && (!Number.isSafeInteger(o[key]) || Number(o[key]) < 0))
                throw new Error(`Invalid ${key}`);
        return { appId: o.appId, name: text(o.name, 'name', 300), owned: true, playtimeMinutes: o.playtimeMinutes, recentMinutes: o.recentMinutes, lastPlayed: o.lastPlayed, source: 'steam-api', observedAt: text(o.observedAt, 'observedAt') };
    });
    const hypotheses = m.hypotheses.map(item => {
        const h = object(item);
        if (!['tentative', 'confirmed', 'rejected', 'revised'].includes(String(h.confirmation)))
            throw new Error('Invalid confirmation');
        const lists = Object.fromEntries(['action', 'feedback', 'reward', 'friction', 'support', 'counterEvidence', 'conditions', 'feedbackFactIds'].map(k => [k, strings(h[k], k)]));
        return { ...lists, id: text(h.id, 'id'), description: text(h.description, 'description'), confirmation: h.confirmation, supersedes: h.supersedes === null ? null : text(h.supersedes, 'supersedes'), createdAt: text(h.createdAt, 'createdAt'), updatedAt: text(h.updatedAt, 'updatedAt') };
    });
    const allIds = [...facts, ...hypotheses].map(x => x.id);
    if (new Set(allIds).size !== allIds.length)
        throw new Error('Duplicate memory IDs');
    const evidenceIds = new Set([...facts.map(f => f.id), ...observations.map(o => `steam:${o.appId}`)]);
    for (const h of hypotheses) {
        if (!h.support.length || h.support.some(s => !evidenceIds.has(s)) || h.feedbackFactIds.some(s => !facts.some(f => f.id === s)))
            throw new Error('Unresolved evidence reference');
    }
    let importState = null;
    if (m.importState !== null) {
        const s = object(m.importState);
        if (typeof s.accountHash !== 'string' || !/^[a-f0-9]{64}$/.test(s.accountHash))
            throw new Error('Invalid import account hash');
        importState = { importedAt: text(s.importedAt, 'importedAt'), country: text(s.country, 'country', 80), accountHash: s.accountHash };
    }
    return { version: 1, revision: m.revision, facts, observations, hypotheses, importState };
}
export function parseHypothesis(value, memory) {
    const h = object(value), now = new Date().toISOString();
    const candidate = { id: id('h'), description: text(h.description, 'description'), action: strings(h.action, 'action'), feedback: strings(h.feedback, 'feedback'), reward: strings(h.reward, 'reward'), friction: strings(h.friction, 'friction'), support: strings(h.support, 'support'), counterEvidence: strings(h.counterEvidence, 'counterEvidence'), conditions: strings(h.conditions, 'conditions'), confirmation: 'tentative', feedbackFactIds: [], supersedes: null, createdAt: now, updatedAt: now };
    validateMemory({ ...memory, hypotheses: [...memory.hypotheses, candidate] });
    return candidate;
}
