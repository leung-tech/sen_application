import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const repository = 'leung-tech/sen_application';
const branch = 'main';
const root = '/home/ubuntu/sen_application';
const files = [
  'index.html', 'MODULAR_HTML_GUIDE.md',
  'assets/css/sen-ui.css', 'assets/js/sen-app.js',
  'modules/manifest.json', 'modules/core/module-entry.js',
  'modules/spld/index.html', 'modules/spld/p1-p3.html', 'modules/spld/p4-p6.html', 'modules/spld/s1-s3.html', 'modules/spld/s4-s6.html', 'modules/spld/spld-stage-data.js', 'modules/spld/spld-p1-lab.js', 'modules/spld/spld-p4-lab.js', 'modules/spld/spld-s1-lab.js', 'modules/spld/spld-s4-lab.js',
  'modules/adhd/index.html', 'modules/adhd/adhd-stage-data.js', 'modules/adhd/adhd-focus-lab.js',
  'modules/asd/index.html', 'modules/asd/asd-stage-data.js',
  'modules/ebd/index.html', 'modules/ebd/ebd-stage-data.js',
  'modules/id/index.html', 'modules/id/id-stage-data.js',
  'modules/gifted/index.html', 'modules/hi/index.html', 'modules/gifted-hi/index.html', 'modules/gifted-hi/gifted-hi-stage-data.js',
  'modules/sli/index.html', 'modules/sli/sli-stage-data.js', 'modules/mi/index.html', 'modules/mi/mi-stage-data.js'
];
const legacyFiles = ['spld-stage-data.js', 'spld-p1-lab.js', 'spld-p4-lab.js', 'adhd-stage-data.js', 'adhd-focus-lab.js', 'asd-stage-data.js', 'ebd-stage-data.js', 'id-stage-data.js', 'gifted-hi-stage-data.js'];

function api(args, input) {
  return execFileSync('gh', ['api', ...args], { input, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], env: { ...process.env, NO_COLOR: '1' } });
}

function getSha(path) {
  try { return execFileSync('gh', ['api', `repos/${repository}/contents/${path}?ref=${branch}`, '--jq', '.sha'], { encoding: 'utf8', env: { ...process.env, NO_COLOR: '1' } }).trim(); }
  catch (_) { return undefined; }
}

for (const path of files) {
  const content = await readFile(`${root}/${path}`);
  const sha = getSha(path);
  const body = { message: `refactor: modularize ${path}`, content: content.toString('base64'), branch };
  if (sha) body.sha = sha;
  api(['--method', 'PUT', `repos/${repository}/contents/${path}`, '--input', '-'], JSON.stringify(body));
  console.log(`${sha ? 'updated' : 'created'} ${path}`);
}

for (const path of legacyFiles) {
  const sha = getSha(path);
  if (!sha) continue;
  api(['--method', 'DELETE', `repos/${repository}/contents/${path}`, '--input', '-'], JSON.stringify({ message: `refactor: move ${path} into modules`, sha, branch }));
  console.log(`removed legacy ${path}`);
}

console.log('Modular GitHub Pages sync complete.');
