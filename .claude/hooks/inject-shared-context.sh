#!/bin/bash
# 비공개 폴더의 Claude·Codex 공용 메모(SHARED_CONTEXT.md)와 핸드오프(CLAUDE.md 현재 상태)를
# 세션 시작·컴팩션 직전에 컨텍스트로 자동 주입한다. 공개 저장소에는 내용을 두지 않으므로, 파일이 없으면(다른 사람 클론) 아무것도 안 한다.
set -euo pipefail

event="${1:-SessionStart}"
priv="${TENEOK_PRIVATE_DIR:-$HOME/Documents/develop/10-eok-private}"
ctx=""
for name in CLAUDE.md SHARED_CONTEXT.md; do
  f="$priv/$name"
  [ -f "$f" ] || continue
  ctx+="[자동 주입: 비공개 $name] ($f)

$(cat "$f")

"
done
[ -n "$ctx" ] || exit 0

prefix="아래는 공개 저장소 밖 비공개 폴더의 문서다. CLAUDE.md는 토스 미니앱 진행 상태·결정(현재 상태 블록이 핸드오프 정본), SHARED_CONTEXT.md는 Claude·Codex 공용 메모다. 작업 중 비자명한 걸 배우면 SHARED_CONTEXT.md에 직접 적고(/shared-context-update), 진행 상태가 바뀌면 비공개 CLAUDE.md·TOSS_MASTERPLAN.md를 갱신해 그 폴더에서 커밋한다. 이 내용을 공개 저장소에 옮겨 적지 않는다.

"
jq -n --arg name "$event" --arg ctx "$prefix$ctx" \
  '{hookSpecificOutput: {hookEventName: $name, additionalContext: $ctx}}'
