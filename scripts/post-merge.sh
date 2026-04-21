#!/bin/bash
set -e

npm install --legacy-peer-deps
npm run db:push --force

echo "Populating product slugs for any new products..."
psql "$DATABASE_URL" -c "
UPDATE products SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(name, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    ),
    '(^-|-\$)', '', 'g'
  )
) WHERE slug IS NULL;
" 2>/dev/null || true
