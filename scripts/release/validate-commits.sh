#!/usr/bin/env bash
set -euo pipefail

commit_range="${1:-HEAD~1..HEAD}"
allowed='feat|fix|perf|refactor|docs|build|chore|test|ci|revert'
invalid=0

while IFS= read -r subject; do
  [[ -z "${subject}" ]] && continue
  if ! [[ "${subject}" =~ ^(${allowed})(\([[:alnum:]_.\/-]+\))?!?:[[:space:]]+[^[:space:]] ]]; then
    printf 'Commit inválido: %s\n' "${subject}" >&2
    invalid=1
  fi
done < <(git log --no-merges --format='%s' "${commit_range}")

if (( invalid )); then
  cat >&2 <<'EOF'
Usá Conventional Commits: <tipo>[ámbito opcional][!]: <descripción>
Tipos válidos: feat, fix, perf, refactor, docs, build, chore, test, ci, revert.
Ejemplos: feat: agrega reservas, fix(web): corrige el calendario, feat!: cambia el contrato.
EOF
  exit 1
fi
