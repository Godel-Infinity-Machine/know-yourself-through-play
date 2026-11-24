import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

const root = process.cwd(), files = []
async function walk(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    if (['node_modules','.git','work','data'].includes(item.name)) continue
    const path = join(dir, item.name)
    if (item.isDirectory()) await walk(path)
    else files.push(path)
  }
}
await walk(root)
const errors = []
for (const file of files) {
  const name = relative(root,file).replaceAll('\\','/'), content = await readFile(file, 'utf8')
  if (/^\.env(\.|$)/.test(name) && name !== '.env.example') errors.push(`${name}: local configuration file`)
  if (/taste-memory.*\.json$|steam-library.*\.json$|\.log$/.test(name)) errors.push(`${name}: private/runtime file`)
  for (const pattern of [/gh[pousr]_[A-Za-z0-9]{30,}/, /github_pat_[A-Za-z0-9_]{30,}/, /sk-[A-Za-z0-9]{24,}/, /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/, /STEAM_API_KEY\s*=\s*[A-Fa-f0-9]{32}/]) {
    if (pattern.test(content)) errors.push(`${name}: credential pattern matched (value redacted)`)
  }
  // The sole SteamID64 literal allowed is the explicitly synthetic transport fixture.
  if (name !== 'tests/steam.test.mjs' && /7656119\d{10}/.test(content)) errors.push(`${name}: possible private Steam identifier`)
}
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1 }
else console.log(`Audited ${files.length} deliverable files: no credential/private-library patterns found. Pattern scanning is not a guarantee; review staged files before publishing.`)
