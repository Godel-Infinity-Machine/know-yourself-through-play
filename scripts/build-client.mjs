import { readFile, writeFile } from 'node:fs/promises'
import ts from 'typescript'
import { createResearchRemote } from '../lib/research.js'

const source = await readFile(new URL('../src/client.ts', import.meta.url), 'utf8')
const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2023 } }).outputText
const bundle = `// Built for DSH's native lazy-CJS browser module loader.\nwindow.__ModuleLoader__.load({ id: "dsh-know-yourself-through-play", factory: (require) => {\nconst module = { exports: {} }; const exports = module.exports;\n${output}\nreturn module.exports.createResearchClient(require("react"), (${createResearchRemote.toString()})());\n} });\n`
await writeFile(new URL('../lib/client.bundle.js', import.meta.url), bundle)
