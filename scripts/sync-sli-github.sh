#!/usr/bin/env bash
set -euo pipefail

repo='leung-tech/sen_application'
root='/home/ubuntu/sen_application'
message='全站 SEN 遊戲互動動畫與拖拉品質升級及公開稽核'

files=(
  'index.html'
  'assets/js/sen-app.js'
  'modules/sli/sli-core-lab.js'
  'SLI_GAMES_DESIGN.md'
  'SLI_IMPLEMENTATION_NOTES.md'
  'SLI_TEACHER_CLASSROOM_GUIDE.md'
  'scripts/audit-sli-core-lab.mjs'
  'sli-core-lab-audit.json'
  'todo.md'
)

if (( $# > 0 )); then
  files=("$@")
fi

for path in "${files[@]}"; do
  raw="$(gh api "repos/${repo}/contents/${path}" --jq .sha 2>/dev/null || true)"
  sha="$(printf '%s' "$raw" | grep -Eo '[0-9a-f]{40}' | tail -n 1 || true)"
  encoded_file="$(mktemp)"
  base64 -w 0 "${root}/${path}" > "$encoded_file"
  payload="$(jq -n --arg message "$message" --rawfile content "$encoded_file" --arg sha "$sha" 'if $sha == "" then {message:$message,content:$content} else {message:$message,content:$content,sha:$sha} end')"
  rm -f "$encoded_file"
  jq -e . <<<"$payload" >/dev/null
  gh api --method PUT "repos/${repo}/contents/${path}" --input <(printf '%s' "$payload") >/dev/null
  printf '同步完成：%s\n' "$path"
done
