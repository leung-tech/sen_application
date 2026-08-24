import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const file = new URL('../modules/gifted/gifted-attachment-arcade.js', import.meta.url);
const source = fs.readFileSync(file, 'utf8');
const sandbox = { window: {}, console };
sandbox.window.window = sandbox.window;
vm.runInNewContext(source, sandbox, { filename: file.pathname });

const lab = sandbox.window.GIFTED_ATTACHMENT_ARCADE;
assert.ok(lab, '找不到 GIFTED_ATTACHMENT_ARCADE 公開入口');
const audit = lab.audit();
for (const stage of ['lower', 'upper', 'junior', 'senior']) {
  assert.equal(audit[stage].count, 10, `${stage} 應有 10 項附件整合任務`);
  assert.equal(audit[stage].minRounds, 8, `${stage} 每項任務至少應有 8 題`);
  assert.equal(audit[stage].underEight.length, 0, `${stage} 不應有少於 8 題的任務`);
  const ids = lab.activityCards(stage).map((item) => item.giftedAttachmentActivity);
  assert.equal(new Set(ids).size, ids.length, `${stage} 任務識別碼不可重覆`);
}
console.log('Gifted／2e 附件整合稽核通過：四學段各 10 項，每項 8 題，識別碼唯一。');
