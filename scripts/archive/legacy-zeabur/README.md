# Archived: Legacy Zeabur Scripts

These scripts were used during the one-time migration from the self-hosted Supabase instance at `https://prspares.zeabur.app` (demo JWT keys) to the official Supabase project `https://eiikisplpnbeiscunkap.supabase.co`.

**They are no longer functional** — the zeabur instance has been decommissioned, and the demo service_role keys hardcoded inside these files only authenticated against that dead instance.

Kept here for git history / reference only. Do NOT run. If you need similar functionality against the current Supabase, write a new script that reads credentials from `.env.local`:

```js
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);
```

Archived: 2026-04-08
