CANORA V2 deploy notes
1. Upload these files to a GitHub repository.
2. Import repo into Vercel.
3. In Vercel Project Settings > Environment Variables add:
   SUPABASE_URL = your project URL
   SUPABASE_SECRET_KEY = your secret key (server-only)
4. Redeploy after adding environment variables.
5. Supabase SQL: table cans created earlier. RLS enabled; no public policies required because API uses server-side secret.

Links are bearer-access: anyone with the link can read that message. Do not share sensitive information. This starter has no abuse throttling; consider adding rate limiting before public launch.
