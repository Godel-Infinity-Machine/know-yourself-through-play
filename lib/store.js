import { mkdir, readFile, writeFile, rename, unlink, open } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { homedir } from 'node:os';
import { randomUUID } from 'node:crypto';
import { freshMemory, validateMemory } from './model.js';
export function memoryPath(configured) {
    return resolve(configured || process.env.KYTP_MEMORY_FILE || resolve(homedir(), '.dsh', 'know-yourself-through-play', 'taste-memory.json'));
}
/** One JSON file; an exclusive lock rejects overlapping writers rather than losing updates. */
export class JsonTasteStore {
    path;
    current = freshMemory();
    constructor(path) { this.path = resolve(path); }
    snapshot() { return structuredClone(this.current); }
    async load() {
        try {
            const data = await readFile(this.path, 'utf8');
            if (Buffer.byteLength(data) > 8_000_000)
                throw new Error('Memory is too large; original file preserved');
            this.current = validateMemory(JSON.parse(data));
        }
        catch (error) {
            if (error.code === 'ENOENT')
                this.current = freshMemory();
            else
                throw error;
        }
        return this.snapshot();
    }
    async change(update) {
        await mkdir(dirname(this.path), { recursive: true, mode: 0o700 });
        let lock;
        try {
            lock = await open(`${this.path}.lock`, 'wx', 0o600);
        }
        catch (error) {
            if (error.code === 'EEXIST')
                throw new Error('Memory is busy or a previous process crashed; verify no writer is running before removing its .lock file');
            throw error;
        }
        const temporary = `${this.path}.${randomUUID()}.tmp`;
        try {
            await lock.writeFile(String(process.pid));
            const next = await this.load();
            update(next);
            next.revision += 1;
            const checked = validateMemory(next);
            const handle = await open(temporary, 'wx', 0o600);
            try {
                await handle.writeFile(JSON.stringify(checked, null, 2) + '\n');
                await handle.sync();
            }
            finally {
                await handle.close();
            }
            await rename(temporary, this.path);
            this.current = checked;
            return this.snapshot();
        }
        finally {
            await unlink(temporary).catch(e => { if (e.code !== 'ENOENT')
                throw e; });
            await lock.close();
            await unlink(`${this.path}.lock`);
        }
    }
    async clear() {
        await this.change(memory => Object.assign(memory, freshMemory(), { revision: memory.revision }));
    }
    async export(destination) {
        if (resolve(destination) === this.path)
            throw new Error('Choose a different export file');
        await this.load();
        await writeFile(destination, JSON.stringify(this.current, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
    }
}
