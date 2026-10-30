# PRMSU Campus Explorer (static site + Supabase)
Static HTML/JS site; Supabase provides the database, admin login and image storage. **All sample data is PLACEHOLDER** (fake coordinates) — replace it via the admin page.

1. **Supabase**: create a project. SQL Editor > run `supabase/schema.sql`.
2. **Disable public signups**: Authentication > Providers/Sign In > turn off "Allow new users to sign up".
3. **Create admin**: Authentication > Users > Add user (email + password). Then in SQL Editor: `insert into admins(user_id) select id from auth.users where email='you@example.com';`
4. **Config**: Project Settings > API, copy URL and `anon` key into `js/config.js`. (The anon key is meant to be public; Row Level Security restricts writes to admins.) Never put the `service_role` key in this project.
5. **Google Maps**: Google Cloud > enable Maps JavaScript API + Maps Embed API > create a key, restrict by HTTP referrer (your domain and `localhost`) and those APIs > paste into `MAPS_API_KEY`. Set `MAP_LAT/MAP_LNG` to the verified campus center.
6. **Run locally**: ES modules need a server (not file://). Use `python -m http.server` or VS Code Live Server and open `/index.html`.
7. **Deploy**: upload the folder to Netlify, Cloudflare Pages, Vercel or GitHub Pages (no build step). In Supabase > Authentication > URL Configuration, add your site URL.
8. Admin is at `/admin.html`.
