#!/bin/sh
set -euo pipefail

# Defaults (can be overridden by environment)
: "${API_BASE_URL:=http://localhost:8000}"
: "${IS_SIGNUP_DISABLED:=false}"

# Ensure boolean looks like a JSON boolean (true/false) not 1/0/True/False
case "$(printf %s "$IS_SIGNUP_DISABLED" | tr '[:upper:]' '[:lower:]')" in
  true|false) IS_SIGNUP_DISABLED=$(printf %s "$IS_SIGNUP_DISABLED" | tr '[:upper:]' '[:lower:]') ;;
  *) IS_SIGNUP_DISABLED=false ;;
esac

export API_BASE_URL IS_SIGNUP_DISABLED

TEMPLATE="/etc/perga/config.json.template"
TARGET="/usr/share/nginx/html/config.json"

# Generate runtime config.json
if [ -f "$TEMPLATE" ]; then
  envsubst < "$TEMPLATE" > "$TARGET"
  echo "Generated runtime $TARGET"
else
  echo "Template $TEMPLATE not found; skipping runtime config generation" >&2
fi

# Exec the passed command (default: nginx)
exec "$@"
